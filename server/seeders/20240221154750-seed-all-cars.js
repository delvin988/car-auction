"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let itemData = require(`../data/car.json`).map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Items", itemData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Items");
  },
};
