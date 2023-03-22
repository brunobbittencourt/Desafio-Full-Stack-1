import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../data-source";
import User from "../../entities/users.entity";
import AppError from "../../errors/appError";

const ensureUserExists = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.params.id.length < 36) {
		throw new AppError("Invalid id", 404);
	}

	const userRepository = AppDataSource.getRepository(User);

	const user = await userRepository.findOneBy({
		id: req.params.id,
	});

	if (!user) {
		throw new AppError("User dont exists", 404);
	}

	return next();
};

export default ensureUserExists;
