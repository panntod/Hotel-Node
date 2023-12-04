const express = require("express");
const app = express();

const tipeController = require("../controller/tipe_kamar_controller");
const auth = require("../Middleware/Auth");

app.get("/", auth.authVerify, tipeController.getAllType);
app.get("/find/:id", auth.authVerify, tipeController.findType);
app.post("/", auth.authVerify, tipeController.addType);
app.delete("/:id", auth.authVerify, tipeController.deleteType);
app.put("/:id", auth.authVerify, tipeController.updateTypeKamar);

module.exports = app;
