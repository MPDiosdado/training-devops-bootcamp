const request = require('supertest')
const app = require('../src/app')

describe('Health Check', () => {
  test('GET /health devuelve status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body).toHaveProperty('timestamp')
  })
})

describe('Ejercicios API', () => {
  test('GET /api/exercises devuelve lista de ejercicios', async () => {
    const res = await request(app).get('/api/exercises')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  test('GET /api/exercises/:id devuelve un ejercicio', async () => {
    const res = await request(app).get('/api/exercises/1')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('name')
    expect(res.body).toHaveProperty('category')
  })

  test('GET /api/exercises/:id devuelve 404 si no existe', async () => {
    const res = await request(app).get('/api/exercises/9999')
    expect(res.status).toBe(404)
  })

  test('POST /api/exercises crea un nuevo ejercicio', async () => {
    const newExercise = {
      name: 'Zancadas',
      description: 'Lunges alternando piernas',
      category: 'Piernas',
      duration: 12
    }
    const res = await request(app).post('/api/exercises').send(newExercise)
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Zancadas')
    expect(res.body).toHaveProperty('id')
  })

  test('POST /api/exercises devuelve 400 sin campos obligatorios', async () => {
    const res = await request(app).post('/api/exercises').send({ description: 'sin nombre' })
    expect(res.status).toBe(400)
  })

  test('PUT /api/exercises/:id actualiza un ejercicio', async () => {
    const res = await request(app).put('/api/exercises/1').send({ name: 'Sentadillas profundas' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Sentadillas profundas')
  })

  test('DELETE /api/exercises/:id elimina un ejercicio', async () => {
    // Crear uno para borrar
    const created = await request(app).post('/api/exercises').send({
      name: 'Temporal',
      category: 'Test'
    })
    const res = await request(app).delete(`/api/exercises/${created.body.id}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Ejercicio eliminado')
  })
})
