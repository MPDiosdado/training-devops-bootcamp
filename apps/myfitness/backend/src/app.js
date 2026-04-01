const express = require('express')
const cors = require('cors')
const client = require('prom-client')
const db = require('./database')

const app = express()

app.use(cors())
app.use(express.json())

// --- Prometheus metrics ---
const register = new client.Registry()
client.collectDefaultMetrics({ register })

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['method', 'endpoint', 'status_code'],
  registers: [register],
})

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duracion de peticiones HTTP en segundos',
  labelNames: ['method', 'endpoint'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
})

const exercisesTotal = new client.Gauge({
  name: 'database_exercises_total',
  help: 'Total de ejercicios en la base de datos',
  registers: [register],
  collect() {
    const row = db.prepare('SELECT COUNT(*) as count FROM exercises').get()
    this.set(row.count)
  },
})

const appUptime = new client.Gauge({
  name: 'app_uptime_seconds',
  help: 'Tiempo de actividad de la aplicacion',
  registers: [register],
  collect() {
    this.set(process.uptime())
  },
})

// Middleware para medir peticiones (excluye /metrics y /health)
app.use((req, res, next) => {
  if (req.path === '/metrics') return next()
  const end = httpRequestDuration.startTimer({ method: req.method, endpoint: req.path })
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, endpoint: req.path, status_code: res.statusCode })
    end()
  })
  next()
})

// Endpoint de metricas para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Obtener todos los ejercicios
app.get('/api/exercises', (req, res) => {
  const exercises = db.prepare('SELECT * FROM exercises ORDER BY id DESC').all()
  res.json(exercises)
})

// Obtener un ejercicio por ID
app.get('/api/exercises/:id', (req, res) => {
  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id)
  if (!exercise) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' })
  }
  res.json(exercise)
})

// Crear un nuevo ejercicio
app.post('/api/exercises', (req, res) => {
  const { name, description, category, duration } = req.body

  if (!name || !category) {
    return res.status(400).json({ error: 'name y category son obligatorios' })
  }

  const result = db.prepare(
    'INSERT INTO exercises (name, description, category, duration) VALUES (?, ?, ?, ?)'
  ).run(name, description || '', category, duration || 0)

  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(exercise)
})

// Actualizar un ejercicio
app.put('/api/exercises/:id', (req, res) => {
  const { name, description, category, duration } = req.body
  const existing = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id)

  if (!existing) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' })
  }

  db.prepare(
    'UPDATE exercises SET name = ?, description = ?, category = ?, duration = ? WHERE id = ?'
  ).run(
    name || existing.name,
    description || existing.description,
    category || existing.category,
    duration || existing.duration,
    req.params.id
  )

  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id)
  res.json(exercise)
})

// Eliminar un ejercicio
app.delete('/api/exercises/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id)

  if (!existing) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' })
  }

  db.prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id)
  res.json({ message: 'Ejercicio eliminado' })
})

module.exports = app
