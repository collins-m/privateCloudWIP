const express = require("express");
const router = express.Router();

// register
router.get("/register", (req, res, next) => {
  res.send("REGISTER");
});

// authentication
router.get("/auth", (req, res, next) => {
  res.send("AUTH");
});

// profile
router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

// validate
router.get("/validate", (req, res, next) => {
  res.send("VALIDATE");
});

// export router
module.exports = router;
