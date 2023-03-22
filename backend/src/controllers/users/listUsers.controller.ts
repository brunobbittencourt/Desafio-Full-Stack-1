import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { listUsersService } from "../../services";

const listUserController = async (req: Request, res: Response) => {
  const response = await listUsersService(req.user.id);

  return res.status(200).json(instanceToPlain(response));
};

export default listUserController;
