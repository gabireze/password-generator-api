const dotenv = require("dotenv");

module.exports = async () => {
  const envVars = dotenv.config({ path: ".env" }).parsed;
  return envVars;
};
