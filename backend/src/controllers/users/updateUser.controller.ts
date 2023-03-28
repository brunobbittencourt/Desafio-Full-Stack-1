import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { updateUserService } from "../../services";

const updateUserController = async (req: Request, res: Response) => {
  const userData = req.body;
  const userId = req.user.id;
  const response = await updateUserService(userData, userId);

  return res.status(200).json(instanceToPlain(response));
};
export default updateUserController;
