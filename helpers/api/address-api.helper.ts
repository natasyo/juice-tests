import { APIRequestContext, expect } from "@playwright/test";
import { AddressType } from "@models/address.type";
import { generateAddressData } from "@data/address.data";

export async function createAddress(
  request: APIRequestContext,
  baseURL: string | undefined,
  token: string,
  address: AddressType = generateAddressData(),
): Promise<AddressType> {
  const response = await request.post(baseURL + "/api/Addresss", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: address,
  });
  expect(response.ok()).toBeTruthy();
  return address;
}
