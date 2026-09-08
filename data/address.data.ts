import { faker } from "@faker-js/faker";
import { AddressType } from "@models/address.type";

export function generateAddressData(overrides: Partial<AddressType> = {}): AddressType {
  return {
    city: faker.location.city(),
    country: faker.location.country(),
    fullName: faker.person.fullName(),
    // Juice Shop restricts mobileNum to max 10 digits
    mobileNum: Number(faker.phone.number().replace(/\D/g, "").slice(0, 10)),
    state: faker.location.state(),
    streetAddress: faker.location.streetAddress(),
    // Juice Shop restricts zipCode to max length 8
    zipCode: faker.location.zipCode().slice(0, 8),
    ...overrides,
  };
}
