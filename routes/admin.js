const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

//Register
router.post("/", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Check if all required fields are present in the request body
    if (!req.body.name || !req.body.password || !req.body.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOne({
      $or: [{ email: req.body.email }],
    });

    if (user) {
      res.status(200).json("user already exists");
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user and respond
      const user = await newUser.save();

      res.status(200).json(user);
    }
  } catch (error) {
    res.status(200).json(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("user not found");
    } else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(400).json("wrong password");
      }
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//update user
router.put("/", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json("You can update only your account");
  } else {
    try {
      user.name = req.body.name;
      user.email = req.body.email;
      user.phone = req.body.phone;

      // Save the updated user
      await user.save();
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
});

module.exports = router;
