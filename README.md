# Product Management API

This is a simple Node.js + Express backend project using MySQL and Sequelize for managing products and their categories. The frontend is already built and included in the `public/` folder.

## Installing for the First Time

Please install the necessary node modules:

`npm i`

Next, create a file named db.js inside the models directory with the following content. Be sure to replace "username-here" and "password-here" with your actual MySQL credentials:

```
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("product_management", "username-here", "password-here", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
```

Make sure you have a MySQL server running locally, and create the database manually before starting the app. You can do this by running:

```
CREATE DATABASE product_management;
```

## Running the project

The frontend is already built into the public/ folder, so you don't need to build anything.

To run the Express server, use:

`npm run start`

The backend will start on http://localhost:3000.

## API Overview

GET /products - List all products

POST /products - Create a new product

PUT /products/:id - Update an existing product

DELETE /products/:id - Delete a product

Each product is linked to a category using a Sequelize association (Product.belongsTo(Category)).

## Project Structure

models/ — Contains Sequelize models and DB config

routes/ — Express route handlers

public/ — Built frontend assets

react-app/ - React + vite

app.js — Entry point for the server

## Testing API end points

The VS code extension REST API was used to test end points, the calls tested are inside the requests folder.

## Requirements

Node.js v14 or higher

MySQL (running locally)

# Front-end

## Developement

Please install the necessary node modules:

`npm i`

## Running

`npm run dev`

## Building

`npm run build`
