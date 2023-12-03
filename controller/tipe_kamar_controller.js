const tipekamarModel = require("../models/").tipe_kamar;
const { uploadTipekamar } = require("./upload_foto");
const fs = require("fs");
const { type } = require("os");
const path = require("path");
const Op = require("sequelize").Op;

exports.getAllType = async (req, res) => {
  try {
    let dataType = await tipekamarModel.findAll();

    if (!Array.isArray(dataType)) {
      throw new Error("Data retrieval error: User data is not an array");
    }

    const typeWithPhotoString = dataType.map((type) => {
      return {
        ...type.get(),
        foto: type.foto.toString("utf-8"), // Mengonversi buffer ke string
      };
    });

    return res.status(200).json({
        success: true,
        data: typeWithPhotoString,
        message: "All Type have been loaded"
    })
  } catch (error) {
    console.log(`Error in getAllType ${error}`);
    return res.status(500).json({
        success: false,
        data: null,
        message: "Data Type is empty"
    })
  }
};


