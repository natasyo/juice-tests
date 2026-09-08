import { faker } from "@faker-js/faker";
import { CreateCardRequest } from "@models/card.type";

export function generateCardData(overrides: Partial<CreateCardRequest> = {}): CreateCardRequest {
  return {
    cardNum: overrides.cardNum ?? 4111111111111111,
    expMonth: overrides.expMonth ?? String(faker.number.int({ min: 1, max: 12 })),
    expYear: overrides.expYear ?? String(faker.number.int({ min: 2080, max: 2099 })),
    fullName: overrides.fullName ?? faker.person.fullName(),
    ...overrides,
  };
}
