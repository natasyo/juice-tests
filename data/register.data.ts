import { faker } from "@faker-js/faker";
import { RegisterType } from "../types/register.type";

export function generateRigisterData(
  ovveride: Partial<RegisterType> = {},
): RegisterType {
  const password = faker.internet.password();
  return {
    email: faker.internet.email(),
    password,
    repeatPassword: password,
    securityAnswer: faker.lorem.word(),
    ...ovveride,
  };
}
