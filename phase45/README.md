# AI-Based Packing Verification System – SPARKTHON-25

This project is part of a larger supply chain management system, focusing on **error detection in packaging** using computer vision and OCR. The goal is to **automatically verify the type, quantity, expiry, and freshness** of packed items before delivery, reducing manual errors and improving efficiency.

---

##  Key Features

- Verifies **item quantity** using object detection (YOLOv8)
- Checks **expiry date** using OCR (Tesseract)
- Assesses **freshness** for perishable items using a custom TensorFlow model
- Matches product type using external UPC (barcode) API
- Works with both perishable and non-perishable goods
- Stores expected product metadata via label image

---

## Project Structure

```

SPARKTHON-25/
├── frontend/                  # React Frontend
│   └── src/
│       └── components/
│           ├── ImageUpload.js      
│           ├── ResultDisplay.js     
│           └── ScanProduct.js      
│       ├── App.css
│       ├── App.js
│       ├── index.js
│       └── logo.png
│
├── packing-verification/     # Flask Backend
│   ├── app.py                # Main API logic
│   ├── ocr.py                # Extracts expiry date, product name, quantity
│   ├── quantity.py           # Detects item count using YOLOv8
│   ├── freshness.py          # Predicts freshness score
│   ├── inventory.py          # MongoDB interactions
│   ├── yolov8n.pt            
│   ├── model_final1/         
│   └── uploads/             

```
---

## Tech Stack

### Frontend
- React 
- Axios for API calls
- CSS for UI styling

### Backend (Flask)
- Flask + Flask-CORS
- OpenCV + YOLOv8 for object detection
- Tesseract OCR for expiry extraction
- TensorFlow model for freshness detection
- MongoDB Atlas for storing inventory data
- External UPCItemDB API for product type inference

---

## ⚙️ Backend APIs

- `POST /scan` – Check if product exists in inventory using productId.
- `POST /scan-label` – Extract product name and expected quantity using OCR from label image.
- `POST /inventory` – Save product data (productId, name, quantity) into MongoDB.
- `POST /verify` – Verify uploaded open-box image for quantity, freshness, expiry using AI.

---

## 📦 Sample Schema

### Inventory Item

```js
{
  productId: String,
  productName: String,
  expectedQuantity: Number
}
```

## How It Works

### 🔹 Step 0: QR/Barcode Scan 
- Scans **QR/Barcode** on product label to get `productId`.
- Checks if product already exists in inventory.
- If not found, prompts to upload label for metadata extraction.

### 🔹 Step 1: Label Scan
- Uploads **label image** containing product name and quantity.
- Uses `ocr.py` to extract:
  - `productName`
  - `expectedQuantity`
- Saves this metadata to MongoDB using `/inventory` API.

### 🔹 Step 2: Packing Verification
- Uploads **open box image** of packed items.
- System runs:
  - `YOLOv8` → counts objects
  - `OCR` → extracts expiry date
  - `TensorFlow` → predicts freshness (for perishable items)
- Verifies:
  - Quantity matches expected
  - Item is not expired
  - Freshness ≥ 65 (for perishable items)
  - Matches product type from UPC 

### 🔹 Step 3: Displays Result
- Displays `PASS` or `FAIL` with detailed result:
  - Quantity match
  - Expiry status
  - Freshness score
  - Item-type match (if applicable)


---


## Installation
To run this project locally, follow these steps:

1. *Clone the repository*:
   ```bash
   git clone https://github.com/Mayank-Bharti/sparkthon-25.git
   cd sparkthon-25
   
2. *Frontend*:
   ```bash
   cd frontend                                                                                                              cd frontend
   npm install
   npm start

3. *Backend*:
   ```bash
   cd packing-verification
   python -m venv yolov8_env
   source yolov8_env/bin/activate   # On Windows: yolov8_env\Scripts\activate
   pip install -r requirements.txt
   python app.py


