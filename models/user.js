'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'First Name is required',
          },
          notEmpty: {
            msg: 'Please provide a first name',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Last Name is required',
          },
          notEmpty: {
            msg: 'Please provide a last name',
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'The email address you entered already exists',
        },
        validate: {
          notNull: {
            msg: 'Email Address is required',
          },
          notEmpty: {
            msg: 'Please provide an email address',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        },
        validate: {
          notNull: {
            msg: 'Password is required',
          },
          notEmpty: {
            msg: 'Please provide a password',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return User;
};
