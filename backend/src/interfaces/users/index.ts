export interface IUserRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
}

export interface IUserUpdate {
  fullName?: string;
  email?: string;
  password?: string;
}

export interface IUserData {
  id: string;
  email: string;
}
