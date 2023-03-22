import AppDataSource from "../../data-source";
import User from "../../entities/users.entity";
import { IUser } from "../../interfaces/users";

const listUsersService = async (id: string): Promise<IUser> => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.find({
    where: { id },
    relations: { contacts: true },
  })[0];

  return user;
};

export default listUsersService;
