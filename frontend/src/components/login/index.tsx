import { ILogin, IUserData } from "@/interfaces/user.interfaces";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UserContext } from "@/providers/user";
import { useContext } from "react";
import { StyledLoginForm } from "./style";

export function LoginForm() {
  const { login } = useContext(UserContext);
  const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({ resolver: yupResolver(schema) });
  return (
    <>
      <StyledLoginForm>
        <h2>Login</h2>
        <form onSubmit={handleSubmit(login)}>
          <input placeholder="E-Mail" {...register("email")}></input>
          {errors.email?.message && <span>{errors.email?.message}</span>}
          <input
            type="password"
            placeholder="Senha"
            {...register("password")}
          ></input>
          {errors.password?.message && <span>{errors.password?.message}</span>}
          <button type="submit">Login</button>
        </form>
      </StyledLoginForm>
    </>
  );
}
