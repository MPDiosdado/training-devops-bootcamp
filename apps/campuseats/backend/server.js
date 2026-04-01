const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const client = require("prom-client");
const dishRoutes = require("./routes/dishes");
const Dish = require("./models/Dish");

const app = express();
const PORT = process.env.PORT || 3333;
const MONGO_URI = process.env.DATABASE_URI || "mongodb://localhost:27017/campuseats";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// --- Prometheus metrics ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total de peticiones HTTP",
  labelNames: ["method", "endpoint", "status_code"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duracion de peticiones HTTP en segundos",
  labelNames: ["method", "endpoint"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

const dishesTotal = new client.Gauge({
  name: "database_dishes_total",
  help: "Total de platos en la base de datos",
  registers: [register],
  async collect() {
    try {
      const count = await Dish.countDocuments();
      this.set(count);
    } catch { this.set(0); }
  },
});

const appUptime = new client.Gauge({
  name: "app_uptime_seconds",
  help: "Tiempo de actividad de la aplicacion",
  registers: [register],
  collect() { this.set(process.uptime()); },
});

// Middleware para medir peticiones (excluye /metrics)
app.use((req, res, next) => {
  if (req.path === "/metrics") return next();
  const end = httpRequestDuration.startTimer({ method: req.method, endpoint: req.path });
  res.on("finish", () => {
    httpRequestsTotal.inc({ method: req.method, endpoint: req.path, status_code: res.statusCode });
    end();
  });
  next();
});

// Endpoint de metricas para Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Health
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "campuseats-api", timestamp: new Date().toISOString() });
});

// Routes
app.use("/dishes", dishRoutes);

// Connect to MongoDB and start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () => console.log(`CampusEats API en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err.message);
    process.exit(1);
  });
