const express = require("express");
const router = express.Router();

const ProductsModel = require("../models/Products.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const productList = await ProductsModel.find();
    console.log(productList);
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
