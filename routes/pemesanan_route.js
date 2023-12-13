const express = require('express')
const app = express()
const bodyparser = require("body-parser")

app.use(express.json())
app.use(bodyparser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const pemesananController = require('../controller/pemesanan_controller')
const auth = require('../Middleware/Auth')

app.post("/", auth.authVerify, pemesananController.addPemesanan);

module.exports = app;
