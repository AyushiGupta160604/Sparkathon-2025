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

## 🧠 Future Roadmap (Beyond Submission)

- 📦 Barcode-based inventory tracker (using ZXing / Firebase)
- 🧠 AI-based packing verification (YOLOv5 + OpenCV)
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
