import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { IContact } from "../../interfaces/contacts";
import { createUserService } from "../../services";
import createContactService from "../../services/contacts/createContact.service";

const createContactController = async (req: Request, res: Response) => {
  const userData = req.user;
  const contactData: IContact = req.body;
  const response = await createContactService(contactData, userData);

  return res.status(201).json(instanceToPlain(response));
};

export default createContactController;
