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
├── data/                # Генерация тестовых данных (faker) — register.data.ts, address.data.ts
├── helpers/
│   ├── api/             # Подготовка данных через API (createUser, loginWithApi, createAddress)
│   ├── assertions/      # Кастомные проверки (basket, pagination)
│   ├── components/      # UI-компоненты (pagination)
│   └── page/            # Page Object Model (BasePage, BasketBasePage, WithProducts)
├── pages/               # Страницы приложения (search, login, main, register, basket)
├── types/               # TypeScript-типы (login.type.ts, register.type.ts, address.type.ts)
├── setup/               # Глобальная подготовка (auth.setup.ts)
├── tests/
│   ├── auth/            # Тесты для авторизованного пользователя (storageState)
│   │   └── search/      # Поиск (spec, page, fixture)
│   └── guest/           # Тесты для гостя
│       ├── basket/              # Корзина без авторизации
│       ├── basket_with_auth/    # Корзина с авторизацией (пользователь создаётся в beforeEach через API)
│       ├── login/               # Логин
│       ├── main/                # Главная страница
│       └── register/            # Регистрация
├── playwright.config.ts # Конфигурация Playwright
├── tsconfig.json        # TypeScript-конфигурация + алиасы путей (@helpers/*, @pages/*, @models/* и др.)
├── eslint.config.mjs    # Конфигурация ESLint
├── .prettierrc          # Конфигурация Prettier
└── test-results/        # Артефакты прогона (создаётся автоматически)
```

## Запуск тестов

Запустить все тесты:

```bash
npm test
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
npm run test:headed
```

Запуск в UI-режиме:

```bash
npm run test:ui
```

## Линтинг и форматирование

Проверить код линтером:

```bash
npm run lint
```

Отформатировать код (Prettier):

```bash
npm run format
```

Проверить форматирование без изменения файлов:

```bash
npm run format:check
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
| `guest-{browser}` | Тесты для гостя: регистрация, логин, главная страница, корзина |

`{browser}` — один из `chromium`, `firefox`, `webkit`.

## Полезные команды

```bash
# Интерактивная генерация кода
npm run codegen

# Список всех тестов без запуска
npm run test:list

# Открыть HTML-отчёт
npm run test:report
```

## Примечания

- Перед запуском убедитесь, что приложение отвечает на `http://localhost:3000` — иначе проект `setup` упадёт с ошибкой `ECONNREFUSED`.
- Состояние авторизации хранится в `.auth/user.json` (создаётся автоматически, добавлено в `.gitignore`).
