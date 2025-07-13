// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const Store = require("../models/Store");

// router.get("/demand-by-city", async (req, res) => {
//   try {
//     const result = await Product.aggregate([
//       {
//         $lookup: {
//           from: "stores",
//           localField: "storeId",
//           foreignField: "_id",
//           as: "store"
//         }
//       },
//       { $unwind: "$store" },
//       {
//         $group: {
//           _id: "$store.city",
//           totalDemand: { $sum: "$demandScore" },
//           latitude: { $first: "$store.latitude" },
//           longitude: { $first: "$store.longitude" }
//         }
//       },
//       { $sort: { totalDemand: -1 } }
//     ]);

//     res.json(result);
//   } catch (error) {
//     console.error("Error fetching demand data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

const router  = require("express").Router();
const Order   = require("../models/Order");
const Product = require("../models/Product");
const Store   = require("../models/Store");

/* 1️⃣  Demand by city (heat‑map) */
router.get("/demand-city", async (_req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: {
          _id: "$customerAddress.city",
          totalQty: { $sum: "$quantity" },
          lat:  { $avg: "$customerAddress.lat" },
          lng:  { $avg: "$customerAddress.lng" }
      }},
      { $sort: { totalQty: -1 } }
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: "agg error" }); }
});

/* 2️⃣  Top 5 products by quantity sold */
router.get("/top-products", async (_req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: {
          _id: "$productId",
          qtySold: { $sum: "$quantity" }
      }},
      { $sort: { qtySold: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
      }},
      { $unwind: "$product" },
      { $project: {
          _id: 0,
          title: "$product.title",
          qtySold: 1
      }}
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: "agg error" }); }
});

/* 3️⃣  Orders grouped by city (pie) */
router.get("/orders-city", async (_req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: {
          _id: "$customerAddress.city",
          orders: { $sum: 1 }
      }},
      { $sort: { orders: -1 } }
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: "agg error" }); }
});

module.exports = router;