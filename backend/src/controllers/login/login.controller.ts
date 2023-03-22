import { Request, Response } from "express";
import { ILogin } from "../../interfaces/login";
import { loginService } from "../../services";

const loginController = async (request: Request, response: Response) => {
	const loginData: ILogin = request.body;
	const token = await loginService(loginData);

	return response.status(200).json({ token });
};

export default loginController;
