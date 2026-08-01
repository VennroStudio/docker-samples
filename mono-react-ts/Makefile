-include .env
export

WEB_SERVICE = mono-web-app
ADMIN_SERVICE = mono-admin-app
SERVICE ?= $(WEB_SERVICE)
SERVICES = $(WEB_SERVICE) $(ADMIN_SERVICE)
WORKSPACE ?= @mono/web
APP_NAME ?= web
DEPLOY_PROJECT_NAME ?= mono-react-ts
WEB_IMAGE_NAME ?= mono-web-container
ADMIN_IMAGE_NAME ?= mono-admin-container
IMAGE_NAME ?= $(WEB_IMAGE_NAME)
VERSION := $(IMAGE_TAG).$(BUILD_NUMBER)

# ─── Setup ────────────────────────────────────────────────────────────────────
create:
	docker run --rm -u "$$(id -u):$$(id -g)" -e npm_config_cache=/tmp/.npm -v "$(CURDIR):/app" -w /app node:22-alpine npm ci

# ─── Development ──────────────────────────────────────────────────────────────
init: docker-clear docker-build-all dev-all

restart:
	docker compose restart $(SERVICE)

restart-admin:
	docker compose restart $(ADMIN_SERVICE)

restart-all:
	docker compose restart $(SERVICES)

rebuild:
	docker compose up -d --build $(SERVICE)

rebuild-admin:
	docker compose up -d --build $(ADMIN_SERVICE)

rebuild-all:
	docker compose up -d --build $(SERVICES)

docker-up:
	docker compose up -d $(SERVICE)

docker-down:
	docker compose down

docker-clear:
	docker compose down -v

docker-build:
	docker compose build --pull $(SERVICE)

docker-build-admin:
	docker compose build --pull $(ADMIN_SERVICE)

docker-build-all:
	docker compose build --pull $(SERVICES)

# ─── Local ────────────────────────────────────────────────────────────────────
node-install:
	docker run --rm -u "$$(id -u):$$(id -g)" -e npm_config_cache=/tmp/.npm -v "$(CURDIR):/app" -w /app node:22-alpine npm ci

install:
	docker compose run --rm $(SERVICE) npm ci

npm-add:
	docker compose run --rm $(SERVICE) npm install $(PACK) --workspace=$(WORKSPACE)

npm-remove:
	docker compose run --rm $(SERVICE) npm uninstall $(PACK) --workspace=$(WORKSPACE)

npm-add-root:
	docker compose run --rm $(SERVICE) npm install -D $(PACK)

dev:
	docker compose up -d $(SERVICE)

dev-admin:
	docker compose up -d $(ADMIN_SERVICE)

dev-all:
	docker compose up -d $(SERVICES)

build-local:
	docker compose run --rm $(SERVICE) npm run build:web

build-admin:
	docker compose run --rm $(SERVICE) npm run build:admin

preview:
	docker compose run --rm --service-ports $(SERVICE) npm run preview:web -- --host 0.0.0.0

preview-admin:
	docker compose run --rm --service-ports $(ADMIN_SERVICE) npm run preview:admin -- --host 0.0.0.0

lint:
	docker compose run --rm $(SERVICE) npm run lint

typecheck:
	docker compose run --rm $(SERVICE) npm run check-types

test:
	docker compose run --rm $(SERVICE) npm test

check:
	docker compose run --rm $(SERVICE) sh -lc 'npm run check-types && npm run lint && npm test && npm run build:web && npm run build:admin && npm run check:bundle'

format:
	docker compose run --rm $(SERVICE) npx --yes prettier --write "apps/**/*.{ts,tsx,css,json}" "packages/**/*.{ts,tsx,css,json}"

docker-logs:
	docker compose logs -f $(SERVICE)

docker-shell:
	docker compose exec $(SERVICE) sh

# ─── Production ───────────────────────────────────────────────────────────────
docker-login:
	docker login ${REGISTRY}

server-login:
	ssh -t $(HOST) -p $(PORT) 'docker login $(REGISTRY)'

server-logout:
	ssh -t $(HOST) -p $(PORT) 'docker logout'

build:
	docker --log-level=debug build --platform linux/amd64 --pull \
		--file=./docker/production/Dockerfile \
		--build-arg APP_NAME=$(APP_NAME) \
		--build-arg VITE_API_URL=${VITE_API_URL} \
		--tag=${REGISTRY}/$(IMAGE_NAME):${VERSION} .

build-prod-web:
	$(MAKE) build APP_NAME=web IMAGE_NAME=$(WEB_IMAGE_NAME)

build-prod-admin:
	$(MAKE) build APP_NAME=admin IMAGE_NAME=$(ADMIN_IMAGE_NAME)

push:
	docker push ${REGISTRY}/$(IMAGE_NAME):${VERSION}

push-prod-web:
	$(MAKE) push IMAGE_NAME=$(WEB_IMAGE_NAME)

push-prod-admin:
	$(MAKE) push IMAGE_NAME=$(ADMIN_IMAGE_NAME)

deploy:
	ssh $(HOST) -p $(PORT) 'rm -rf $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER)'
	ssh $(HOST) -p $(PORT) 'mkdir $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER)'
	scp -P $(PORT) docker-compose-production.yml $(HOST):$(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER)/docker-compose-production.yml
	scp -P $(PORT) .env.prod $(HOST):$(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER)/.env
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && echo "COMPOSE_PROJECT_NAME=$(DEPLOY_PROJECT_NAME)" >> .env'
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && echo "REGISTRY=$(REGISTRY)" >> .env'
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && echo "IMAGE_TAG=$(VERSION)" >> .env'
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && docker compose -f docker-compose-production.yml pull'
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && docker compose -f docker-compose-production.yml down'
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && docker compose -f docker-compose-production.yml up -d'
	ssh $(HOST) -p $(PORT) 'rm -f $(DEPLOY_PROJECT_NAME)'
	ssh $(HOST) -p $(PORT) 'ln -sr $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) $(DEPLOY_PROJECT_NAME)'

rollback:
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && docker compose -f docker-compose-production.yml pull'
	ssh $(HOST) -p $(PORT) 'cd $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) && docker compose -f docker-compose-production.yml up --build --remove-orphans -d'
	ssh $(HOST) -p $(PORT) 'rm -f $(DEPLOY_PROJECT_NAME)'
	ssh $(HOST) -p $(PORT) 'ln -sr $(DEPLOY_PROJECT_NAME)_$(BUILD_NUMBER) $(DEPLOY_PROJECT_NAME)'

list-v:
	ssh $(HOST) -p $(PORT) 'ls -lht $(DEPLOY_PROJECT_NAME)_* 2>/dev/null || echo "Версии не найдены"'
	ssh $(HOST) -p $(PORT) 'readlink $(DEPLOY_PROJECT_NAME) 2>/dev/null || echo "Символическая ссылка не найдена"'

clean-v:
	ssh $(HOST) -p $(PORT) 'cd ~ && ls -dt $(DEPLOY_PROJECT_NAME)_* | tail -n +$$((${KEEP_VERSIONS} + 1)) | xargs -r rm -rf'

gitp:
	git add .
	git commit -m save
	git push

# ─── Help ─────────────────────────────────────────────────────────────────────
help:
	@echo "======================================"
	@echo "-SETUP:"
	@echo "  make create            - Установить зависимости монорепозитория"
	@echo "  make init              - Первый запуск (сборка + поднятие контейнеров)"
	@echo ""
	@echo "-DEVELOPMENT:"
	@echo "  make dev               - Запустить Web dev-приложение"
	@echo "  make dev-admin         - Запустить Admin dev-приложение"
	@echo "  make dev-all           - Запустить Web и Admin"
	@echo "  make restart           - Рестарт Web"
	@echo "  make restart-admin     - Рестарт Admin"
	@echo "  make restart-all       - Рестарт Web и Admin"
	@echo "  make rebuild           - Пересборка и перезапуск Web"
	@echo "  make rebuild-admin     - Пересборка и перезапуск Admin"
	@echo "  make rebuild-all       - Пересборка и перезапуск Web и Admin"
	@echo "  make docker-logs       - Логи контейнера"
	@echo "  make docker-shell      - Войти в контейнер"
	@echo ""
	@echo "-NPM:"
	@echo "  make install           - Чисто установить зависимости из package-lock.json"
	@echo "  make npm-add PACK=     - Добавить пакет"
	@echo "  make npm-remove PACK=  - Удалить пакет"
	@echo "  make lint              - Проверка Oxlint + FSD"
	@echo "  make typecheck         - Проверка TypeScript"
	@echo "  make test              - Запустить автоматические тесты"
	@echo "  make check             - Типы, lint, тесты и production build"
	@echo "  make build-admin       - Собрать Admin приложение"
	@echo "  make format            - Форматирование Prettier"
	@echo ""
	@echo "-PRODUCTION:"
	@echo "--Registry:"
	@echo "  make docker-login      - Авторизация локального докера в registry"
	@echo "  make server-login      - Авторизация удалённого докера в registry"
	@echo ""
	@echo "--Deploy:"
	@echo "  make build             - Собрать production образ"
	@echo "  make build-prod-web    - Собрать production образ Web"
	@echo "  make build-prod-admin  - Собрать production образ Admin"
	@echo "  make push              - Загрузить образ в registry"
	@echo "  make push-prod-web     - Загрузить production образ Web"
	@echo "  make push-prod-admin   - Загрузить production образ Admin"
	@echo "  make deploy            - Деплой на сервер"
	@echo "  make rollback          - Откат на предыдущую версию"
	@echo "  make list-v            - Список версий на сервере"
	@echo "  make clean-v           - Очистка старых версий"
	@echo "======================================"

.PHONY: help create init restart restart-admin restart-all rebuild rebuild-admin rebuild-all docker-up docker-down docker-clear docker-build docker-build-admin docker-build-all \
		docker-logs docker-shell node-install install npm-add npm-remove npm-add-root dev dev-admin dev-all build-local build-admin preview preview-admin lint typecheck test check format \
        docker-login server-login server-logout build build-prod-web build-prod-admin push push-prod-web push-prod-admin deploy rollback list-v clean-v
