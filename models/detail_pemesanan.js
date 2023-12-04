'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_pemesanan extends Model {
    static associate(models) {
      this.belongsTo(models.pemesanan)
      this.belongsTo(models.kamar)
    }
  }
  detail_pemesanan.init({
    id_kamar: DataTypes.INTEGER,
    tgl_akses: DataTypes.DATE,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_pemesanan',
  });
  return detail_pemesanan;
};