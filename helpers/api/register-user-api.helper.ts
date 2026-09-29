import { APIRequestContext, expect } from "@playwright/test";
import { generateRegisterData } from "@data/register.data";

export async function createUser(request: APIRequestContext, baseURL: string | undefined) {
  const user = generateRegisterData();
  const response = await request.post(baseURL + "/api/Users", {
    data: {
      ...user,
      securityQuestion: {
        id: 1,
      },
    },
  });
  expect(response.ok()).toBeTruthy();
  return user;
}

