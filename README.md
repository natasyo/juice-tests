# Juice Shop — E2E и API тесты (Playwright)

Автотесты для [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) на базе [Playwright Test](https://playwright.dev/).

В проекте уже есть:

- UI E2E тесты для авторизованного и гостевого сценариев
- API тесты для регистрации и других endpoint-ов
- подготовка auth state через API (`setup/auth.setup.ts`)
- общие helper-ы для API и assertions

## Требования

- Node.js 18+
- Запущенное приложение Juice Shop на `http://localhost:3000`
- Установленные зависимости: `npm install`

## Установка

```bash
npm install
npx playwright install
```

## Запуск приложения (Docker)

Перед запуском тестов поднимите Juice Shop в контейнере:

```bash
docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop
```

Полезные команды:

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

```text
juice/
├── data/                 # Тестовые данные (faker)
│   ├── register.data.ts
│   ├── address.data.ts
│   └── card.data.ts
├── helpers/
│   ├── api/              # API helper-ы для работы с REST endpoint-ами
│   │   ├── register-user-api.helper.ts
│   │   └── ...
│   ├── assertions/       # Кастомные проверки для UI
│   │   ├── basket.helper.ts
│   │   └── pagination.ts
│   ├── components/       # UI компоненты
│   └── page/             # BasePage, Page Object Model
├── pages/                # Page Objects по страницам приложения
├── types/                # TypeScript типы
├── setup/
│   └── auth.setup.ts     # Создаёт пользователя через API и сохраняет storageState
├── tests/
│   ├── api/              # API-тесты
│   │   └── register-api.spec.ts
│   ├── auth/             # Тесты для авторизованного пользователя
│   │   └── search/
│   └── guest/            # Тесты для гостя
│       ├── basket/
│       ├── basket_with_auth/
│       ├── login/
│       ├── main/
│       └── register/
├── playwright.config.ts  # Конфигурация Playwright
├── tsconfig.json         # Aliases @helpers, @pages, @data, @models
├── eslint.config.mjs     # ESLint
├── package.json          # Сценарии запуска
a├── .github/
│   └── workflows/
│       └── playwright.yml
├── test-results/
├── playwright-report/
├── .auth/
└── README.md
```

## Запуск тестов

### Все тесты

```bash
npm test
```

### Конкретный UI-файл

```bash
npx playwright test tests/auth/search/search.spec.ts
```

### Конкретный API-файл

```bash
npx playwright test tests/api/register-api.spec.ts
```

### Только API-проект

```bash
npx playwright test --project=api
```

### Только auth UI-проект

```bash
npx playwright test --project=auth-chromium
```

### Только guest UI-проект

```bash
npx playwright test --project=guest-chromium
```

### По тегам

```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

### headed режим

```bash
npm run test:headed
```

### UI режим

```bash
npm run test:ui
```

## Линтинг и форматирование

```bash
npm run lint
npm run format
npm run format:check
```

## Запуск в нескольких браузерах

По умолчанию проект запускает тесты в браузерах:

- Chromium
- Firefox
- WebKit

Примеры:

```bash
npx playwright test --project=auth-chromium
npx playwright test --project=guest-firefox
npx playwright test --project=api
```

> Перед первым запуском в Firefox/WebKit установите браузеры: `npx playwright install`

## Отчёт

```bash
npx playwright show-report
```

Показать trace упавшего теста:

```bash
npx playwright show-trace test-results/<имя-теста>/trace.zip
```

## Проекты (projects)

В `playwright.config.ts` настроены отдельные группы:

| Проект            | Назначение                                                   |
| ----------------- | ------------------------------------------------------------ |
| `setup`           | Создаёт пользователя через API и сохраняет `.auth/user.json` |
| `api`             | API-тесты: регистрация, логин, адреса, корзина и т.д.        |
| `auth-{browser}`  | UI тесты для авторизованного пользователя                    |
| `guest-{browser}` | UI тесты для гостя                                           |

`{browser}` — один из `chromium`, `firefox`, `webkit`.

## Полезные команды

```bash
# Открыть UI-report
npm run test:report

# Показать список всех тестов без запуска
npm run test:list

# Сгенерировать Playwright codegen
npm run codegen
```

## Примечания

- Перед запуском убедитесь, что приложение отвечает на `http://localhost:3000`.
- Состояние авторизации хранится в `.auth/user.json` и создаётся автоматически.
- API тесты работают отдельно от UI-проектов и не зависят от `storageState`.
- Для успешной регистрации через API удобно использовать helper `createUser()` из [helpers/api/register-user-api.helper.ts](helpers/api/register-user-api.helper.ts).

## Типовой сценарий API теста

```ts
const response = await request.post(`${baseURL}/api/Users`, {
  data: {
    email: "test@example.com",
    password: "Pass!123",
    securityQuestion: { id: 1 },
  },
});

expect(response.status()).toBe(201);
expect(response.ok()).toBeTruthy();

const body = await response.json();
expect(body).not.toHaveProperty("errors");
```

## Типовой сценарий проверки validation error

```ts
const body = await response.json();

expect(body.errors).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      field: "email",
      message: expect.stringContaining("unique"),
    }),
  ]),
);
```
