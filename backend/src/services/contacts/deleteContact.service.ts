import AppDataSource from "../../data-source";
import Contact from "../../entities/contact.entity";
import AppError from "../../errors/appError";
import { validate } from "uuid";

const deleteContactService = async (contactId: string, userId: string) => {
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

  await contactRepository.delete(contactId);
};

export default deleteContactService;
