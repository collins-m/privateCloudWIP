const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// register
router.post("/register", (req, res, next) => {
  let newUser = new User({
    firstname: req.body.firstname,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({
        success: false,
        msg: "Failed to register user"
      });
    } else {
      res.json({
        success: true,
        msg: "User registered successfully"
      });
    }
  });
});

// authentication
router.get("/auth", (req, res, next) => {
  res.send("AUTH");
});

// profile
router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

// export router
module.exports = router;
