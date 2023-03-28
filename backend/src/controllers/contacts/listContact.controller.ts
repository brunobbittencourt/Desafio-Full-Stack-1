import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import listContactService from "../../services/contacts/listContact.service";

const listContactController = async (req: Request, res: Response) => {
  const response = await listContactService(req.user.id);

  return res.status(200).json(instanceToPlain(response));
};

export default listContactController;
