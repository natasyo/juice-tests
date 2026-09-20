# BUG-001: API принимает пароль короче 5 символов при регистрации

| Поле | Значение |
|---|---|
| **ID** | BUG-001 |
| **Severity** | Medium (Security / Data integrity) |
| **Priority** | Medium |
| **Компонент** | API / Registration |
| **Endpoint** | `POST /api/Users` |
| **Окружение** | OWASP Juice Shop (Docker), `http://localhost:3000`, Playwright 1.62 |
| **Статус** | Open |
| **Автор** | QA Automation |
| **Дата** | 2026-09-20 |

---

## Описание (Summary)

Эндпоинт `POST /api/Users` создаёт пользователя с паролем из 4 символов
(возвращает HTTP **201 Created**), хотя UI-форма регистрации запрещает пароли
короче 5 символов. Серверная валидация минимальной длины пароля отсутствует —
валидация выполняется только на клиенте.

---

## Предусловия (Preconditions)

- Приложение Juice Shop запущено на `http://localhost:3000`.
- Доступен эндпоинт `POST /api/Users`.
- Email не зарегистрирован в системе.

---

## Шаги для воспроизведения (Steps to Reproduce)

1. Отправить `POST /api/Users` с телом:

```json
{
  "email": "weakpass-example@example.com",
  "password": "1234",
  "passwordRepeat": "1234",
  "securityQuestion": { "id": 1 },
  "securityAnswer": "answer"
}
```

2. Проверить HTTP-статус и тело ответа.

---

## Ожидаемый результат (Expected Result)

- HTTP **400 Bad Request**.
- В теле ответа присутствует ошибка для поля `password` о минимальной длине.

---

## Фактический результат (Actual Result)

- HTTP **201 Created**.
- Пользователь успешно создан со слабым паролем `1234`.

```json
{
  "status": "success",
  "data": {
    "id": 73,
    "email": "weakpass-example@example.com"
  }
}
```

---

## Подтверждение (Evidence)

- UI-валидация (тест `tests/guest/register/register.spec.ts`) блокирует пароли
  короче 5 символов (`aria-invalid="true"`).
- API-тест `tests/api/register-api.spec.ts` → `should reject a password shorter
  than 5 characters` падает: ожидал 400, получил 201.
- Ручная проверка через `curl` подтверждает `201 Created`.

---

## Окружение (Environment)

- **ОС:** Linux (Ubuntu)
- **Браузер / Версия:** не применимо (API)
- **Приложение:** OWASP Juice Shop (Docker) на `http://localhost:3000`
- **Инструмент:** Playwright 1.62 / curl

---

## Вложения (Attachments)

- `error-context.md` (Playwright)
- лог ответа API
