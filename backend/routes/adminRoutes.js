const express = require("express");

const router = express.Router();

const {
  loginAdmin,
  forgotPassword,
  resetPassword
} = require("../controllers/adminController");

router.post("/login", loginAdmin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;