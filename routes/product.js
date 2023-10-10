const router = require("express").Router();
const Product = require("../models/Product.js");
const { v4: uuidv4 } = require("uuid");

//Register
router.post("/add/admin", async (req, res) => {
  try {
    const { name, description, price, images, details, colors, sizes } =
      req.body;
    if (name && description && price && images && sizes && colors) {
      const product = await new Product({
        productId: uuidv4(),
        name,
        description,
        images,
        sizes,
        colors: colors ?? null,
        details: details ?? null,
        price,
      }).save();
      res.status(201).json(product);
    } else {
      res.status(200).json({ error: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get product
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    if (products) {
      res.status(200).json(products);
    } else {
      res.status(200).json({ error: "something went wrong" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get product by id
router.get("/products/get", async (req, res) => {
  try {
    const { id } = req.query
    const product = await Product.findOne({ productId: id })

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(200).json({ error: "something went wrong" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
