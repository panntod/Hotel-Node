const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql2");
const dotenv = require('dotenv')
dotenv.config()

const app = express();
const port = process.env.APP_PORT;
app.use(bodyParser.json());

const userRouter = require('./routes/user_route')

app.use(`/user`, userRouter);

app.listen(port, () => {
  console.log(`Server listen to ${port}`);
});
