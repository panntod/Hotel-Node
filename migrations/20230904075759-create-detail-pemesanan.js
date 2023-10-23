'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_pemesanans', {
      id_detail_pemesanan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_pemesanan: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: "pemesanans",
          key: "id_pemesanan"
        }
      },
      id_kamar: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: "kamars",
          key: "id_kamar"
        }
      },
      tgl_akses: {
        type: Sequelize.DATE
      },
      harga: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_pemesanans');
  }
};