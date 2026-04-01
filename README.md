# Training DevOps Bootcamp

Repositorio de trabajo para el **Bootcamp DevOps 2026** (T-Systems + Universidad de Granada).

Aqui esta el codigo de las aplicaciones con las que trabajareis durante los 4 dias del bootcamp. Cada dia le anadireis una pieza nueva: contenedores, pipelines, Kubernetes y monitoring.

---

## Preparar el entorno

Antes del primer dia, seguid la guia de instalacion que os proporcionara el instructor. Necesitais:

- Windows 10/11 con **WSL2 + Ubuntu**
- **Docker Desktop** con integracion WSL2
- **Git** + cuenta GitHub
- **VS Code** con extension WSL
- **Node.js 20**, **kubectl**, **kind**, **helm**, **terraform** (dentro de WSL2)

---

## Empezar a trabajar

1. **Forkead** este repositorio a vuestra cuenta de GitHub (boton "Fork" arriba a la derecha).

2. **Clonad** vuestro fork dentro de WSL2:

```bash
cd ~/bootcamp
git clone https://github.com/TU-USUARIO/training-devops-bootcamp.git
cd training-devops-bootcamp
```

3. Abrid VS Code:

```bash
code .
```

Ya estais listos para el Dia 1.

---

## Aplicaciones

### CampusEats (app principal — Dias 1-4)

Plataforma de comida del campus universitario. Backend API + frontend + base de datos.

```
apps/campuseats/
├── backend/     Express API + Mongoose (puerto 3333)
├── frontend/    HTML estatico + Nginx (puerto 5173)
├── mongo/       MongoDB 8.0 + seed data (10 platos)
└── compose.yml  3 servicios con healthchecks
```

**Stack:** Node.js + Express + MongoDB + Nginx

Para probarla en local:

```bash
cd apps/campuseats
docker compose up -d
```

- Frontend: http://localhost:5173
- API: http://localhost:3333/dishes

### MyFitness (Dia 1 — primer contacto con Docker)

App sencilla de seguimiento de ejercicios. La usareis para crear vuestro primer Dockerfile.

```
apps/myfitness/
├── backend/     Express API + SQLite (puerto 3001)
└── frontend/    HTML estatico + Nginx
```

**Stack:** Node.js + Express + SQLite

### QuizBattle (Dia 4 — Terraform multi-servicio)

Aplicacion de votacion en tiempo real con 5 microservicios. La desplegareis con Terraform.

```
apps/quizbattle/
├── vote/        Python Flask - UI de votacion (puerto 5050)
├── results/     Node Express - Dashboard tiempo real (puerto 5001)
├── worker/      Node - Procesa votos Redis → PostgreSQL
├── postgres/    Base de datos relacional
├── redis/       Cache en memoria
└── compose.yml  5 servicios
```

**Stack:** Python + Node.js + Redis + PostgreSQL

---

## Que vais a construir

Durante el bootcamp, este repositorio ira creciendo con vuestro trabajo:

| Dia | Que anadis | Archivos nuevos |
|-----|-----------|----------------|
| Dia 1 | Dockerfiles + Docker Compose | `apps/*/Dockerfile`, `docker-compose.yml` |
| Dia 2 | Pipeline CI/CD | `.github/workflows/ci.yml` |
| Dia 3 | Manifiestos Kubernetes | `k8s/*.yaml` |
| Dia 4 | Infraestructura Terraform + Monitoring | `terraform-*/`, dashboards Grafana |

---

## Estructura final (despues del Dia 4)

```
training-devops-bootcamp/
├── apps/
│   ├── campuseats/          ← App principal
│   ├── myfitness/           ← App Docker basico
│   └── quizbattle/          ← App multi-servicio
├── .github/
│   └── workflows/
│       └── ci.yml           ← Pipeline CI/CD (Dia 2)
├── k8s/                     ← Manifiestos Kubernetes (Dia 3)
│   ├── mongo-*.yaml
│   ├── backend-*.yaml
│   ├── frontend-*.yaml
│   └── configmap.yaml
└── README.md
```

---

## Reglas del repositorio

- Trabajad siempre en vuestra copia (fork). No modifiqueis el repo original.
- Haced commits frecuentes con mensajes descriptivos.
- Si algo se rompe, `git log` para ver que cambio y `git diff` para ver que es diferente.
