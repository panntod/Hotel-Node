const express = require("express");
const app = express();

const tipeController = require("../controller/tipe_kamar_controller");

app.get("/", tipeController.getAllType);
app.get("/find/:id", tipeController.findType);
app.post("/", tipeController.addType);
app.delete("/:id", tipeController.deleteType);
app.put("/:id", tipeController.updateTypeKamar);

module.exports = app;
