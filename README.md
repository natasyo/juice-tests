# Juice Shop — E2E тесты (Playwright)

Автотесты интерфейса для [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) на базе [Playwright Test](https://playwright.dev/).

## Требования

- Node.js 18+
- Запущенное приложение Juice Shop на `http://localhost:3000` (перед запуском тестов)
- Установленные зависимости: `npm install`

## Установка

```bash
npm install
npx playwright install
```

## Запуск приложения (Docker)

Перед запуском тестов поднимите Juice Shop в Docker-контейнере:

```bash
docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop
```

Полезные команды для управления контейнером:

```bash
# Остановить контейнер
docker stop juice-shop

# Запустить остановленный контейнер
docker start juice-shop

# Удалить контейнер
docker rm juice-shop

# Посмотреть логи
docker logs juice-shop
```

Проверить, что приложение отвечает:

```bash
curl http://localhost:3000
```

## Структура проекта

```
juice/
├── data/                # Генерация тестовых данных (faker)
├── helpers/             # Хелперы (API-запросы и т.п.)
├── pages/               # Page Object Model (BasePage и др.)
├── setup/               # Глобальная подготовка (auth.setup.ts)
├── tests/
│   ├── auth/            # Тесты для авторизованного пользователя
│   │   └── search/      # Поиск (spec, page, fixture)
│   └── guest/           # Тесты для гостя (login, register)
├── types/               # TypeScript-типы
├── utils/               # Утилиты
├── playwright.config.ts # Конфигурация Playwright
└── test-results/        # Артефакты прогона (создаётся автоматически)
```

## Запуск тестов

Запустить все тесты:

```bash
npx playwright test
```

Запустить конкретный файл:

```bash
npx playwright test tests/auth/search/search.spec.ts
```

Запустить тесты по тегу:

```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

Запуск в headed-режиме (с окном браузера):

```bash
npx playwright test --headed
```

## Запуск в нескольких браузерах

По умолчанию тесты запускаются в трёх браузерах: **Chromium**, **Firefox** и **WebKit**.

Запустить в конкретном браузере (по имени проекта):

```bash
npx playwright test --project=auth-chromium
npx playwright test --project=guest-firefox
npx playwright test --project=auth-webkit
```

Запустить только тесты авторизованного пользователя во всех браузерах:

```bash
npx playwright test --project=auth-*
```

Чтобы изменить набор браузеров, отредактируйте массив `browsers` в `playwright.config.ts`.

> Перед первым запуском в Firefox/WebKit установите браузеры: `npx playwright install`.

## Отчёт

После прогона открыть HTML-отчёт:

```bash
npx playwright show-report
```

Просмотреть трейс упавшего теста:

```bash
npx playwright show-trace test-results/<имя-теста>/trace.zip
```

## Проекты (projects)

Конфигурация делит тесты на логические группы:

| Проект | Назначение |
|--------|------------|
| `setup` | Создаёт пользователя через API и сохраняет состояние в `.auth/user.json` |
| `auth-{browser}` | Тесты для авторизованного пользователя (зависит от `setup`) |
| `guest-{browser}` | Тесты для гостя: логин, регистрация |

`{browser}` — один из `chromium`, `firefox`, `webkit`.

## Полезные команды

```bash
# Интерактивная генерация кода
npx playwright codegen http://localhost:3000

# Список всех тестов без запуска
npx playwright test --list
```

## Примечания

- Перед запуском убедитесь, что приложение отвечает на `http://localhost:3000` — иначе проект `setup` упадёт с ошибкой `ECONNREFUSED`.
- Состояние авторизации хранится в `.auth/user.json` (создаётся автоматически, добавлено в `.gitignore`).
