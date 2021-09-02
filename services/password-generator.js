const generator = require("generate-password");

class PasswordGeneratorService {
  async generate(options) {
    try {
      const password = generator.generate(options);
      return password;
    } catch (error) {
      throw error;
    }
  }

  async generateMultiple(amount, options) {
    try {
      const password = generator.generateMultiple(amount, options);
      return password;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PasswordGeneratorService();
