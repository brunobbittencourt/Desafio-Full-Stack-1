import AppDataSource from "../../data-source";
import User from "../../entities/users.entity";
import AppError from "../../errors/appError";
import { IUser, IUserRequest } from "../../interfaces/users";

const createUserService = async (userData: IUserRequest) => {
  const userRepository = AppDataSource.getRepository(User);

  const userExists = await userRepository.findOneBy({
    email: userData.email,
  });

  if (userExists) {
    throw new AppError("E-mail has already been registered", 409);
  }

  const user = userRepository.create(userData);
  await userRepository.save(user);

  return user;
};

export default createUserService;
