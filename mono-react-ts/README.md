# React + TypeScript Monorepo Docker

Готовая заготовка для старта нескольких React + TypeScript приложений в одном
монорепозитории.

## Структура

```text
apps/
  web/       Публичное приложение
  admin/     Админ-приложение

packages/
  api-client/    HTTP-клиент, схемы API-ответов и endpoints
  app-runtime/   Общие провайдеры, React Query и bootstrap приложения
  theme/         Общие Tailwind CSS tokens и базовые стили
  ui/            Переиспользуемые UI-компоненты
```

Пакеты подключаются как npm workspaces и публикуют только явные entrypoints через
`exports`. Для TypeScript эти entrypoints синхронизируются с `tsconfig.base.json`
командой `npm run check:exports`.

## Быстрый старт

### 1. Создать `.env`

```bash
cp .env.example .env
```

### 2. Установить зависимости

```bash
make create
```

### 3. Запустить приложения

```bash
make dev-all
```

По умолчанию dev-серверы доступны на:

```text
http://localhost:5173  # web
http://localhost:5174  # admin
```

Если используешь nginx-proxy или локальные домены, добавь в `/etc/hosts`:

```text
127.0.0.1   mono-web.local
127.0.0.1   mono-admin.local
```

## Команды

```bash
make help        # Показать список команд
make dev         # Запустить только web
make dev-admin   # Запустить только admin
make dev-all     # Запустить оба приложения
make check       # Типы, lint, тесты, сборки и bundle budgets
```

Добавление зависимости в workspace:

```bash
make npm-add WORKSPACE=@mono/web PACK=package-name
make npm-add WORKSPACE=@mono/ui PACK=package-name
```

## Новый пакет

1. Создай директорию в `packages/*`.
2. Добавь `package.json` с нужными `exports`.
3. Добавь matching alias в `tsconfig.base.json`.
4. Запусти `npm run check:exports`.
