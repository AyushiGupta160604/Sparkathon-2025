const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Supply Chain API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const analyticsRoutes = require("./routes/analytics");

app.use("/products", productRoutes);
app.use("/order", orderRoutes);
app.use("/analytics", analyticsRoutes);