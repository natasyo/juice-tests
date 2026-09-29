import { LoginRequestType, LoginResponseType } from "@models/login.type";
import { APIRequestContext, expect } from "@playwright/test";

export const LOGIN_ENDPOINT= "/rest/user/login"

export async function loginWithApi(
  login: LoginRequestType,
  request: APIRequestContext,
  baseURL: string | undefined,
): Promise<LoginResponseType> {
  const response = await request.post(baseURL +LOGIN_ENDPOINT, {
    data: login,
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()).authentication as LoginResponseType;
}
