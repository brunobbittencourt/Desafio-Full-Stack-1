export interface IUserData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

export interface IUserContext {
  createUser: (data: IUserData) => void;
  login: (data: ILogin) => void;
  profile: () => void;
  user: IUser;
  update: (data: IUserData) => void;
  deleteUser: () => void;
  logOut: () => void;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser extends IUserData {
  createdAt: Date;
  id: string;
}
