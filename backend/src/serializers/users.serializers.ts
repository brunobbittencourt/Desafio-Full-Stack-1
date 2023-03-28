import * as yup from "yup";

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

export const UpdateUserSerializer = yup.object().shape({
  fullName: yup.string(),
  email: yup.string(),
  password: yup.string(),
  phone: yup.string(),
});
