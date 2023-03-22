import { Request, Response } from "express";
import { updateUserService } from "../../services";

const updateUserController = async (req: Request, res: Response) => {
  const userData = req.body;
  const userId = req.params.id;
  const response = await updateUserService(userData, userId);

  return res.status(200).json(response);
};
export default updateUserController;
