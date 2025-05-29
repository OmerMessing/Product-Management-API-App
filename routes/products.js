const express = require("express");
const router = express.Router();
const { Product, Category } = require("../models");

// GET /products?category=Electronics
router.get("/", async (req, res) => {
  try {
    const where = {};

    if (req.query.category) {
      const category = await Category.findOne({
        where: { name: req.query.category },
      });
      if (category) {
        where.categoryId = category.id;
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const products = await Product.findAll({
      where,
      include: {
        model: Category,
        as: "category",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });

    res.json(products);
  } catch (err) {
    console.error("error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /products
router.post("/", async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    const product = await Product.create({ name, price, categoryId });
    res.status(201).json(product);
  } catch (err) {
    console.error("error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /products/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.update({ name, price, categoryId });
    res.json(product);
  } catch (err) {
    console.error("error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /products/:id
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
