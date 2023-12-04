const express = require("express");
const app = express();

const auth = require(`../Middleware/Auth`);
const kamarController = require("../controller/kamar_controller")

app.get("/", auth.authVerify, kamarController.getAllKamar)
app.get("/find/:id", auth.authVerify, kamarController.getKamarById)
app.post("/available", kamarController.availableKamar)
app.post("/availableTipe", kamarController.availableKamarByTipe)
app.post("/", auth.authVerify, kamarController.addKamar)
app.put("/:id", auth.authVerify, kamarController.updateKamar)
app.delete("/:id", auth.authVerify, kamarController.deleteKamar)

module.exports = app;