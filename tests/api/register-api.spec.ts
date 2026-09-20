import { expect, test } from "@playwright/test";
import { generateRegisterData } from "@data/register.data";
import { createUser } from "@helpers/api/register-user-api.helper";

test.describe("Register API", () => {
  test("should register a new user successfully", async ({ request, baseURL }) => {
    const user = generateRegisterData();

    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        ...user,
        securityQuestion: {
          id: 1,
        },
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const text = await response.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      throw new Error(`Response is not valid JSON: ${text}`);
    }
    expect(body).toBeTruthy();
    expect(body).not.toHaveProperty("errors");
  });

  test("should fail to register a user with an existing email", async ({ request, baseURL }) => {
    // 1. Создаём пользователя — email становится занятым.
    const user = await createUser(request, baseURL);

    // 2. Повторяем регистрацию с тем же email и тем же валидным телом запроса.
    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.repeatPassword,
        securityQuestion: { id: 1 },
        securityAnswer: user.securityAnswer,
      },
    });

    // 3. Ожидаем 400 Bad Request.
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("errors");
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          message: expect.stringContaining("unique"),
        }),
      ]),
    );
  });

  test("should fail to register a user with an invalid email", async ({ request, baseURL }) => {
    const user = generateRegisterData({ email: "invalid-email" });
    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        ...user,
      },
    });
    expect(response.status()).toBe(400);
    const text = await response.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      throw new Error(`Response is not valid JSON: ${text}`);
    }
    expect(body).toHaveProperty("errors");
  });

  test.fail("should reject a password shorter than 5 characters", async ({ request, baseURL }) => {
    test.info().annotations.push({
      type: "issue",
      description: "https://github.com/natasyo/juice-tests/issues/3",
    });
    const user = generateRegisterData({ password: "1234" });

    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.repeatPassword,
        securityQuestion: { id: 1 },
        securityAnswer: user.securityAnswer,
      },
    });

    // Ожидается 400 Bad Request с ошибкой о минимальной длине пароля.
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("errors");
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          message: expect.stringContaining("5"),
        }),
      ]),
    );
  });

  test.fail("should reject a password longer than 40 characters", async ({ request, baseURL }) => {
    test.info().annotations.push({
      type: "issue",
      description: "https://github.com/natasyo/juice-tests/issues/3",
    });
    const user = generateRegisterData({ password: "a".repeat(41) });

    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.repeatPassword,
        securityQuestion: { id: 1 },
        securityAnswer: user.securityAnswer,
      },
    });

    // Ожидается 400 Bad Request с ошибкой о максимальной длине пароля.
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("errors");
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          message: expect.stringContaining("40"),
        }),
      ]),
    );
  });

  test("should reject an empty email", async ({ request, baseURL }) => {
    const user = generateRegisterData({ email: "" });

    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.repeatPassword,
        securityQuestion: { id: 1 },
        securityAnswer: user.securityAnswer,
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.text();
    expect(body).toContain("cannot be empty");
  });

  test("should reject an empty password", async ({ request, baseURL }) => {
    const user = generateRegisterData({ password: "" });

    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.repeatPassword,
        securityQuestion: { id: 1 },
        securityAnswer: user.securityAnswer,
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.text();
    expect(body).toContain("cannot be empty");
  });

  test.fail("should reject mismatched passwordRepeat", async ({ request, baseURL }) => {
    test.info().annotations.push({
      type: "issue",
      description: "https://github.com/natasyo/juice-tests/issues/3",
    });
    const user = generateRegisterData({ password: "Pass!123", repeatPassword: "Different!123" });

    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.repeatPassword,
        securityQuestion: { id: 1 },
        securityAnswer: user.securityAnswer,
      },
    });

    // Ожидается 400 Bad Request: passwordRepeat не совпадает с password.
    expect(response.status()).toBe(400);
  });

  test.fail("should reject registration without securityQuestion", async ({ request, baseURL }) => {
    test.info().annotations.push({
      type: "issue",
      description: "https://github.com/natasyo/juice-tests/issues/3",
    });
    const user = generateRegisterData();

    const response = await request.post(`${baseURL}/api/Users`, {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.repeatPassword,
        securityAnswer: user.securityAnswer,
      },
    });

    // Ожидается 400 Bad Request: securityQuestion — обязательное поле.
    expect(response.status()).toBe(400);
  });
});
