'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    classes: DataTypes.ENUM(['X','XI',',XII','XIII']),
    major_id: DataTypes.INTEGER,
    gender: DataTypes.ENUM(["M","F"])
  }, {
    sequelize,
    modelName: 'student',
  });
  return student;
};