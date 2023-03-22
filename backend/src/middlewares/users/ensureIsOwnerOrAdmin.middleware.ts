import { Request, Response, NextFunction } from "express";
import AppError from "../../errors/appError";

const ensureIsOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id == req.user.id) {
    return next();
  }

  throw new AppError("You dont have permission", 401);
};

export default ensureIsOwner;
