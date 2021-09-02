"use strict";
const dotenv = require("dotenv");

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  DB_USERNAME,
  DB_PASSWORD,
  DB_SERVER,
  DB_PORT,
  DB_DATABASE,
  MAIL_SERVICE,
  MAIL_USER,
  MAIL_PASS,
  JWT_SECRET,
  FRONT_URL,
  RESET_PASS_URL,
} = process.env;

module.exports = {
  port: PORT,
  host: HOST,
  url: HOST_URL,
  dbConnectionConfig: {
    server: DB_SERVER,
    database: DB_DATABASE,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    options: {
      encrypt: true,
      enableArithAbort: true,
      port: DB_PORT,
    },
  },
  mailConfig: {
    service: MAIL_SERVICE,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  },
  jwtSecret: JWT_SECRET,
  frontUrl: FRONT_URL,
  resetPassUrl: RESET_PASS_URL,
};
