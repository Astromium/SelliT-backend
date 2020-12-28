const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  images: [String],
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    enum: [
      "Appliances",
      "Arts, Crafts, & Sewing",
      "Beauty & Personal Care",
      "Books",
      "Phones & Accessories",
      "Clothing, Shoes and Jewelry",
      "Computers",
      "Electronics",
      "Home & Kitchen",
      "Musical Instruments",
      "Sports & Outdoors",
      "Toys & Games",
    ],
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
