const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const Store = require("../models/Store");


router.post("/place", async (req, res) => {
  try {
    const { productId, quantity, customerAddress } = req.body;

    const product = await Product.findById(productId).populate("storeId");
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Product out of stock" });
    }

    product.quantity -= quantity;
    product.sold += quantity;
    await product.save();

    const newOrder = new Order({
      productId: product._id,
      storeId: product.storeId._id,
      quantity,
      customerAddress
    });
    await newOrder.save();

    const deliveryPayload = {
      storeAddress: {
        line1: product.storeId.address,
        pincode: product.storeId.pincode,
        lat: product.storeId.latitude,
        lng: product.storeId.longitude
      },
      deliveryAddress: customerAddress,
      productName: product.title,
      priority: "normal"
    };

    console.log("→ Sending to Delivery Module:", deliveryPayload);
    res.json({
      message: "✅ Order placed",
      orderId: newOrder._id,
      deliveryPayload
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to place order" });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("storeId")
      .populate("productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("storeId");
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      store: {
        name: order.storeId.name,
        address: order.storeId.address,
        latitude: order.storeId.latitude,
        longitude: order.storeId.longitude
      },
      customerAddress: order.customerAddress
    });
  } catch (err) {
    console.error("Fetch order route error:", err);
    res.status(500).json({ error: "Failed to fetch order route" });
  }
});

// Mark as Delivered after delivery placed
router.patch("/:id/delivered", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: "delivered" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;