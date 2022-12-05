'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Title is required',
          },
          notEmpty: {
            msg: 'Please provide a title',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Description is required',
          },
          notEmpty: {
            msg: 'Please provide a description',
          },
        },
      },
      materialsNeeded: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Course',
    },
  );
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return Course;
};
