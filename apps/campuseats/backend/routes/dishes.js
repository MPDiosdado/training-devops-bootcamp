const express = require("express");
const Dish = require("../models/Dish");
const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.json({ success: true, data: dishes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET one
router.get("/:id", async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: "Plato no encontrado" });
    res.json({ success: true, data: dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create
router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ success: false, message: "Nombre y precio son obligatorios" });
    }
    const dish = await Dish.create(req.body);
    res.status(201).json({ success: true, data: dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update
router.put("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dish) return res.status(404).json({ success: false, message: "Plato no encontrado" });
    res.json({ success: true, data: dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: "Plato no encontrado" });
    res.json({ success: true, message: "Plato eliminado" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
