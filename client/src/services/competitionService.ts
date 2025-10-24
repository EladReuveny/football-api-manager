import { api } from "../config";
import type { CreateCompetition } from "../types/competition/createCompetition";
import type { UpdateCompetition } from "../types/competition/updateCompetition";

const BASE_URL = "competitions";

export const getAllCompetitions = async () => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

export const getCompetitionById = async (id: number) => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createCompetition = async (
  createCompetition: CreateCompetition
) => {
  const res = await api.post(`/${BASE_URL}`, createCompetition);
  return res.data;
};

export const updateCompetition = async (
  id: number,
  updateCompetition: UpdateCompetition
) => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateCompetition);
  return res.data;
};

export const deleteCompetition = async (id: number) => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createBulkCompetitions = async (
  createCompetitions: CreateCompetition[]
) => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createCompetitions);
  return res.data;
};

export const addClubToCompetition = async (
  competitionId: number,
  clubId: number
) => {
  const res = await api.post(`/${BASE_URL}/${competitionId}/clubs/${clubId}`);
  return res.data;
};

export const removeClubFromCompetition = async (
  competitionId: number,
  clubId: number
) => {
  const res = await api.delete(`/${BASE_URL}/${competitionId}/clubs/${clubId}`);
  return res.data;
};
