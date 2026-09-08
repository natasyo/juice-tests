import { APIRequestContext, expect } from "@playwright/test";
import { generateCardData } from "@data/card.data";
import { CreateCardRequest } from "@models/card.type";

export async function createCard(
  request: APIRequestContext,
  baseURL: string | undefined,
  token: string,
  card: CreateCardRequest = generateCardData(),
): Promise<CreateCardRequest> {
  const response = await request.post(baseURL + "/api/Cards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: card,
  });
  expect(response.ok()).toBeTruthy();
  return card;
}
