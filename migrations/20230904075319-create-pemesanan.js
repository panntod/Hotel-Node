'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pemesanans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomor_pemesanan: {
        type: Sequelize.INTEGER
      },
      nama_pemesanan: {
        type: Sequelize.STRING
      },
      email_pemesanan: {
        type: Sequelize.STRING
      },
      tgl_pemesanan: {
        type: Sequelize.DATE
      },
      tgl_check_in: {
        type: Sequelize.DATE
      },
      tgl_check_out: {
        type: Sequelize.DATE
      },
      nama_tamu: {
        type: Sequelize.STRING
      },
      jumlah_kamar: {
        type: Sequelize.INTEGER
      },
      id_tipe_kamar: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: "tipe_kamars",
          key: "id"
        }
      },
      status_pemesanan: {
        type: Sequelize.ENUM(['baru','check_in','check_out']),
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "users",
          key: "id"
        }
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
    await queryInterface.dropTable('pemesanans');
  }
};