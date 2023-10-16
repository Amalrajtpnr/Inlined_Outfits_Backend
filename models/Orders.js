const { Schema, model } = require("mongoose");
const Product = require("./Product");

const orderSchema = new Schema({
  orderId: { type: String, unique: true },

  email: { type: String },
  orderDate: { type: Date, default: Date.now }, // Date when the order was placed
  product: { type: Array, required: true },
  address: {
    type: Object,
    required: true,
  },
  deliveryDetails: { type: Object },
  paymentDetails: { type: Object },
  totalAmount: { type: Number }, // Total cost of the order
  // Add more fields specific to your application, such as shipping details, payment information, etc.
});

module.exports = model("Order", orderSchema);
