import * as yup from "yup";
import { SchemaOf } from "yup";
import { IUser } from "../interfaces/users";

export const CreateContactSerializer = yup.object().shape({
  fullName: yup.string().required(),
  email: yup.string().required(),
  phone: yup.string().required(),
});
export const UpdateContactSerializer = yup.object().shape({
  fullName: yup.string(),
  email: yup.string(),
  phone: yup.string(),
});
