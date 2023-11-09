const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server listen to ${port}`);
});
