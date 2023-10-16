const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Orders");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

// Place an order
router.post("/placeOrder/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Find the user's cart
    const cart = await Cart.findOne({ email });
    const user = await User.findOne({
      $or: [{ email: req.params.email }],
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }


    // Create an order based on the cart's products
    const order = new Order({
      orderId: uuidv4(),
      email: email,
      product: cart.products,
      address: user.addresses,
      // Add other order-related data if necessary
    });

    // Save the order
    await order.save();

    res.status(200).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json(error);
  }
});

function calculateTotalAmount(products) {
  // Implement your own logic to calculate the total amount based on products
  let total = 0;
  for (const product of products) {
    total += product.quantity * product.product.price;
  }
  return total;
}

module.exports = router;
