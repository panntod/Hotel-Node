const userModel = require("../models/index").user;
const upload = require("./upload_foto").single("foto");
const fs = require(`fs`);
const path = require("path");
const bcrypt = require("bcrypt");
const Op = require("sequelize").Op;

exports.getAllUser = async (req, res) => {
  try {
    // Menggunakan try untuk menangkap potensi kesalahan saat mengambil data pengguna
    let dataUser = await userModel.findAll();

    // Memastikan dataUser adalah array sebelum dikirim sebagai respons
    if (!Array.isArray(dataUser)) {
      throw new Error("Data retrieval error: User data is not an array");
    }

    // Mengonversi buffer foto menjadi string sebelum mengirim sebagai respons
    const usersWithPhotoString = dataUser.map((user) => {
      return {
        ...user.get(),
        foto: user.foto.toString("utf-8"), // Mengonversi buffer ke string
      };
    });

    return res.status(200).json({
      success: true,
      data: usersWithPhotoString,
      message: "All User have been loaded",
    });
  } catch (error) {
    console.error("Error in getAllUser:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Data user is empty",
    });
  }
};

exports.getUserById = async (req, res) => {
  let idUser = req.params.id;

  try {
    let dataUser = await userModel.findOne({ where: { id: idUser } });

    // Mengonversi buffer foto menjadi string
    if (dataUser && dataUser.foto) {
      dataUser.foto = dataUser.foto.toString("utf-8");
    }

    res.status(200).json(dataUser);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Member Not Found",
    });
  }
};

exports.addUser = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) return res.json({ message: error });

    if (!req.file) return res.json({ message: `Nothing to upload` });

    let newUser = {
      nama_user: req.body.nama_user,
      foto: req.file.filename,
      email: req.body.email,
      role: req.body.role,
      password: bcrypt.hashSync(req.body.password, 10),
    };

    userModel
      .create(newUser)
      .then((result) => {
        return res.json({
          success: true,
          data: result,
          message: "New member has been inserted",
        });
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateUser = (req, res) => {
  upload(req, res, async (error) => {
    if (error) return res.json({ message: error });

    if (!req.file) return res.json({ message: "Nothing to upload" });

    let idUser = req.params.id;
    let newUser = {
      nama_user: req.body.nama_user,
      foto: req.body.foto,
      email: req.body.email,
      role: req.body.role,
    };

    if (req.file) {
      try {
        const selectedUser = await userModel.findOne({ where: { id: idUser } });
        const oldFoto = selectedUser.foto;

        if (oldFoto) {
          const finalUserFoto = path.join(
            __dirname,
            "../images/user",
            oldFoto.toString()
          );

          if (fs.existsSync(finalUserFoto)) {
            fs.unlinkSync(finalUserFoto, (err) => {
              if (err) console.log(idUser, err);
            });
          }
        }

        newUser.foto = req.file.filename;
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Error updating user",
        });
      }
    }

    if (req.body.password) {
      // Jika ada password baru, maka hash password tersebut
      newUser.password = bcrypt.hashSync(req.body.password, 10);
    }

    try {
      const result = await userModel.update(newUser, { where: { id: idUser } });

      return res.status(201).json({
        success: true,
        message: "Data user has been updated",
      });
    } catch (err) {
      console.error(err);
      return res.status(501).json({
        success: false,
        message: err.message,
      });
    }
  });
};

exports.deleteUser = async (req, res) => {
  let idUser = req.params.id;
  try {
    const selectedUser = await userModel.findOne({ where: { id: idUser } });
    const oldFoto = selectedUser.foto;
    const finalUserFoto = path.join(
      __dirname,
      "../images/user",
      oldFoto.toString()
    );

    if (fs.existsSync(finalUserFoto)) {
      fs.unlinkSync(finalUserFoto, (err) => console.log(idUser, err));
    }

    userModel
      .destroy({ where: { id: idUser } })
      .then((result) => {
        return res.status(200).json({
          success: true,
          message: "Data user has been deleted",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: true,
          message: err.message,
        });
      });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
