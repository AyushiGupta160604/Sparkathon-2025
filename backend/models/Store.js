const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: String,
  address: String,
  pincode: String,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model("Store", storeSchema);