const express = require("express");
const app = express();

const userController = require("../controller/user_controller");

app.get("/getAll", userController.getAllUser);
app.get("/find/:id", userController.getUserById);
app.post("/register", userController.addUser);
app.put("/:id", userController.updateUser);
app.delete("/:id", userController.deleteUser);

module.exports = app;
