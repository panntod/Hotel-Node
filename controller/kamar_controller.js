const kamarModel = require("../models/index").kamar;
const fs = require(`fs`);
const Op = require("sequelize").Op;

exports.getAllKamar = async (req, res) => {
  try {
    const dataKamar = await kamarModel.findAll();

    if (!Array.isArray(dataUser)) {
      throw new Error("Data retrieval error: User data is not an array");
    }

    return res.status(200).json({
      success: true,
      data: dataKamar,
      message: "All Data have been loaded",
    });
  } catch (error) {
    console.error("Error in get all data:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Data kamar is empty",
    });
  }
};

exports.getKamarById = async (req, res) => {
  let idKamar = req.params.id;

  try {
    let dataKamar = await kamarModel.findOne({ where: { id: idKamar } });
    return res.status(200).json(dataKamar);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Kamar Not Found",
    });
  }
};

exports.addKamar = async (req, res) => {
  try {
    const { nama_tipe_kamar, nomor_kamar } = req.body;

    const tipeId = await tipeModel.findOne({
      where: {
        nama_tipe_kamar: {
          [Op.substring]: nama_tipe_kamar,
        },
      },
    });

    const existingNomorKamar = await roomModel.findOne({
      where: {
        nomor_kamar: {
          [Op.substring]: nomor_kamar,
        },
      },
      attributes: ["nomor_kamar"],
    });

    if (!tipeId) {
      return res.json({
        success: false,
        message: `Tipe kamar yang Anda inputkan tidak ada`,
      });
    } else if (existingNomorKamar) {
      return res.json({
        success: false,
        message: `Nomor Kamar sudah ada`,
      });
    } else {
      const newRoom = {
        nomor_kamar: nomor_kamar,
        id_tipe_kamar: tipeId.id,
      };

      const result = await roomModel.create(newRoom);

      return res.json({
        success: true,
        data: result,
        message: `New Room has been inserted`,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { nama_tipe_kamar, nomor_kamar } = req.body;
    const tipeId = await tipeModel.findOne({
      where: {
        nama_tipe_kamar: {
          [Op.substring]: nama_tipe_kamar,
        },
      },
    });

    if (!tipeId) {
      return res.json({
        success: false,
        message: `Tipe kamar yang Anda inputkan tidak ada`,
      });
    } else {
      const newRoom = {
        nomor_kamar: nomor_kamar,
        id_tipe_kamar: tipeId.id,
      };

      const idRoom = req.params.id;
      const result = await roomModel.update(newRoom, { where: { id: idRoom } });

      if (result[0] === 1) {
        return res.json({
          success: true,
          message: `Data room has been updated`,
        });
      } else {
        return res.json({
          success: false,
          message: `Data room failed to update`,
        });
      }
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteKamar = (req, res) => {
  let idRoom = req.params.id;

  roomModel
    .destroy({ where: { id: idRoom } })
    .then((result) => {
      return res.json({
        success: true,
        message: `room data has ben deleted`,
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: error.message,
      });
    });
};

exports.availableRoom = async (req, res) => {
  const { check_in, check_out } = req.body;

  if (!check_in || !check_out) {
    return res.json({
      success: false,
      message: "Masukkan tanggal Check In atau Check Out",
    });
  }

  const tgl1 = new Date(check_in);
  const tgl2 = new Date(check_out);

  if (tgl2 < tgl1 || isNaN(tgl1) || isNaN(tgl2)) {
    return res.json({
      success: false,
      message: "Tanggal Check In atau Check Out tidak valid",
    });
  }

  try {
    const availableRooms = await sequelize.query(`
        SELECT kamar.id, kamar.nomor_kamar, tipe.nama_tipe_kamar, tipe.harga, tipe.deskripsi, tipe.foto
        FROM kamars AS kamar
        JOIN tipe_kamars as tipe ON kamar.id_tipe_kamar = tipe.id
        WHERE kamar.id NOT IN (
          SELECT id_kamar 
          FROM detail_pemesanans as dp 
          JOIN pemesanans as p ON p.id = dp.id_pemesanan 
          WHERE tgl_akses >= "${check_in}" AND tgl_akses <= "${check_out}" AND p.status_pemesanan != 'checkout'
        )
      `);

    if (availableRooms[0].length === 0) {
      return res.json({
        success: false,
        message: "Tidak Ada Kamar yang tersedia",
      });
    }

    return res.json({
      message: `Kamar Available For ${check_in} - ${check_out}`,
      success: true,
      data: availableRooms[0],
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.availableRoomByTipe = async (req, res) => {
    const { check_in, check_out, nama_tipe_kamar } = req.body;
  
    const tgl1 = new Date(check_in);
    const tgl2 = new Date(check_out);
  
    if (tgl2 < tgl1 || isNaN(tgl1) || isNaN(tgl2)) {
      return res.json({
        success: false,
        message: "Tanggal Check In atau Check Out tidak valid",
      });
    }
  
    try {
      const availableRooms = await sequelize.query(`
        SELECT kamar.id, kamar.nomor_kamar, tipe.nama_tipe_kamar, tipe.harga, tipe.deskripsi, tipe.foto
        FROM kamars AS kamar
        JOIN tipe_kamars as tipe ON kamar.id_tipe_kamar = tipe.id
        WHERE kamar.id NOT IN (
          SELECT id_kamar 
          FROM detail_pemesanans 
          WHERE tgl_akses >= ? AND tgl_akses <= ?
        ) AND tipe.nama_tipe_kamar = ?
      `, {
        replacements: [check_in, check_out, nama_tipe_kamar],
        type: sequelize.QueryTypes.SELECT,
      });
  
      if (availableRooms.length === 0) {
        return res.json({
          success: false,
          message: "Tidak Ada Nomor Kamar yang tersedia",
        });
      }
  
      return res.json({
        message: `Kamar Available For ${check_in} - ${check_out}`,
        success: true,
        data: availableRooms,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
  