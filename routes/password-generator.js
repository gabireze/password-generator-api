const express = require("express");
const PasswordGeneratorController = require("../controllers/password-generator");
const router = express.Router();

router.get("/generate", PasswordGeneratorController.generate);
router.get("/generateMultiple", PasswordGeneratorController.generateMultiple);

module.exports = {
  routes: router,
};
