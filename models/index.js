const { Sequelize } = require("sequelize");
const sequelize = require("./db");
const Category = require("./category");
const Product = require("./product");

Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

// module.exports = sequelize;

module.exports = {
  sequelize,
  Product,
  Category,
};
