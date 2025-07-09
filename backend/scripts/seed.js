const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const Product = require("../models/Product");
const Store = require("../models/Store");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected for seeding"))
  .catch(err => console.error(err));

// 5 fake Walmart stores
const stores = [
  { name: "Walmart Delhi", address: "123 Mall Road, Delhi", pincode: "110001", latitude: 28.6139, longitude: 77.2090 },
  { name: "Walmart Mumbai", address: "Linking Road, Mumbai", pincode: "400050", latitude: 19.0760, longitude: 72.8777 },
  { name: "Walmart Bangalore", address: "MG Road, Bangalore", pincode: "560001", latitude: 12.9716, longitude: 77.5946 },
  { name: "Walmart Hyderabad", address: "Banjara Hills, Hyderabad", pincode: "500034", latitude: 17.3850, longitude: 78.4867 },
  { name: "Walmart Kolkata", address: "Park Street, Kolkata", pincode: "700016", latitude: 22.5726, longitude: 88.3639 }
];

async function seedData() {
  try {
    await Product.deleteMany({});
    await Store.deleteMany({});

    const createdStores = await Store.insertMany(stores);
    console.log("Stores inserted:", createdStores.length);

    const response = await axios.get("https://dummyjson.com/products?limit=30");
    const rawProducts = response.data.products;

    const enrichedProducts = rawProducts.map((prod) => {
      const randomStore = createdStores[Math.floor(Math.random() * createdStores.length)];
      const randomQty = Math.floor(Math.random() * 30); // 0–29
      const randomDemand = (Math.random() * 5).toFixed(2); // 0.00–5.00

      return {
        title: prod.title,
        category: prod.category,
        brand: prod.brand || "Generic",
        price: prod.price,
        image: prod.thumbnail || prod.images[0],
        description: prod.description,
        storeId: randomStore._id,
        quantity: randomQty,
        tags: [prod.category, prod.brand, ...prod.title.toLowerCase().split(" ")],
        demandScore: parseFloat(randomDemand),
        sold: Math.floor(Math.random() * 1000)
      };
    });

    await Product.insertMany(enrichedProducts);
    console.log("Products inserted:", enrichedProducts.length);

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();