const express = require("express");
const router = express.Router();

const ProductsModel = require("../models/Products.model");

/* =================
    GET PRODUCTS
==================*/
router.get("/", async (req, res, next) => {
  try {
    const productList = await ProductsModel.find();
    res.render("products/products-list.hbs", {
      productList,
      userInSession: req.session.currentUser,
    });
  } catch (error) {
    console.log(error);
  }
});

/* =================
    INDIVIDUAL PRODUCT
==================*/

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const findProduct = await ProductsModel.findById(productId);
    res.render("products/product-details.hbs", { findProduct });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
