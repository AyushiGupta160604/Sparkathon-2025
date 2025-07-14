from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS 
from quantity import detect_quantity
from ocr import extract_expiry_status
from freshness import get_freshness_score
from inventory import save_inventory, get_expected_quantity,delete_inventory,get_inventory_item
# from openai import OpenAI
import os
import requests  # Required to call UPCItemDB


# Initialize OpenAI client
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# List of perishable classes
PERISHABLE_CLASSES = ['apple', 'banana', 'carrot', 'tomato', 'sandwich', 'donut', 'pizza', 'broccoli', 'orange']

def get_product_type_from_upc(upc_code):
    url = f"https://api.upcitemdb.com/prod/trial/lookup?upc={upc_code}"
    response = requests.get(url)
    
    if response.status_code != 200:
        raise Exception(f"UPCItemDB Error: {response.status_code}")
    
    data = response.json()
    items = data.get("items", [])
    
    if not items:
        raise Exception("No product found for this UPC code.")
    
    return items[0].get("title", "").lower()


@app.route('/verify', methods=['POST'])
def verify():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    image_path = "input.jpg"
    image.save(image_path)

    try:
        # FIXED: Correct key for productId
        product_id = request.form.get("productId")
        if not product_id:
            return jsonify({"error": "Missing productId in form"}), 400

        # Quantity detection
        items_detected, _ = detect_quantity(image_path)
        object_counts = items_detected.get("object_counts", {})
        quantity = sum(object_counts.values())

        expected_quantity = get_expected_quantity(product_id)

        # Check perishable
        detected_classes = [cls.lower() for cls in object_counts]
        is_perishable = any(cls in PERISHABLE_CLASSES for cls in detected_classes)

        # OCR
        extracted_text, expiry_date, expiry_status, status_color = extract_expiry_status(image_path)

        # Freshness
        freshness_score = get_freshness_score(image_path) if is_perishable else None

        # Final result
        # Try to fetch product type from UPCItemDB
        try:
            expected_type = get_product_type_from_upc(product_id)
        except Exception as upc_error:
            expected_type = None  # Soft fallback if API fails

            # Match YOLO class with expected product type
        yolo_classes = [cls.lower() for cls in object_counts]
        matches_type = any(expected_type and expected_type.find(cls) != -1 for cls in yolo_classes)
        print(matches_type, expected_type, yolo_classes)
            # Final result logic
        is_pass = (
                expected_quantity is not None and
                quantity == expected_quantity and
                expiry_status != "Expired" and
                (freshness_score is None or freshness_score >= 65) 
                # and matches_type
        )


        result = {
            "result": "PASS" if is_pass else "FAIL",
            "details": {
                "detected_items": items_detected,
                "quantity": quantity,
                "is_perishable": is_perishable,
                "ocr": {
                   "text": extracted_text,
                   "expiry_date": expiry_date,
                   "status": expiry_status,
                   "color": status_color
            },
            "freshness_score": freshness_score,
            "product_type": expected_type,
            "matches_product_type": matches_type
       }
   }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)


@app.route('/inventory', methods=['POST'])
def add_inventory():
    data = request.get_json()
    product_id = data.get("productId")
    product_name = data.get("productName")
    expected_quantity = data.get("expectedQuantity")

    if not product_id or not expected_quantity:
        return jsonify({"error": "Missing productId or expectedQuantity"}), 400

    save_inventory(product_id, product_name, expected_quantity)
    return jsonify({"message": "Inventory saved successfully"}), 200

@app.route('/scan', methods=['POST'])
def handle_scan():
    """
    STEP 1️⃣:
    Called when QR is scanned.
    Only checks productId and tells if label info exists or not.
    """
    data = request.get_json()
    product_id = data.get("productId")
    # print("[DEBUG] Scanned productId:", product_id)

    if not product_id:
        return jsonify({"error": "Missing productId"}), 400

    item = get_inventory_item(product_id)

    if item:
        return jsonify({
            "message": "Product already exists in inventory.",
            "productId": product_id,
            "productName": item.get("productName"),
            "expectedQuantity": item.get("expectedQuantity")
        }), 200
    else:
        return jsonify({
            "message": "Product scanned. Awaiting label upload.",
            "productId": product_id
        }), 200

@app.route('/scan-label', methods=['POST'])
def scan_label():
    if 'labelImage' not in request.files:
        return jsonify({"error": "No label image uploaded"}), 400

    product_id = request.form.get("productId")
    if not product_id:
        return jsonify({"error": "Missing productId"}), 400

    image = request.files['labelImage']
    image_path = "label.jpg"
    image.save(image_path)

    try:
        from ocr import extract_expiry_status, extract_product_name_and_quantity

        text, *_ = extract_expiry_status(image_path)
        # print("[OCR TEXT]", text)

        product_name, expected_quantity = extract_product_name_and_quantity(text)
        # print("[PARSED NAME]", product_name)
        # print("[PARSED QTY]", expected_quantity)

        if not product_name or expected_quantity is None:
            return jsonify({"error": "Failed to extract metadata"}), 422

        # 🔥 Add type check
        if not isinstance(expected_quantity, int):
            raise ValueError(f"Expected quantity must be int, got {type(expected_quantity)}: {expected_quantity}")

        # Save to DB
        from inventory import save_inventory
        save_inventory(product_id, product_name, expected_quantity)

        return jsonify({
            "message": "Label scanned and inventory saved",
            "productId": product_id,
            "productName": product_name,
            "expectedQuantity": expected_quantity
        }), 200

    except Exception as e:
        # print("[ERROR in /scan-label]", str(e))  # 👈 Log the error
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)



if __name__ == '__main__':
    app.run(debug=True)
