# assignment-project

create a db.js file inside models with the following, please insert username and password for your mysql db:

```
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("product_management", "username-here", "password-here", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
```
