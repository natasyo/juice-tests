import { expect, test } from "@playwright/test";
import { generateRegisterData } from "@data/register.data";

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

    const body = await response.json();
    expect(body).toBeTruthy();
  });
});
