const mongoose = require("mongoose");
const Dish = require("../models/Dish");

const MONGO_URI = process.env.DATABASE_URI || "mongodb://localhost:27017/campuseats";

const dishes = [
  {
    name: "Smash Burger Clasica",
    description: "Doble carne smash, cheddar fundido, cebolla caramelizada, salsa especial. El clasico que nunca falla.",
    price: 8.5,
    category: "burgers",
    image: "https://img.freepik.com/free-photo/front-view-tasty-meat-burger-with-cheese-salad-dark-background_140725-89597.jpg?w=500",
    prepTime: 12,
  },
  {
    name: "Pizza Margherita",
    description: "Masa artesanal, tomate San Marzano, mozzarella fresca, albahaca. Horno de lena.",
    price: 9.0,
    category: "pizza",
    image: "https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg?w=500",
    prepTime: 18,
  },
  {
    name: "Burrito Vegano",
    description: "Frijoles negros, arroz, guacamole, pico de gallo, salsa chipotle. 100% vegetal.",
    price: 7.5,
    category: "mexicano",
    image: "https://img.freepik.com/free-photo/mexican-burrito_1203-7582.jpg?w=500",
    prepTime: 10,
  },
  {
    name: "Ramen Tonkotsu",
    description: "Caldo de cerdo 12h, noodles frescos, huevo marinado, chashu, nori, cebolleta.",
    price: 11.0,
    category: "asiatico",
    image: "https://img.freepik.com/free-photo/ramen-soup_1339-4012.jpg?w=500",
    prepTime: 8,
  },
  {
    name: "Tortilla de Patatas",
    description: "Receta de la abuela. Patata, cebolla, huevo. Jugosa por dentro. Punto perfecto.",
    price: 5.5,
    category: "espanol",
    image: "https://img.freepik.com/free-photo/spanish-omelette-with-potatoes-tortilla-espanola_123827-22880.jpg?w=500",
    prepTime: 20,
  },
  {
    name: "Poke Bowl Salmon",
    description: "Salmon fresco, arroz de sushi, edamame, aguacate, mango, salsa ponzu.",
    price: 10.5,
    category: "asiatico",
    image: "https://img.freepik.com/free-photo/poke-bowl-buddha-bowl-with-salmon-shrimp-avocado_2829-3958.jpg?w=500",
    prepTime: 7,
  },
  {
    name: "Caesar Salad",
    description: "Lechuga romana, pollo a la plancha, parmesano, croutons, salsa caesar casera.",
    price: 8.0,
    category: "ensaladas",
    image: "https://img.freepik.com/free-photo/caesar-salad-plate_74190-2032.jpg?w=500",
    prepTime: 6,
  },
  {
    name: "Churros con Chocolate",
    description: "Churros recien hechos con chocolate caliente a la taza. Para compartir.",
    price: 4.5,
    category: "postres",
    image: "https://img.freepik.com/free-photo/churros-frying-pan-with-chocolate-coffee_23-2148342928.jpg?w=500",
    prepTime: 10,
  },
  {
    name: "Tacos al Pastor",
    description: "Tres tacos de cerdo marinado, pina asada, cilantro, cebolla, salsa verde.",
    price: 8.0,
    category: "mexicano",
    image: "https://img.freepik.com/free-photo/mexican-tacos-with-beef-tomato-sauce-salsa_2829-14218.jpg?w=500",
    prepTime: 12,
  },
  {
    name: "Limonada de Jengibre",
    description: "Limon natural, jengibre fresco, menta, miel. Refrescante y energizante.",
    price: 3.5,
    category: "bebidas",
    image: "https://img.freepik.com/free-photo/refreshing-lemonade-ready-be-served_23-2148617593.jpg?w=500",
    prepTime: 3,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");

    await Dish.deleteMany({});
    console.log("Coleccion limpia");

    await Dish.insertMany(dishes);
    console.log(`${dishes.length} platos insertados`);

    await mongoose.disconnect();
    console.log("Seed completado");
  } catch (err) {
    console.error("Error en seed:", err.message);
    process.exit(1);
  }
}

seed();
