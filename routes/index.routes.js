const express = require("express");
const router = express.Router();

const ProductsModel = require("../models/Products.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    const categories = await response.json();
    res.render("index", { categories });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
