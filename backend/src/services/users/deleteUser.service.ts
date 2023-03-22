import AppDataSource from "../../data-source";
import User from "../../entities/users.entity";

const deleteUserService = async (id: string): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.delete({
    id: id,
  });
};

export default deleteUserService;
