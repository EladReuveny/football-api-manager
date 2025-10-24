import { api } from "../config";
import type { CreateUser } from "../types/auth/createUser";
import type { LoginUser } from "../types/auth/loginUser";

const BASE_URL = "auth";

export const registerUser = async (createUser: CreateUser) => {
  const res = await api.post(`/${BASE_URL}/register`, createUser);
  return res.data;
};

export const loginUser = async (loginUser: LoginUser) => {
  const res = await api.post(`/${BASE_URL}/login`, loginUser);
  return res.data;
};
