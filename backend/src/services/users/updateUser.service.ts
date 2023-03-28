import { hashSync } from "bcryptjs";
import AppDataSource from "../../data-source";
import User from "../../entities/users.entity";
import { IUser, IUserUpdate } from "../../interfaces/users";

const updateUserService = async (
  userData: IUserUpdate,
  userId: string
): Promise<IUser> => {
  const userRepository = AppDataSource.getRepository(User);

  if (userData.password) {
    userData.password = hashSync(userData.password, 10);
  }

  await userRepository.update(userId, {
    ...userData,
  });

  const [user] = await userRepository.findBy({ id: userId });

  return user;
};

export default updateUserService;
