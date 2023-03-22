import * as yup from "yup";
import { SchemaOf } from "yup";
import { IUser } from "../interfaces/users";

export const CreateUserSerializer = yup.object().shape({
  fullName: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  phone: yup.string().required(),
});

export const LoginSerializer = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});
