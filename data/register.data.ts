import { faker } from "@faker-js/faker";
import { RegisterType } from "../types/register.type";

export function generateRigisterData(
  ovveride: Partial<RegisterType> = {},
): RegisterType {
  const password = ovveride.password ? ovveride.password : "Pass!123";
  return {
    email: `${Date.now()}-${faker.internet.email()}`,
    password,
    repeatPassword: password,
    securityAnswer: faker.lorem.word(),
    ...ovveride,
  };
}
