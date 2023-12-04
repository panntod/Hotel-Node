const express = require("express");
const app = express();

const userController = require("../controller/user_controller");
const auth = require("../Middleware/Auth");

app.get("/getAll", auth.authVerify,  userController.getAllUser);
app.get("/find/:id", auth.authVerify, userController.getUserById);
app.post("/", userController.addUser);
app.put("/:id", auth.authVerify, userController.updateUser);
app.delete("/:id", auth.authVerify, userController.deleteUser);

module.exports = app;
