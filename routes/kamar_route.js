const express = require("express");
const app = express();

const kamarController = require("../controller/kamar_controller")

app.get("/getAll", kamarController.getAllKamar)
app.get("/find/:id", kamarController.getKamarById)
app.post("/", kamarController.availableRoom)
app.post("/tipe", kamarController.availableRoomByTipe)
app.post("/", kamarController.addKamar)
app.put("/:id", kamarController.updateRoom)
app.delete("/:id", kamarController.deleteKamar)