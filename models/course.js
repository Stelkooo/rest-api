'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {}
  Course.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
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
