'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    OrderId:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notNull: {
            msg: "OrderId is required",
         },
         notEmpty: {
            msg: "OrderId is required",
         },
      },
   },
    amount: DataTypes.STRING,
    status: DataTypes.STRING,
    paidDate: DataTypes.DATE,
    UserrId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};