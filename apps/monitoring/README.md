# MyFitness - Stack de Monitoreo

**Autor:** Carlos Palanca -- T-Systems | Bootcamp DevOps 2026

Stack completo de observabilidad para la app MyFitness usando Prometheus y Grafana.

## Arquitectura

```
                         APLICACION
  +-----------+    +------------------+
  | Frontend  |    | Backend (Express)|
  | (Nginx)   |    | /api/exercises   |
  | :3000     |    | /metrics         |
  +-----------+    | :3001            |
                   +--------+---------+
                            |
                   MONITOREO|
          +-----------------+------------------+
          |                 |                  |
  +-------+------+  +------+-------+  +-------+--------+
  | Prometheus   |  | Grafana      |  | Node Exporter  |
  | :9090        |  | :3002        |  | :9100          |
  | scrape /metrics  | dashboards  |  | metricas host  |
  +--------------+  +--------------+  +----------------+
```

## Arranque rapido

```bash
# Levantar todo (app + monitoreo)
make all

# O paso a paso:
make up           # MyFitness (backend + frontend)
make monitoring   # Prometheus + Grafana
```

## URLs

| Servicio | URL | Credenciales |
|----------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:3001 | - |
| Metricas | http://localhost:3001/metrics | - |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3002 | admin/admin |
| Node Exporter | http://localhost:9100 | - |

## Metricas expuestas por MyFitness

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `http_requests_total` | Counter | Total peticiones HTTP (labels: method, endpoint, status_code) |
| `http_request_duration_seconds` | Histogram | Duracion de peticiones en segundos |
| `database_exercises_total` | Gauge | Total de ejercicios en la base de datos |
| `app_uptime_seconds` | Gauge | Tiempo de actividad de la app |

## Dashboard de Grafana

El dashboard preconfigurado incluye:

- Estado de servicios (backend, Prometheus, node-exporter)
- Requests por segundo (RPS) y latencia (P50, P95, P99)
- Distribucion de status codes (200, 404, 500...)
- Total y crecimiento de ejercicios
- Operaciones CRUD por segundo
- CPU y memoria del servidor (via node-exporter)
- Top endpoints mas usados y con mas errores

## Comandos

```bash
make help             # Ver todos los comandos
make up               # Levantar MyFitness
make monitoring       # Levantar Prometheus + Grafana
make all              # Levantar todo
make health           # Verificar salud de servicios
make test             # Tests de conectividad
make logs             # Logs de la app
make monitoring-logs  # Logs del monitoreo
make status           # Estado de contenedores
make stop-all         # Detener todo
make clean            # Limpiar todo
```

## Troubleshooting

**Grafana no muestra datos:**
```bash
# Verificar que el backend expone metricas
curl http://localhost:3001/metrics

# Verificar que Prometheus esta scrapeando
# Ir a http://localhost:9090/targets
```

**Backend no arranca:**
```bash
make logs   # Ver errores en los logs
```
