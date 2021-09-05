"use strict";
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

require("dotenv").config();
const PasswordGeneratorRoutes = require("./routes/password-generator");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", PasswordGeneratorRoutes.routes);

app.listen(process.env.PORT, () =>
  console.log("App is listening on url " + process.env.HOST_URL)
);

module.exports.handler = serverless(app);
