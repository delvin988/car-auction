"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    static associate(models) {
      Bid.belongsTo(models.User);
      Bid.belongsTo(models.Item);
    }
  }

  Bid.init(
    {
      amount: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      ItemId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bid",
    }
  );

  return Bid;
};