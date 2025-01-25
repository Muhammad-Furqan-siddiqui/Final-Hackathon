const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },

});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
