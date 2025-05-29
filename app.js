const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const sequelize = require("./models/db");
const { Product, Category } = require("./models");

// const Product = require("./models/category");
// const Category = require("./models/product");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

sequelize.sync().then(() => {
  console.log("DB connected & tables created");
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
