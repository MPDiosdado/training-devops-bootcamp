# Bootcamp Fitness App

App hilo conductor del Bootcamp DevOps 2026.

**Autor:** Carlos Palanca — T-Systems

## Stack

| Componente | Tecnologia | Puerto |
|-----------|-----------|--------|
| **Backend** | Express + SQLite (better-sqlite3) | 3001 |
| **Frontend** | HTML + CSS + JavaScript vanilla | 3000 |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/exercises` | Listar todos los ejercicios |
| GET | `/api/exercises/:id` | Obtener un ejercicio |
| POST | `/api/exercises` | Crear ejercicio (body: name, category, description, duration) |
| PUT | `/api/exercises/:id` | Actualizar ejercicio |
| DELETE | `/api/exercises/:id` | Eliminar ejercicio |

## Arrancar en local

```bash
# Backend
cd backend
npm install
npm start        # http://localhost:3001

# Frontend (en otra terminal)
cd frontend
npx serve -s public -l 3000   # http://localhost:3000
```

## Tests

```bash
cd backend
npm test
```

## Que van a hacer los alumnos con esta app

| Dia | Que construyen |
|-----|---------------|
| Dia 1 | Dockerfile para backend y frontend, Docker Compose |
| Dia 2 | GitHub Actions pipeline (test, build, push imagen) |
| Dia 3 | Manifests K8s, Helm install, ArgoCD en kind |
| Dia 4 | Terraform local, Prometheus + Grafana |
