'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      this.hasMany(models.pemesanan, {
        foreignKey: 'id', as: 'pemesanan'
      })
    }
  }
  user.init({
    nama_user: DataTypes.STRING,
    foto: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin','resepsionis')
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};