import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import AppError from "../../errors/appError";

const ensureAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization;

  if (!token) {
    throw new AppError("invalid token", 401);
  }

  token = token.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY!, (error, decoded: any) => {
    if (error) {
      throw new AppError(error.message, 401);
    }

    req.user = {
      id: decoded.sub as string,
      email: decoded.email as string,
    };

    return next();
  });
};

export default ensureAuthMiddleware;
