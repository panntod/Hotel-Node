const multer = require("multer");
const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const createStorage = (destination) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `./images/${destination}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },

    filename: (req, file, cb) => {
      cb(
        null,
        `${destination}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

const createMulter = (destination) =>
  multer({
    storage: createStorage(destination),
    fileFilter: (req, file, cb) => {
      const acceptedTypes = ["image/jpg", "image/jpeg", "image/png"];
      if (!acceptedTypes.includes(file.mimetype)) {
        cb(null, false);
        return cb(`Invalid file type ${file.mimetype}`);
      }

      const filesize = req.headers["content-length"];
      const maxSize = 1 * 1024 * 1024;

      if (filesize > maxSize) {
        cb(null, false);
        return cb("File size is too large");
      }

      cb(null, true);
    },
  });

  const uploadUser = createMulter('foto-user')

module.exports = { 
  uploadUser
};
