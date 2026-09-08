import { faker } from "@faker-js/faker";
import { RegisterType } from "@models/register.type";

export function generateRegisterData(overrides: Partial<RegisterType> = {}): RegisterType {
  const password = overrides.password ? overrides.password : "Pass!123";
  return {
    email: `${Date.now()}-${faker.internet.email()}`,
    password,
    repeatPassword: password,
    securityAnswer: faker.lorem.word(),
    ...overrides,
  };
}
