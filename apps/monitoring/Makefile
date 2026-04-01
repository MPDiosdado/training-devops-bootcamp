# Makefile - MyFitness Monitoring Stack
# Bootcamp DevOps 2026 | Carlos Palanca - T-Systems

.PHONY: help up down restart logs monitoring stop-monitoring health test status clean all stop-all urls

DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_MONITORING = docker compose -f docker-compose.monitoring.yml

GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m

help: ## Mostrar esta ayuda
	@echo "$(GREEN)MyFitness Monitoring - Bootcamp DevOps 2026$(NC)"
	@echo "$(YELLOW)Comandos disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

up: ## Levantar MyFitness (backend + frontend)
	@echo "$(GREEN)Levantando MyFitness...$(NC)"
	@$(DOCKER_COMPOSE) up -d --build
	@echo "$(GREEN)MyFitness iniciada$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Backend API: http://localhost:3001$(NC)"
	@echo "$(YELLOW)Metricas: http://localhost:3001/metrics$(NC)"

down: ## Detener MyFitness
	@$(DOCKER_COMPOSE) down

restart: ## Reiniciar MyFitness
	@$(DOCKER_COMPOSE) restart

logs: ## Ver logs de MyFitness
	@$(DOCKER_COMPOSE) logs -f

monitoring: ## Levantar Prometheus + Grafana
	@echo "$(GREEN)Levantando stack de monitoreo...$(NC)"
	@$(DOCKER_COMPOSE_MONITORING) up -d
	@echo "$(GREEN)Monitoreo iniciado$(NC)"
	@echo "$(YELLOW)Prometheus: http://localhost:9090$(NC)"
	@echo "$(YELLOW)Grafana: http://localhost:3002 (admin/admin)$(NC)"
	@echo "$(YELLOW)Node Exporter: http://localhost:9100$(NC)"

stop-monitoring: ## Detener Prometheus + Grafana
	@$(DOCKER_COMPOSE_MONITORING) down

monitoring-logs: ## Ver logs del monitoreo
	@$(DOCKER_COMPOSE_MONITORING) logs -f

all: ## Levantar todo (app + monitoreo)
	@echo "$(GREEN)Levantando MyFitness + monitoreo...$(NC)"
	@make up
	@sleep 5
	@make monitoring
	@echo "$(GREEN)Todo listo!$(NC)"
	@make urls

stop-all: ## Detener todo
	@make down
	@make stop-monitoring

health: ## Verificar salud de los servicios
	@echo "$(YELLOW)Backend Health:$(NC)"
	@curl -s http://localhost:3001/health | python -m json.tool 2>/dev/null || curl -s http://localhost:3001/health || echo "Backend no disponible"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -f -s http://localhost:3000/ > /dev/null && echo "Frontend OK" || echo "Frontend no disponible"
	@echo ""
	@echo "$(YELLOW)Metricas Prometheus:$(NC)"
	@curl -f -s http://localhost:3001/metrics > /dev/null && echo "Endpoint /metrics OK" || echo "Metricas no disponibles"
	@echo ""
	@echo "$(YELLOW)Prometheus:$(NC)"
	@curl -f -s http://localhost:9090/-/healthy > /dev/null && echo "Prometheus OK" || echo "Prometheus no activo"
	@echo ""
	@echo "$(YELLOW)Grafana:$(NC)"
	@curl -f -s http://localhost:3002/api/health > /dev/null && echo "Grafana OK" || echo "Grafana no activo"

test: ## Ejecutar tests basicos de conectividad
	@echo "$(GREEN)Testing servicios...$(NC)"
	@curl -f http://localhost:3001/health > /dev/null 2>&1 && echo "Backend OK" || echo "Backend FAIL"
	@curl -f http://localhost:3001/api/exercises > /dev/null 2>&1 && echo "API Exercises OK" || echo "API Exercises FAIL"
	@curl -f http://localhost:3001/metrics > /dev/null 2>&1 && echo "Metrics OK" || echo "Metrics FAIL"
	@curl -f http://localhost:3000/ > /dev/null 2>&1 && echo "Frontend OK" || echo "Frontend FAIL"
	@curl -f http://localhost:9090 > /dev/null 2>&1 && echo "Prometheus OK" || echo "Prometheus no activo"
	@curl -f http://localhost:3002 > /dev/null 2>&1 && echo "Grafana OK" || echo "Grafana no activo"

status: ## Ver estado de contenedores
	@$(DOCKER_COMPOSE) ps
	@echo ""
	@$(DOCKER_COMPOSE_MONITORING) ps

urls: ## Mostrar todas las URLs
	@echo "$(GREEN)URLs disponibles:$(NC)"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Backend API:  http://localhost:3001"
	@echo "  Health Check: http://localhost:3001/health"
	@echo "  Metricas:     http://localhost:3001/metrics"
	@echo "  Prometheus:   http://localhost:9090"
	@echo "  Grafana:      http://localhost:3002 (admin/admin)"
	@echo "  Node Exporter: http://localhost:9100"

clean: ## Limpiar contenedores y volumenes
	@$(DOCKER_COMPOSE) down -v --remove-orphans
	@$(DOCKER_COMPOSE_MONITORING) down -v --remove-orphans
	@docker system prune -f
