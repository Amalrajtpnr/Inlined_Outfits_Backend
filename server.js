const express = require("express");
require("dotenv").config();
// const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/admin.js");



const app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/auth", authRoutes);


connectDB();

app.get("/", (req, res) => res.send("hello"))

app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });
  