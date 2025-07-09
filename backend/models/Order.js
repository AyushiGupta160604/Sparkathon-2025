const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },
  quantity: Number,
  customerAddress: {
    line1: String,
    city: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  deliveryStatus: {
    type: String,
    enum: ["placed", "dispatched", "delivered"],
    default: "placed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);