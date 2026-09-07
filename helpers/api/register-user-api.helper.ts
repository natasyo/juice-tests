import { APIRequestContext, expect } from "@playwright/test";
import { generateRigisterData } from "../../data/register.data";
import { LoginRequestType, LoginResposeType } from "../../types/login.type";

export async function createUser(
  request: APIRequestContext,
  baseURL: string | undefined,
) {
  const user = generateRigisterData();
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
): Promise<LoginResposeType> {
  const response = await request.post(baseURL + "/rest/user/login", {
    data: login,
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()).authentication as LoginResposeType;
}
