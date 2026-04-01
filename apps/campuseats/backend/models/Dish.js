const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["burgers", "pizza", "mexicano", "asiatico", "espanol", "ensaladas", "postres", "bebidas"],
      default: "espanol",
    },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
    prepTime: { type: Number, default: 15 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dish", dishSchema);
