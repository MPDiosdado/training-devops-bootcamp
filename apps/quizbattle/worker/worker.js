const Redis = require("ioredis");
const { Pool } = require("pg");

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

const pg = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:quizbattle@db:5432/quizbattle",
});

async function initDB() {
  await pg.query(`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      question_id VARCHAR(50) NOT NULL,
      option VARCHAR(200) NOT NULL,
      voter_id VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pg.query(`
    CREATE TABLE IF NOT EXISTS results (
      question_id VARCHAR(50) NOT NULL,
      option VARCHAR(200) NOT NULL,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (question_id, option)
    )
  `);
  console.log("DB inicializada");
}

async function processVotes() {
  while (true) {
    try {
      const item = await redis.blpop("votes", 5);
      if (!item) continue;

      const vote = JSON.parse(item[1]);
      console.log(`Voto: ${vote.question_id} -> ${vote.option} (${vote.voter_id})`);

      await pg.query(
        "INSERT INTO votes (question_id, option, voter_id) VALUES ($1, $2, $3)",
        [vote.question_id, vote.option, vote.voter_id]
      );

      await pg.query(
        `INSERT INTO results (question_id, option, count)
         VALUES ($1, $2, 1)
         ON CONFLICT (question_id, option)
         DO UPDATE SET count = results.count + 1`,
        [vote.question_id, vote.option]
      );
    } catch (err) {
      console.error("Error procesando voto:", err.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

async function main() {
  console.log("QuizBattle Worker arrancando...");
  await initDB();
  console.log("Escuchando votos en Redis...");
  processVotes();
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
