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
      message: "All Type have been loaded",
    });
  } catch (error) {
    console.log(`Error in getAllType ${error}`);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Data Type is empty",
    });
  }
};

exports.findType = async (req, res) => {
  try {
    let id_tipe_kamar = req.params.id;

    let tipe = await tipekamarModel.findOne({
      where: {
        [Op.and]: [{ id: { [Op.substring]: id_tipe_kamar } }],
      },
    });

    const typeWithPhotoString = tipe.map((type) => {
      return {
        ...type.get(),
        foto: type.foto.toString("utf-8"), // Mengonversi buffer ke string
      };
    });

    return res.json({
      success: true,
      data: typeWithPhotoString,
      message: `Room have been loaded`,
    });
  } catch (error) {
    console.log(`Error in getAllType ${error}`);
    return res.status(404).json({
      success: false,
      data: null,
      message: "Data type not found",
    });
  }
};

exports.addTipe = async (req, res) => {
  uploadTipekamar.single("foto")(req, res, async (error) => {
    if (error) return res.json({ message: error });

    if (!req.file) return res.json({ message: `Nothing to upload` });

    let newTipe = {
      nama_tipe_kamar: req.nama_tipe_kamar,
      harga: req.harga,
      deskripsi: req.deskripsi,
      foto: req.file.filename,
    };

    tipekamarModel
      .create(newTipe)
      .then((result) => {
        return res.json({
          success: true,
          data: newTipe,
          message: "New tipe has been inserted",
        });
      })
      .catch((err) => {
        return res.json({
          success: false,
          message: err.message,
        });
      });
  });
};
