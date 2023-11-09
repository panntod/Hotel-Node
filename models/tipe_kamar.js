'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipe_kamar extends Model {
    static associate(models) {
      this.hasMany(models.kamar, {
        foreignKey: `id_tipe_kamar`, as: `kamar`
      })
      this.hasOne(model.pemesanan, {
        foreignKey: `id_tipe_kamar`, as: 'pemesanan'
      })
    }
  }
  tipe_kamar.init({
    id_tipe_kamar: DataTypes.INTEGER,
    nama_tipe_kamar: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    deskripsi: DataTypes.TEXT,
    foto: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'tipe_kamar',
  });
  return tipe_kamar;
};