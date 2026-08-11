export interface RegisterType {
  email: string;
  password: string;
  repeatPassword: string;
  securityQuestion?: string;
  securityAnswer: string;
}
