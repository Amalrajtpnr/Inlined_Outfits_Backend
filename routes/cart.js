const router = require("express").Router();
const Product = require("../models/Product.js");
const Cart = require("../models/Cart.js");
const User = require("../models/user.js");
const { v4: uuidv4 } = require("uuid");

// Add a product to the cart
router.post("/add", async (req, res) => {
  try {
    const { productId, email, color, size, quantity } = req.body;

    if (productId && email && size && color) {
      const prod = await Product.findOne({ productId });
      const cart = await Cart.findOne({ email });
      const user = await User.findOne({ email });

      if (prod && cart) {
        const filtered = cart.products.filter(
          (item) =>
            item.productId === productId &&
            item.color.code == color.code &&
            item.size === size
        );
        if (filtered.length > 0) {
          cart.products = cart.products.map((item) =>
            item.productId === productId &&
            item.color.code == color.code &&
            item.size === size
              ? { ...item, quantity: quantity }
              : item
          );
          const updated = await cart.save();
          res.status(201).json({ product: filtered[0] });
        } else {
          const product = {
            cartItemId: uuidv4(),
            productId: productId,
            color,
            product: prod,
            quantity,
            size,
          };
          cart.products = [...cart.products, product];
          const updated = await cart.save();
          res.status(201).json({ product });
        }
      } else if (user) {
        // If cart doesn't exist for the user, create a new cart and associate it with the user
        const newCart = new Cart({
          email: user.email,
          products: [],
        });
        const product = {
          cartItemId: uuidv4(),
          productId: productId,
          color,
          product: prod,
          quantity,
          size,
        };
        newCart.products.push(product);
        const savedCart = await newCart.save();
        res.status(201).json({ product });
      } else {
        res.status(200).json({ error: "User not found!" });
      }
    } else {
      res.status(200).json({ error: "Fields are missing!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get cart
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const cart = await Cart.findOne({ email });
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(200).json({ error: "Cart Doesnot exists" });
    }
  } catch (error) {}
});

//delete cart
router.delete("/remove", async (req, res) => {
  try {
    const { productId, cartItemId, email, quantity } = req.body;
    if (productId && email && cartItemId) {
      const cart = await Cart.findOne({ email });
      if (cart) {
        const filtered = cart.products.filter(
          (item) => item.cartItemId === cartItemId
        );
        if (filtered.length > 0 && quantity > 0) {
          cart.products = cart.products.filter(
            (item) => item.cartItemId !== cartItemId
          );
          const updated = await cart.save();
          res.status(201).json({ cart: updated });
        }
      } else {
        res.status(200).json({ error: "something went wrong!" });
      }
    } else {
      res.status(200).json({ error: "Fields are missing!" });
    }
  } catch (error) {}
});

module.exports = router;
