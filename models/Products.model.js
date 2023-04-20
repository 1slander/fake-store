const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: {
    type: String,
    enum: ["men's clothing", "women's clothing", "electronics", "jewelery"],
  },
  image: String,
  rating: {
    rate: Number,
    count: Number,
  },
});

const Product = model("Product", productSchema);

module.exports = Product;
