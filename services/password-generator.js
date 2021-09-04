const generator = require("generate-password");

class PasswordGeneratorService {
  async generate(options) {
    try {
      if (options.length) {
        if (options.length > 100) {
          options.length = 100;
        }
      }
      const password = generator.generate(options);
      return password;
    } catch (error) {
      throw error;
    }
  }

  async generateMultiple(amount, options) {
    try {
      if (options.length) {
        if (options.length > 100) {
          options.length = 100;
        }
      }
      if (amount) {
        if (amount > 100) {
          amount = 100;
        }
      }
      const password = generator.generateMultiple(amount, options);
      return password;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PasswordGeneratorService();
