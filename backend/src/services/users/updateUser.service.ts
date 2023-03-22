import AppDataSource from "../../data-source";
import User from "../../entities/users.entity";
import { IUser, IUserUpdate } from "../../interfaces/users";
import { CreateUserSerializerWithoutPass } from "../../serializers/users.serializers";

const updateUserService = async (
  userData: IUserUpdate,
  userId: string
): Promise<IUser> => {
  const userRepository = AppDataSource.getRepository(User);

  const findUser = await userRepository.findOneBy({
    id: userId,
  });

  const userUpdated = userRepository.create({
    ...findUser,
    ...userData,
  });

  await userRepository.save(userUpdated);

  const userWithoutPass = await CreateUserSerializerWithoutPass.validate(
    userUpdated,
    {
      stripUnknown: true,
    }
  );

  return userWithoutPass;
};

export default updateUserService;
