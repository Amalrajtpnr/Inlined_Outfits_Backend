const router = require("express").Router();
const Product = require("../models/Product.js");
const Cart = require("../models/Cart.js");
const { v4: uuidv4 } = require("uuid");

// Add a product to the cart
router.post("/add/:userId/:productId", async (req, res) => {
  try {
    const { color, size, quantity } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;
    console.log(userId)

    // Find the product by its ID
    const product = await Product.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        cartItemId: uuidv4(),
        productId: productId,
        color,
        product: product,
        quantity,
        size,
      });
    }

    // Add the selected product to the cart
    const newItem = {
      productId: product._id,
      quantity: 1, // You can adjust the quantity as needed
    };

    cart.items.push(newItem);

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
