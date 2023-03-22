import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import AppDataSource from "../../data-source";
import User from "../../entities/users.entity";
import AppError from "../../errors/appError";
import { ILogin } from "../../interfaces/login";

const loginService = async (loginData: ILogin) => {
  const userRepository = AppDataSource.getRepository(User);

  const [findUser] = await userRepository.find({
    where: {
      email: loginData.email,
    },
  });

  if (!findUser) {
    throw new AppError("Invalid email or password", 403);
  }

  const password = findUser?.password;

  const matchPassword = await compare(loginData.password, password);

  if (!matchPassword) {
    throw new AppError("Invalid email or password", 403);
  }

  const token = sign(
    {
      email: findUser.email,
    },
    process.env.SECRET_KEY!,
    { expiresIn: "24h", subject: findUser?.id }
  );
  return token;
};

export default loginService;
