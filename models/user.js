'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      this.hasMany(models.pemesanan, {
        foreignKey: 'id_user', as: 'pemesanan'
      })
    }
  }
  user.init({
    id_user: DataTypes.INTEGER,
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