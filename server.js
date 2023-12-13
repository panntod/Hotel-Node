const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const cors = require(`cors`);

const app = express();
const port = process.env.APP_PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

const userRouter = require("./routes/user_route");
const kamarRouter = require("./routes/kamar_route");
const tipeKamarRouter = require("./routes/tipe_kamar_route");
const loginRouter = require("./routes/login_route")

app.use(`/user`, userRouter);
app.use(`/kamar`, kamarRouter);
app.use(`/tipe`, tipeKamarRouter);
app.use(`/login`, loginRouter)

app.use(express.static(__dirname));
app.use(express.static("images/foto-tipe-kamar"));
app.use(express.static("images/foto-user"));

app.listen(port, () => {
  console.log(`Server listen to ${port}`);
});
