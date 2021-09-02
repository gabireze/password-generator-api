const express = require("express");
const PasswordGeneratorController = require("../controllers/password-generator");
const router = express.Router();

router.post("/generate", PasswordGeneratorController.generate);
router.post("/generateMultiple", PasswordGeneratorController.generateMultiple);

module.exports = {
  routes: router,
};
