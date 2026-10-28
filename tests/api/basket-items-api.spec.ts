import { createUser } from "@helpers/api/register-user-api.helper";
import { loginWithApi } from "@helpers/api/login-api.helper";
import { APIRequestContext, expect, test } from "@playwright/test";

const BASKET_ITEMS_ENDPOINT = "/api/BasketItems/";

async function createBasketSession(
  request: Parameters<typeof createUser>[0],
  baseURL: string | undefined,
) {
  const user = await createUser(request, baseURL);
  return loginWithApi({ email: user.email, password: user.password }, request, baseURL);
}

type BasketSession = Awaited<ReturnType<typeof createBasketSession>>;
type BasketItem = { id: number; ProductId: number; BasketId: number; quantity: number };

async function addBasketItem(
  request: APIRequestContext,
  baseURL: string | undefined,
  session: BasketSession,
  quantity = 1,
): Promise<BasketItem> {
  const response = await request.post(`${baseURL}${BASKET_ITEMS_ENDPOINT}`, {
    headers: { Authorization: `Bearer ${session.token}` },
    data: {
      ProductId: 52,
      BasketId: String(session.bid),
      quantity,
    },
  });

  expect(response.status()).toBe(200);
  return (await response.json()).data as BasketItem;
}

test.describe("Basket items API", () => {
  test("should add a product to the authenticated user's basket", async ({ request, baseURL }) => {
    const session = await createBasketSession(request, baseURL);
    const basketItem = {
      ProductId: 52,
      BasketId: String(session.bid),
      quantity: 1,
    };

    const response = await request.post(`${baseURL}${BASKET_ITEMS_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      data: basketItem,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("success");
    expect(body.data).toMatchObject(basketItem);
  });

  test("should list items in the authenticated user's basket", async ({ request, baseURL }) => {
    const session = await createBasketSession(request, baseURL);
    const item = await addBasketItem(request, baseURL, session, 2);

    const response = await request.get(
      `${baseURL}${BASKET_ITEMS_ENDPOINT}?BasketId=${session.bid}`,
      { headers: { Authorization: `Bearer ${session.token}` } },
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: item.id,
          ProductId: 52,
          BasketId: session.bid,
          quantity: 2,
        }),
      ]),
    );
  });

  test("should retrieve the authenticated user's basket with its products", async ({
    request,
    baseURL,
  }) => {
    const session = await createBasketSession(request, baseURL);
    await addBasketItem(request, baseURL, session, 2);

    const response = await request.get(`${baseURL}/rest/basket/${session.bid}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toMatchObject({
      id: session.bid,
      Products: expect.arrayContaining([
        expect.objectContaining({
          id: 52,
          BasketItem: expect.objectContaining({ quantity: 2 }),
        }),
      ]),
    });
  });

  test("should retrieve a basket item by id", async ({ request, baseURL }) => {
    const session = await createBasketSession(request, baseURL);
    const item = await addBasketItem(request, baseURL, session);

    const response = await request.get(`${baseURL}${BASKET_ITEMS_ENDPOINT}${item.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toMatchObject({
      id: item.id,
      ProductId: 52,
      BasketId: session.bid,
      quantity: 1,
    });
  });

  test("should update the quantity of a basket item", async ({ request, baseURL }) => {
    const session = await createBasketSession(request, baseURL);
    const item = await addBasketItem(request, baseURL, session);

    const response = await request.put(`${baseURL}${BASKET_ITEMS_ENDPOINT}${item.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      data: { quantity: 3 },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toMatchObject({ id: item.id, quantity: 3 });
  });

  test("should remove a basket item", async ({ request, baseURL }) => {
    const session = await createBasketSession(request, baseURL);
    const item = await addBasketItem(request, baseURL, session);
    const headers = { Authorization: `Bearer ${session.token}` };

    const deleteResponse = await request.delete(
      `${baseURL}${BASKET_ITEMS_ENDPOINT}${item.id}`,
      { headers },
    );

    expect(deleteResponse.status()).toBe(200);
    expect((await deleteResponse.json()).status).toBe("success");

    const getResponse = await request.get(`${baseURL}${BASKET_ITEMS_ENDPOINT}${item.id}`, {
      headers,
    });
    expect(getResponse.status()).toBe(404);
  });

  test("should reject adding a basket item without authentication", async ({
    request,
    baseURL,
  }) => {
    const response = await request.post(`${baseURL}${BASKET_ITEMS_ENDPOINT}`, {
      data: { ProductId: 52, BasketId: "24", quantity: 1 },
    });

    expect(response.status()).toBe(401);
  });

  test("should reject an unknown product id", async ({ request, baseURL }) => {
    test.fail(true, "Unknown products currently produce HTTP 500; expected a client error.");
    const session = await createBasketSession(request, baseURL);

    const response = await request.post(`${baseURL}${BASKET_ITEMS_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      data: {
        ProductId: 999999,
        BasketId: String(session.bid),
        quantity: 1,
      },
    });

    expect(response.status()).toBe(400);
  });

  test("should reject a zero quantity", async ({ request, baseURL }) => {
    test.fail(true, "The API currently accepts quantity 0; expected a client error.");
    const session = await createBasketSession(request, baseURL);

    const response = await request.post(`${baseURL}${BASKET_ITEMS_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      data: {
        ProductId: 52,
        BasketId: String(session.bid),
        quantity: 0,
      },
    });

    expect(response.status()).toBe(400);
  });
});
