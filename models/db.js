const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("product_management", "root", "root1234", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
