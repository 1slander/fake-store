const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Fake-Store";

const ProductModel = require("../models/Products.model");

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);

    return fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((products) => ProductModel.create(products));
  })
  .then((products) => {
    console.log(`Created ${products.length} products`);

    // Once the documents are created, close the DB connection
    return mongoose.connection.close();
  })
  .then(() => {
    // Once the DB connection is closed, print a message
    console.log("DB connection closed!");
  })
  .catch((err) => {
    console.log(
      `An error occurred while creating products from the DB: ${err}`
    );
  });
