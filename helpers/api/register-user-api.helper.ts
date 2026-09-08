import { APIRequestContext, expect } from "@playwright/test";
import { generateRegisterData } from "@data/register.data";
import { LoginRequestType, LoginResponseType } from "@models/login.type";

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

export async function loginWithApi(
  login: LoginRequestType,
  request: APIRequestContext,
  baseURL: string | undefined,
): Promise<LoginResponseType> {
  const response = await request.post(baseURL + "/rest/user/login", {
    data: login,
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()).authentication as LoginResponseType;
}
