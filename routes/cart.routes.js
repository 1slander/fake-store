const express = require("express");
const router = express.Router();

const CartModel = require("../models/Cart.model");

router.get("/", async (req, res) => {
  res.render("users/cart.hbs");
});

router.post("/", async (req, res) => {});

module.exports = router;
