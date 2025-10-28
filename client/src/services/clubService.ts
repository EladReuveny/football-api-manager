import { api } from "../config";
import type { Club } from "../types/club/club";
import type { CreateClub } from "../types/club/createClub";
import type { UpdateClub } from "../types/club/updateClub";

const BASE_URL = "clubs";

/**
 * Fetches all clubs from the API.
 *
 * @async
 * @function getAllClubs
 * @returns {Promise<Club[]>} A promise that resolves to a list of clubs.
 */
export const getAllClubs = async (): Promise<Club[]> => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

/**
 * Fetches a single club by its ID.
 *
 * @async
 * @function getClubById
 * @param {number} id - The unique identifier of the club.
 * @returns {Promise<Club>} A promise that resolves to the club data.
 */
export const getClubById = async (id: number): Promise<Club> => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates a new club.
 *
 * @async
 * @function createClub
 * @param {CreateClub} createClub - The data required to create a new club.
 * @returns {Promise<Club>} A promise that resolves to the created club data.
 */
export const createClub = async (createClub: CreateClub): Promise<Club> => {
  const res = await api.post(`/${BASE_URL}`, createClub);
  return res.data;
};

/**
 * Updates an existing club by its ID.
 *
 * @async
 * @function updateClub
 * @param {number} id - The unique identifier of the club to update.
 * @param {UpdateClub} updateClub - The data to update the club with.
 * @returns {Promise<Club>} A promise that resolves to the updated club data.
 */
export const updateClub = async (
  id: number,
  updateClub: UpdateClub
): Promise<Club> => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateClub);
  return res.data;
};

/**
 * Deletes a club by its ID.
 *
 * @async
 * @function deleteClub
 * @param {number} id - The unique identifier of the club to delete.
 * @returns {Promise<any>} A promise that resolves when the club is deleted.
 */
export const deleteClub = async (id: number): Promise<any> => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates multiple clubs in bulk.
 *
 * @async
 * @function createBulkClubs
 * @param {CreateClub[]} createClubs - An array of club creation objects.
 * @returns {Promise<Club[]>} A promise that resolves to the created clubs.
 */
export const createBulkClubs = async (
  createClubs: CreateClub[]
): Promise<Club[]> => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createClubs);
  return res.data;
};

/**
 * Adds a player to a club.
 *
 * @async
 * @function addPlayerToClub
 * @param {number} clubId - The unique identifier of the club.
 * @param {number} playerId - The unique identifier of the player.
 * @returns {Promise<Club>} A promise that resolves to the updated club data.
 */
export const addPlayerToClub = async (
  clubId: number,
  playerId: number
): Promise<Club> => {
  const res = await api.post(`/${BASE_URL}/${clubId}/players/${playerId}`);
  return res.data;
};

/**
 * Removes a player from a club.
 *
 * @async
 * @function removePlayerFromClub
 * @param {number} clubId - The unique identifier of the club.
 * @param {number} playerId - The unique identifier of the player.
 * @returns {Promise<Club>} A promise that resolves when the player is removed.
 */
export const removePlayerFromClub = async (
  clubId: number,
  playerId: number
): Promise<Club> => {
  const res = await api.delete(`/${BASE_URL}/${clubId}/players/${playerId}`);
  return res.data;
};
