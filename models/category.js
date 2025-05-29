const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Category = sequelize.define(
  "Category",
  {
    name: DataTypes.STRING,
  },
  {
    tableName: "categories",
  }
);

module.exports = Category;
