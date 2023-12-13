const shortid = require("shortid");
const pemesananModel = require("../models/index").pemesanan;
const detailsPemesananModel = require("../models/index").detail_pemesanan;
const userModel = require("../models/index").user;

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

const Op = require("sequelize").Op;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotels", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.addPemesanan = async (req, res) => {
  const {
    nama_user,
    nomor_kamar,
    nama_pemesanan,
    check_in,
    check_out,
    nama_tamu,
  } = req.body;

  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  if (userId === null) {
    return res.status(404).json({
      succes: false,
      message: "User Not Found",
    });
  }

  let data_nomor_kamar = nomor_kamar.split(",");
  let jumlah_kamar = data_nomor_kamar.length;

  let data_kamar = [];

  console.log(data_nomor_kamar);

  for (let i = 0; i < jumlah_kamar; i++) {
    const kamar = await sequelize.query(
      `SELECT kamars.id, kamars.nomor_kamar, tipe_kamars.nama_tipe_kamar, tipe_kamars.harga FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar WHERE kamars.nomor_kamar = ${data_nomor_kamar[i]} ORDER BY kamars.id ASC`
    );

    if (kamar[0][0] === null || kamar[0][0] === undefined) {
      return res.status(404).json({
        success: false,
        message: `kamar ${data_nomor_kamar[i]} not found`,
      });
    }

    let checkKamar = await sequelize.query(
        `SELECT * FROM detail_pemesanans as dp JOIN pemesanans as p ON p.id = dp.id_pemesanan WHERE dp.id_kamar = ${kamar[0][0].id} AND dp.tgl_akses >= '${check_in}' AND dp.tgl_akses <= '${check_out}' AND p.status_pemesanan != 'checkout'`
    )

    if(checkKamar[0].length > 0){
        return res.status(403).json({
            succes: false,
            message: `kamar ${data_nomor_kamar[i]} already booked`
        })
    }

    data_kamar.push(kamar[0][0])
  }

  let newPemesanan = {
    nomor_pemesanan: request.body.nomor_pemesanan,
    nama_pemesanan: nama_pemesanan,
    email_pemesanan: userId.email,
    tgl_pemesanan: moment().format("YYYY-MM-DD HH:mm:ss"),
    tgl_check_in: check_in,
    tgl_check_out: check_out,
    nama_tamu: nama_tamu,
    jumlah_kamar: jumlah_kamar,
    status_pemesanan: "baru",
    id_user: userId.id,
  }

  pemesananModel.create(newPemesanan)
  .then((result) => {
    let pemesananId = result.id
    let tgl_checkin = new Date(check_in)
    let tgl_checkout = new Data(check_out)

    if(tgl_checkout <= tgl_checkin){
        return res.status(500).json({
            success: false,
            message: `Tanggal check-out harus lebih besar dari Tanggal check-in` 
        })
    }

    let checkIn = moment(tgl_checkin).format("YYYY-MM-DD");
    let checkOut = moment(tgl_checkout).format("YYYY-MM-DD");

    if (
        !moment(checkIn, "YYYY-MM-DD").isValid() ||
        !moment(checkOut, "YYYY-MM-DD").isValid()
      ) {
        return response.status(401).send({ success: false, message: "Invalid date format" });
      }
    
      let numOfKamar = jumlah_kamar
      let numOfDays = moment(checkOut).diff(moment(checkIn), "days")

      let newDetails = []
      for (let i = 0; i < numOfKamar.length; i++) {
        let nomor_kamar = data_kamar[i].id
        let newDetail = {
            id_pemesanan: pemesananId,
            id_kamar: nomor_kamar,
            tgl_akses: date,
            harga: harga,
        }
        newDetails.push(newDetail);
      }
      
      detailsPemesananModel.bulkCreate(newDetails)
      .then(() => {
        res.status(201).json({
            succes: true,
            message: "New transaction have been inserted"
        })
      })
      .catch((err) => {
        return res.status(500).json({
            success: false,
            message: err.message,
          });
      })
  })
  .catch((error) => {
    return response.json({
      success: false,
      message: error.message,
    });
  });
};
