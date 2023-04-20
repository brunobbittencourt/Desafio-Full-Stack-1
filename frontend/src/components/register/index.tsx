import { IUserData } from "@/interfaces/user.interfaces";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UserContext } from "@/providers/user";
import { useContext } from "react";
import { StyledRegisterForm } from "./style";

export function RegisterForm() {
  const { createUser } = useContext(UserContext);
  const schema = yup.object().shape({
    email: yup.string().required().email(),
    fullName: yup.string().required(),
    phone: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("password")]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserData>({ resolver: yupResolver(schema) });
  return (
    <>
      <StyledRegisterForm>
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit(createUser)}>
          <input placeholder="Nome Completo" {...register("fullName")}></input>
          {errors.fullName?.message && <span>{errors.fullName?.message}</span>}
          <input placeholder="E-Mail" {...register("email")}></input>
          {errors.email?.message && <span>{errors.email?.message}</span>}
          <input
            type="password"
            placeholder="Senha"
            {...register("password")}
          ></input>
          {errors.password?.message && <span>{errors.password?.message}</span>}
          <input
            type="password"
            placeholder="Confirme Sua Senha"
            {...register("confirmPassword")}
          ></input>
          {errors.confirmPassword?.message && (
            <span>{errors.confirmPassword?.message}</span>
          )}

          <input placeholder="Telefone" {...register("phone")}></input>
          {errors.phone?.message && <span>{errors.phone?.message}</span>}

          <button type="submit">Cadastrar</button>
        </form>
      </StyledRegisterForm>
    </>
  );
}
