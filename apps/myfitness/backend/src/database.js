const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'bootcamp.db')

// Crear directorio data si no existe
const fs = require('fs')
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(DB_PATH)

// Activar WAL mode para mejor rendimiento
db.pragma('journal_mode = WAL')

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT NOT NULL,
    duration INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Insertar datos iniciales si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) as count FROM exercises').get()
if (count.count === 0) {
  const insert = db.prepare(
    'INSERT INTO exercises (name, description, category, duration) VALUES (?, ?, ?, ?)'
  )

  const exercises = [
    ['Sentadillas', 'Ejercicio de piernas con peso corporal', 'Piernas', 15],
    ['Flexiones', 'Push-ups tradicionales en el suelo', 'Pecho', 10],
    ['Plancha', 'Mantener posicion isometrica 60 segundos', 'Core', 5],
    ['Burpees', 'Ejercicio completo de alta intensidad', 'Cardio', 20],
    ['Dominadas', 'Pull-ups en barra fija', 'Espalda', 15],
  ]

  const insertMany = db.transaction((exercises) => {
    for (const ex of exercises) {
      insert.run(...ex)
    }
  })

  insertMany(exercises)
  console.log('Base de datos inicializada con 5 ejercicios')
}

module.exports = db
