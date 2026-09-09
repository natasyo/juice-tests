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
    const user = await createUser(request, baseURL);
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
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          message: expect.stringContaining("unique"),
        }),
      ]),
    );
    console.log("Response status:", await response.text());
  });
});
