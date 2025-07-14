# 🏬 Sparkathon 2025 – Supply Chain Optimization Platform

A full-stack solution developed for **Walmart Sparkathon 2025**, addressing real-world challenges in supply chain management through smart inventory, optimized delivery, and AI-driven analytics.

---

## 🔍 Problem Theme: "Future of Retail – Supply Chain Optimization"

**Walmart’s Goals:**

- Reduce **waste**, **cost**, and **delivery delays**
- Optimize **inventory**, **routing**, and **warehouse operations**

---

## 🚀 Solution Overview (3 Phases Implemented)

### ✅ Phase 1 – Smart Substitution Engine + Product Catalog

Aims to avoid stockouts and boost customer satisfaction using a substitution engine and store-wise inventory.

#### ✅ Features:

- Product catalog per Walmart store
- Order placement with out-of-stock handling
- Similar product recommendations (fallback mechanism)
- Foundational data for Phase 2 (routing) and Phase 3 (demand zones)

#### 🔧 Tech Stack:

- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Testing**: Thunder Client (VS Code extension)

#### ⚙️ Backend APIs:

- `GET /products` – All products
- `GET /products/:id` – Product details
- `GET /suggest/:id` – Suggest alternatives
- `POST /order/place` – Place order

#### 📦 Sample Schemas:

**Store**

```js
{
  name: String,
  city: String,
  address: String,
  pincode: String,
  latitude: Number,
  longitude: Number
}
```

**Product**

```js
{
  title,
    category,
    brand,
    price,
    image,
    description,
    storeID,
    quantity,
    tags,
    demandScore,
    sold;
}
```

---

### ✅ Phase 2 – AI-Powered Last-Mile Delivery Routing

Optimizes last-mile delivery with live tracking, shortest paths, and smart instructions.

#### ✅ Features:

- Dynamic routing with live location
- Visual path from store → customer
- ETA calculation + step-wise navigation
- "Mark as Delivered" functionality
- Voice-based delivery instructions (TTS)

#### 🧠 Tech Stack:

- `react-leaflet`, `OpenStreetMap`, `Browser Geolocation API`
- `Web Speech API` for voice guidance
- `OpenRouteService` or `OSRM` for optimized routing

#### ⚙️ API Endpoints:

- `GET /order/:id` – Get order details
- `PATCH /order/:id/delivered` – Mark order delivered
- `POST /place` – Place new delivery

---

### ✅ Phase 3 – AutoZone Restocker (Demand Heatmap + Analytics)

Visualizes inventory-demand mismatch and enables smarter restocking based on zones.

#### ✅ Features:

- Heatmap of customer demand using delivery data
- Bar chart of most sold products
- Pie chart showing order concentration by city
- Data aggregation via backend analytics pipeline

#### 📊 Tech Stack:

- `react-leaflet`, `leaflet.heat` for geospatial heatmap
- `chart.js`, `react-chartjs-2` for dashboards
- MongoDB Aggregation for insights

#### 🔗 Analytics Routes:

- `GET /analytics/top-products`
- `GET /analytics/orders-city`

---
### ✅ Phase 4 –AI-Based Packing Verification System 

This project is part of a larger supply chain management system, focusing on **error detection in packaging** using computer vision and OCR. The goal is to **automatically verify the type, quantity, expiry, and freshness** of packed items before delivery, reducing manual errors and improving efficiency.


####  Key Features

- Verifies **item quantity** using object detection (YOLOv8)
- Checks **expiry date** using OCR (Tesseract)
- Assesses **freshness** for perishable items using a custom TensorFlow model
- Matches product type using external UPC (barcode) API
- Works with both perishable and non-perishable goods
- Stores expected product metadata via label image


#### Project Structure

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

#### Tech Stack

##### Frontend
- React 
- Axios for API calls
- CSS for UI styling

##### Backend (Flask)
- Flask + Flask-CORS
- OpenCV + YOLOv8 for object detection
- Tesseract OCR for expiry extraction
- TensorFlow model for freshness detection
- MongoDB Atlas for storing inventory data
- External UPCItemDB API for product type inference


#### ⚙️ Backend APIs

- `POST /scan` – Check if product exists in inventory using productId.
- `POST /scan-label` – Extract product name and expected quantity using OCR from label image.
- `POST /inventory` – Save product data (productId, name, quantity) into MongoDB.
- `POST /verify` – Verify uploaded open-box image for quantity, freshness, expiry using AI.


#### 📦 Sample Schema

##### Inventory Item

```js
{
  productId: String,
  productName: String,
  expectedQuantity: Number
}
```

#### How It Works

##### 🔹 Step 0: QR/Barcode Scan 
- Scans **QR/Barcode** on product label to get `productId`.
- Checks if product already exists in inventory.
- If not found, prompts to upload label for metadata extraction.

##### 🔹 Step 1: Label Scan
- Uploads **label image** containing product name and quantity.
- Uses `ocr.py` to extract:
  - `productName`
  - `expectedQuantity`
- Saves this metadata to MongoDB using `/inventory` API.

##### 🔹 Step 2: Packing Verification
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

##### 🔹 Step 3: Displays Result
- Displays `PASS` or `FAIL` with detailed result:
  - Quantity match
  - Expiry status
  - Freshness score
  - Item-type match
 
#### Installation
To run this project locally, follow these steps:

1. *Clone the repository*:
   ```bash
   git clone https://github.com/Mayank-Bharti/grid-main.git
   cd grid-main
   
2. *Install frontend dependencies*:
   ```bash                                                                                                                cd frontend
   npm install

3. *Install backend dependencies*:
   ```bash
   cd ../backend
   npm install

4. *Access the application*:
    http://localhost:3000
    ```

---

## 🧠 Future Roadmap (Beyond Submission)


- 📈 City-wise demand forecasting using Prophet/XGBoost
- 🚚 Dynamic routing using real-time traffic APIs

---

## 🛠️ Local Setup

```bash
# Clone the repo
git clone https://github.com/AyushiGupta160604/Sparkathon-2025.git

# Backend
cd backend
npm install
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev

# Visit the app
http://localhost:5173
```

---

## 🗂️ Folder Structure

```
📦 root
 ┣ 📁 backend
 ┃ ┣ 📁 models
 ┃ ┣ 📁 routes
 ┃ ┣ 📁 seed
 ┃ ┗ 📄 .env
 ┣ 📁 frontend
 ┃ ┣ 📁 components
 ┃ ┣ 📁 pages
 ┃ ┗ 📄 vite.config.js
```

---

## 👥 Team Contribution

| Name              | Role & Contribution                                |
| ----------------- | -------------------------------------------------- |
| **Ayushi Gupta**  | Smart Substitution, Delivery UI, Heatmap Dashboard |
| **Mayank Bharti** | Barcode-based Inventory Tracker, AI Packing System |

---

## 🏁 Submission

This project was developed and submitted as part of **Walmart Sparkathon 2025** under the theme **"Future of Retail – Supply Chain Optimization."**

---

## 📄 License

This project is for academic and demonstration purposes.
