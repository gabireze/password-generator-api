"use strict";
const PasswordGeneratorService = require("../services/password-generator");

class PasswordGeneratorController {
  async generate(request, response, next) {
    try {
      const { options } = request.body;
      const result = await PasswordGeneratorService.generate(options);
      return response.status(200).json(result);
    } catch (error) {
      return response.status(400).send(error.message);
    }
  }

  async generateMultiple(request, response, next) {
    try {
      const { amount } = request.body;
      const { options } = request.body;
      const result = await PasswordGeneratorService.generateMultiple(
        amount,
        options
      );
      return response.status(200).json(result);
    } catch (error) {
      return response.status(400).send(error.message);
    }
  }
}

module.exports = new PasswordGeneratorController();
