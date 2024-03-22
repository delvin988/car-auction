"use strict";
const { Model } = require("sequelize");
const { encodePassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Bid);
    }
  }

  User.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `First Name is required`,
          },
          notEmpty: {
            msg: `First Name is required`,
          },
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Last Name is required`,
          },
          notEmpty: {
            msg: `Last Name is required`,
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email is already registered",
        },
        validate: {
          notNull: {
            msg: `Email is required`,
          },
          notEmpty: {
            msg: `Email is required`,
          },
          isEmail: {
            msg: `Must use Email format`,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Password is required`,
          },
          notEmpty: {
            msg: `Password is required`,
          },
          len: {
            args: [5],
            msg: `Minimum Password length is 5 characters`,
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "Bidder",
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(instance) {
          instance.password = encodePassword(instance);
        },
      },
    }
  );
  return User;
};