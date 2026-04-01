const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const pg = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:quizbattle@db:5432/quizbattle",
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "quizbattle-results" });
});

app.get("/api/results", async (req, res) => {
  try {
    const { rows } = await pg.query(
      "SELECT question_id, option, count FROM results ORDER BY question_id, count DESC"
    );
    const grouped = {};
    for (const r of rows) {
      if (!grouped[r.question_id]) grouped[r.question_id] = {};
      grouped[r.question_id][r.option] = parseInt(r.count);
    }
    res.json(grouped);
  } catch (err) {
    res.json({});
  }
});

app.get("/api/total", async (req, res) => {
  try {
    const { rows } = await pg.query("SELECT COUNT(*) as total FROM votes");
    res.json({ total: parseInt(rows[0].total) });
  } catch {
    res.json({ total: 0 });
  }
});

app.listen(PORT, () => console.log(`QuizBattle Results en http://localhost:${PORT}`));
