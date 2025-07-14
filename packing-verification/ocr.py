import cv2, pytesseract, re
from datetime import datetime

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_expiry_status(image_path):
    img = cv2.imread(image_path)
    # In ocr.py
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, 
                             cv2.THRESH_BINARY, 11, 2)

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    text = pytesseract.image_to_string(thresh, config='--oem 3 --psm 6')

    expiry_date = extract_expiry_date(text)
    status, color = check_expiry_status(expiry_date)
    return text, expiry_date, status, color

def extract_expiry_date(text):
    patterns = [r'(\d{2}[/-]\d{2}[/-]\d{4})', r'(\d{2}[/-]\d{4})']
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)
    return "Not Found"

def check_expiry_status(expiry_date):
    try:
        date_format = "%d-%m-%Y" if "-" in expiry_date else "%d/%m/%Y"
        if len(expiry_date) <= 7:
            date_format = "%m-%Y"
        exp_date = datetime.strptime(expiry_date, date_format)
        days_left = (exp_date - datetime.now()).days
        if days_left < 0:
            return "Expired", "red"
        elif days_left <= 7:
            return "Near Expiry", "orange"
        else:
            return "Fresh", "green"
    except:
        return "Invalid", "gray"

def extract_product_name_and_quantity(text):
    # print("[DEBUG OCR TEXT]", text)

    # More robust regex: captures multiple words or special characters
    name_match = re.search(r'(?:Name|MODEL NAME)[:\-]?\s*([A-Za-z0-9 \-()\/]+)', text, re.IGNORECASE)
    qty_match = re.search(r'(?:Qty|NET QUANTITY)[:\-]?\s*(\d+)', text, re.IGNORECASE)

    product_name = name_match.group(1).strip() if name_match else "Unknown"
    quantity = int(qty_match.group(1)) if qty_match else 1

    # print(f"[PARSED NAME] {product_name}")
    # print(f"[PARSED QTY] {quantity}")
    return product_name, quantity
