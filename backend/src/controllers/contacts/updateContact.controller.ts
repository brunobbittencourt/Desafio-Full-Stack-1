import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { IContact } from "../../interfaces/contacts";
import updateContactService from "../../services/contacts/updateContact.service";

const updateContactController = async (req: Request, res: Response) => {
  const contactData: IContact = req.body;
  const contactId = req.params.id;
  const response = await updateContactService(
    contactData,
    contactId,
    req.user.id
  );

  return res.status(201).json(instanceToPlain(response));
};

export default updateContactController;
