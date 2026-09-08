export interface LoginRequestType {
  email: string;
  password: string;
}

export interface LoginResponseType {
  token: string;
  bid: number;
  umail: string;
}
