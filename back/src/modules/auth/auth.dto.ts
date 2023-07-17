export type ReqLoginDTO = {
  email: string;
  password: string;
};
export type ResLonginDTO = {
  id: number;
  name: string;
  email: string;
  active: true;
  token_sessao: string;
};
