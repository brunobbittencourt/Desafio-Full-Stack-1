import AppDataSource from "../../data-source";
import Contact from "../../entities/contact.entity";
import { IContact } from "../../interfaces/contacts";

const listContactService = async (id: string): Promise<IContact[]> => {
  const contactRepository = AppDataSource.getRepository(Contact);

  const contact = await contactRepository.find({
    where: { user: { id } },
  });

  return contact;
};

export default listContactService;
