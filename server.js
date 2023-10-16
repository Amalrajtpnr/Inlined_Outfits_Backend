const express = require("express");
require("dotenv").config();
// const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/admin.js");
const productRoutes=require("./routes/product.js")
const cartRoutes=require("./routes/cart.js")
const buyRoutes=require("./routes/buy.js")
const orderRoutes=require("./routes/order.js")




const app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/buy", buyRoutes);
app.use("/api/order", orderRoutes);






connectDB();

app.get("/", (req, res) => res.send("hello"))

app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });
  