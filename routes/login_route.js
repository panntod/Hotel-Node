const express = require("express");
const app = express();

const auth = require(`../Middleware/Auth`);
const loginController = require("../Middleware/login")


app.post("/", loginController.login);
app.post("/customer", loginController.loginCustomer);
app.get("/", auth.authVerify, loginController.getUserLogin);
app.post("/logout", loginController.logout);

module.exports = app;