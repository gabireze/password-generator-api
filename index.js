"use strict";
const express = require("express");

const config = require("./config");
const PasswordGeneratorRoutes = require("./routes/password-generator");
const app = express();

app.use(express.json());
app.use("/", PasswordGeneratorRoutes.routes);

app.listen(config.port, () =>
  console.log("App is listening on url " + config.url)
);
