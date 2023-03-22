import { ILogin } from "../../../interfaces/login";
import { IProjectRequest } from "../../../interfaces/projects";
import { IUserRequest } from "../../../interfaces/users";

export const mockedAdmin: IUserRequest = {
  name: "Rafael Quadros",
  email: "rafaelquadros@mail.com",
  isAdm: true,
  password: "123456",
  github: "www.github.com",
  linkedin: "www.linkedin.com",
  profilePicture:
    "https://t.ctcdn.com.br/IVlt3nVuXYDVX4vyjzgborR84H0=/400x400/smart/i490793.jpeg",
};

export const mockedUser: IUserRequest = {
  name: "bruno",
  email: "bruno@mail.com",
  isAdm: false,
  password: "123456",
  github: "www.github.com",
  linkedin: "www.linkedin.com",
  profilePicture:
    "https://t.ctcdn.com.br/IVlt3nVuXYDVX4vyjzgborR84H0=/400x400/smart/i490793.jpeg",
};

export const mockedAdminLogin: ILogin = {
  email: "rafaelquadros@mail.com",
  password: "123456",
};

export const mockedUserLogin: ILogin = {
  email: "bruno@mail.com",
  password: "123456",
};

export const mockedUserToProjects: IProjectRequest = {
  title: "novo projeto",
  description: "projeto front-end",
  projectsPicture: "string",
  status: "pending",
};

export const mockedDeletedUser: IUserRequest = {
  name: "bruno",
  email: "deleted@mail.com",
  isAdm: false,
  password: "123456",
  github: "www.github.com",
  linkedin: "www.linkedin.com",
  profilePicture:
    "https://t.ctcdn.com.br/IVlt3nVuXYDVX4vyjzgborR84H0=/400x400/smart/i490793.jpeg",
};

export const mockedDeletedUserLogin: ILogin = {
  email: "deleted@mail.com",
  password: "123456",
};

export const mockedProjectId = {
  id: undefined,
};
