import { api } from "../config";
import type { Competition } from "../types/competition/competition";
import type { CreateCompetition } from "../types/competition/createCompetition";
import type { UpdateCompetition } from "../types/competition/updateCompetition";

const BASE_URL = "competitions";

/**
 * Fetches all competitions.
 *
 * @async
 * @function getAllCompetitions
 * @returns {Promise<Competition[]>} A promise that resolves to a list of all competitions.
 */
export const getAllCompetitions = async (): Promise<Competition[]> => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

/**
 * Fetches a single competition by its ID.
 *
 * @async
 * @function getCompetitionById
 * @param {number} id - The unique identifier of the competition.
 * @returns {Promise<Competition>} A promise that resolves to the competition data.
 */
export const getCompetitionById = async (id: number): Promise<Competition> => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates a new competition.
 *
 * @async
 * @function createCompetition
 * @param {CreateCompetition} createCompetition - The competition creation data.
 * @returns {Promise<Competition>} A promise that resolves to the created competition data.
 */
export const createCompetition = async (
  createCompetition: CreateCompetition
): Promise<Competition> => {
  const res = await api.post(`/${BASE_URL}`, createCompetition);
  return res.data;
};

/**
 * Updates an existing competition by ID.
 *
 * @async
 * @function updateCompetition
 * @param {number} id - The unique identifier of the competition to update.
 * @param {UpdateCompetition} updateCompetition - The updated competition data.
 * @returns {Promise<Competition>} A promise that resolves to the updated competition data.
 */
export const updateCompetition = async (
  id: number,
  updateCompetition: UpdateCompetition
): Promise<Competition> => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateCompetition);
  return res.data;
};

/**
 * Deletes a competition by ID.
 *
 * @async
 * @function deleteCompetition
 * @param {number} id - The unique identifier of the competition to delete.
 * @returns {Promise<any>} A promise that resolves when the competition is deleted.
 */
export const deleteCompetition = async (id: number): Promise<any> => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates multiple competitions in bulk.
 *
 * @async
 * @function createBulkCompetitions
 * @param {CreateCompetition[]} createCompetitions - An array of competition creation objects.
 * @returns {Promise<Competition[]>} A promise that resolves to the created competitions.
 */
export const createBulkCompetitions = async (
  createCompetitions: CreateCompetition[]
): Promise<Competition[]> => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createCompetitions);
  return res.data;
};

/**
 * Adds a club to a competition.
 *
 * @async
 * @function addClubToCompetition
 * @param {number} competitionId - The competition’s unique identifier.
 * @param {number} clubId - The club’s unique identifier.
 * @returns {Promise<Competition>} A promise that resolves to the updated competition data.
 */
export const addClubToCompetition = async (
  competitionId: number,
  clubId: number
): Promise<Competition> => {
  const res = await api.post(`/${BASE_URL}/${competitionId}/clubs/${clubId}`);
  return res.data;
};

/**
 * Removes a club from a competition.
 *
 * @async
 * @function removeClubFromCompetition
 * @param {number} competitionId - The competition’s unique identifier.
 * @param {number} clubId - The club’s unique identifier.
 * @returns {Promise<Competition>} A promise that resolves to the updated competition data or confirmation message.
 */
export const removeClubFromCompetition = async (
  competitionId: number,
  clubId: number
): Promise<Competition> => {
  const res = await api.delete(`/${BASE_URL}/${competitionId}/clubs/${clubId}`);
  return res.data;
};
