import AppDataSource from "../../data-source";
import Contact from "../../entities/contact.entity";
import AppError from "../../errors/appError";
import { IContact } from "../../interfaces/contacts";
import { validate } from "uuid";

const updateContactService = async (
  contactData: IContact,
  contactId: string,
  userId: string
) => {
  const contactRepository = AppDataSource.getRepository(Contact);

  if (!validate(contactId)) {
    throw new AppError("Invalid contact ID", 400);
  }

  const [contact] = await contactRepository.find({
    where: { id: contactId, user: { id: userId } },
  });

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  await contactRepository.update(contactId, { ...contactData });

  const [updatedContact] = await contactRepository.find({
    where: { id: contactId, user: { id: userId } },
  });

  return updatedContact;
};

export default updateContactService;
