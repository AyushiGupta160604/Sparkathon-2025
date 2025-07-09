const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Store = require("../models/Store");

// Get all products (with store info)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("storeId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get substitution suggestions for a product
router.get("/suggest/:id", async (req, res) => {
  try {
    const original = await Product.findById(req.params.id);
    if (!original) return res.status(404).json({ error: "Product not found" });

    // Match by category or overlapping tags
    const suggestions = await Product.find({
      _id: { $ne: original._id },
      quantity: { $gt: 0 },
      $or: [
        { category: original.category },
        { tags: { $in: original.tags } }
      ]
    }).limit(5);

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: "Failed to suggest alternatives" });
  }
});

module.exports = router;