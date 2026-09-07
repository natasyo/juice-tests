export interface LoginRequestType {
  email: string;
  password: string;
}

export interface LoginResposeType {
  token: string;
  bid: number;
  umail: string;
}
