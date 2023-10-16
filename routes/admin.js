const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

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
        userId: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user and respond
      const user = await newUser.save();

      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json(error);
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

router.post("/add/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.params.email }],
    });
    const { address } = req.body;

    const newAddress = {
      addressId: uuidv4(),
      name: address.name,
      phone: address.phone,
      locality: address.locality,
      pinCode: address.pinCode,
      address: address.address,
      city: address.city,
      state: address.state,
      landMark: address.landMark,
      alternateNumber: address.alternateNumber,
    };

    if (!user) {
      return res.status(404).json("User doesn't exist");
    }

    // Check if all required fields are present in the request body
    if (
      address.name &&
      address.phone &&
      address.pinCode &&
      address.address &&
      address.city &&
      address.state
    ) {
      // Add the newAddress to the user's addresses array
      user.addresses.push(newAddress);

      // Save the updated user object
      await user.save();

      res.status(200).json(newAddress);
    } else {
      return res.status(400).json({ error: "Missing required fields" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/update/:email/:addressId", async (req, res) => {
  try {
    const { email, addressId } = req.params;
    const { address } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User doesn't exist");
    }

    const existingAddress = user.addresses.find((a) => a.addressId === addressId);

    if (!existingAddress) {
      return res.status(404).json("Address not found");
    }

    // Update the address fields if they exist in the request body
    if (address.name) existingAddress.name = address.name;
    if (address.phone) existingAddress.phone = address.phone;
    if (address.locality) existingAddress.locality = address.locality;
    if (address.pinCode) existingAddress.pinCode = address.pinCode;
    if (address.address) existingAddress.address = address.address;
    if (address.city) existingAddress.city = address.city;
    if (address.state) existingAddress.state = address.state;
    if (address.landMark) existingAddress.landMark = address.landMark;
    if (address.alternateNumber) existingAddress.alternateNumber = address.alternateNumber;

    // Save the updated user object
    await user.save();

    res.status(200).json(existingAddress);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
