import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";

const validateSchemaMiddleware =
	(schema: AnySchema) =>
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			const data = request.body;
			const validatedData = await schema.validate(data, {
				abortEarly: false,
				stripUnknown: true,
			});
			request.body = validatedData;

			return next();
		} catch (error: any) {
			return response
				.status(400)
				.json({ message: error.errors.join(", ") });
		}
	};

export default validateSchemaMiddleware;
