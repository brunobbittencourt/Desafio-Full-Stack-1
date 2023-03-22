import { ILogin } from "../../../interfaces/login";
import { IOngRequest } from "../../../interfaces/ongs";

export const mockedOng: IOngRequest = {
	companyName: "ABCDE",
	email: "abcde@email.com",
	password: "1234",
	cnpj: "12345678901219",
	phone: 219765478,
};

export const mockedDeleteOng: IOngRequest = {
	companyName: "Delete ONG",
	email: "delete@email.com",
	password: "1234",
	cnpj: "12345678901210",
	phone: 219765479,
};

export const mockedOngLogin: ILogin = {
	email: "abcde@email.com",
	password: "1234",
};

export const mockedLogin: ILogin = {
	email: "rafaelquadros@mail.com",
	password: "123456",
};
