import AppDataSource from "../../data-source";
import Contact from "../../entities/contact.entity";
import User from "../../entities/users.entity";
import AppError from "../../errors/appError";
import { IContact } from "../../interfaces/contacts";
import { IUser, IUserData, IUserRequest } from "../../interfaces/users";

const createContactService = async (
  contactData: IContact,
  userData: IUserData
) => {
  const userRepository = AppDataSource.getRepository(User);

  const [user] = await userRepository.findBy({ id: userData.id });

  const contactRepository = AppDataSource.getRepository(Contact);

  const contact = contactRepository.create({ ...contactData, user });

  await contactRepository.save(contact);

  return contact;
};

export default createContactService;
