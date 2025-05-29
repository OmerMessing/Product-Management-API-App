const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "product_management",
  "username-here",
  "password-here",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = sequelize;
