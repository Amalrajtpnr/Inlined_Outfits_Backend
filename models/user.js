const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },

    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    phone: {
      type: Number,
      min: 10,
    },
    addresses: {
      type: [
        {
          addressId: String,
          name: String,
          phone: String,
          locality: String,
          pinCode: String,
          address: String,
          city: String,
          state: String,
          landMark: String,
          alternateNumber: String,
          isHomeAddress: Boolean,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
