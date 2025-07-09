const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  brand: String,
  price: Number,
  image: String,
  description: String,
  
  // custom supply-chain fields
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  quantity: Number,
  tags: [String],
  demandScore: Number,
  sold: Number,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);