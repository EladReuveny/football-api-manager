import { api } from "../config";
import type { CreatePlayer } from "../types/player/createPlayer";
import type { UpdatePlayer } from "../types/player/updatePlayer";

const BASE_URL = "players";

export const getAllPlayers = async () => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

export const getPlayerById = async (id: number) => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createPlayer = async (createPlayer: CreatePlayer) => {
  const res = await api.post(`/${BASE_URL}`, createPlayer);
  return res.data;
};

export const updatePlayer = async (id: number, updatePlayer: UpdatePlayer) => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updatePlayer);
  return res.data;
};

export const deletePlayer = async (id: number) => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createBulkPlayers = async (createPlayers: CreatePlayer[]) => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createPlayers);
  return res.data;
};
