const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

/* =================
    SIGN UP
==================*/
router.get("/signup", async (req, res) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.render("auth/signup", { errorMessage: "All files are mandatory." });
    return;
  }

  //Make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const userFromDb = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    console.log(userFromDb);
    res.render("success.hbs");
  } catch (error) {
    // Retrieved invalid message from mongoose if email is  not correct
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      //Retrieve error message if duplication of user or email
      res.status(500).render("auth/signup", {
        errorMessage: "Email is already used.",
      });
    } else {
      next(error);
    }
  }
});

/* =================
    LOGIN
==================*/

router.get("/login", (req, res) => res.render("auth/login.hbs"));

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("SESSION=====>", req.session);

  //Check password or email aren't empty

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please fill all the fields.",
    });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Email is not registered.",
      });
    } else if (bcryptjs.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/userProfile");
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password." });
    }
  } catch (error) {
    console.log(error);
  }
});

/* =================
    LOG OUT
==================*/

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

/* =================
    USER PROFILE
==================*/

router.get("/userProfile", (req, res) =>
  res.render("users/user-profile.hbs", {
    userInSession: req.session.currentUser,
  })
);

module.exports = router;
