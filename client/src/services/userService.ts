import { api } from "../config";
import type { UpdateUser } from "../types/user/updateUser";

const BASE_URL = "users";

export const getAllUsers = async () => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

export const updateUser = async (id: number, updateUser: UpdateUser) => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateUser);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};
