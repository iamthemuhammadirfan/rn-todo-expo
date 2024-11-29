import { User } from "./auth";

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}
