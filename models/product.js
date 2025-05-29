const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Product = sequelize.define(
  "Product",
  {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
  },
  {
    tableName: "products",
  }
);

module.exports = Product;
