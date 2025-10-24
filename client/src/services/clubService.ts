import { api } from "../config";
import type { CreateClub } from "../types/club/createClub";
import type { UpdateClub } from "../types/club/updateClub";

const BASE_URL = "clubs";

export const getAllClubs = async () => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

export const getClubById = async (id: number) => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createClub = async (createClub: CreateClub) => {
  const res = await api.post(`/${BASE_URL}`, createClub);
  return res.data;
};

export const updateClub = async (id: number, updateClub: UpdateClub) => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateClub);
  return res.data;
};

export const deleteClub = async (id: number) => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createBulkClubs = async (createClubs: CreateClub[]) => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createClubs);
  return res.data;
};

export const addPlayerToClub = async (clubId: number, playerId: number) => {
  const res = await api.post(`/${BASE_URL}/${clubId}/players/${playerId}`);
  return res.data;
};

export const removePlayerFromClub = async (
  clubId: number,
  playerId: number
) => {
  const res = await api.delete(`/${BASE_URL}/${clubId}/players/${playerId}`);
  return res.data;
};
