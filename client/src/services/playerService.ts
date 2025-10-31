import { api } from "../config";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { CreatePlayer } from "../types/player/createPlayer";
import type { Player } from "../types/player/player";
import type { UpdatePlayer } from "../types/player/updatePlayer";

const BASE_URL = "players";

/**
 * Fetches all players from the API.
 *
 * @async
 * @param {PaginationQuery} query - The pagination query parameters.
 * @returns {Promise<PaginationResponse<Player>>} The paginated data of players.
 */
export const getAllPlayers = async (
  query?: PaginationQuery
): Promise<PaginationResponse<Player>> => {
  const res = await api.get(`/${BASE_URL}`, { params: query });
  return res.data;
};

/**
 * Fetches a single player by ID.
 *
 * @async
 * @function getPlayerById
 * @param {number} id - The unique identifier of the player.
 * @returns {Promise<Player>} A promise that resolves to the player data.
 */
export const getPlayerById = async (id: number): Promise<Player> => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates a new player.
 *
 * @async
 * @function createPlayer
 * @param {CreatePlayer} createPlayer - The player creation data.
 * @returns {Promise<Player>} A promise that resolves to the created player data.
 */
export const createPlayer = async (
  createPlayer: CreatePlayer
): Promise<Player> => {
  const res = await api.post(`/${BASE_URL}`, createPlayer);
  return res.data;
};

/**
 * Updates an existing player by ID.
 *
 * @async
 * @function updatePlayer
 * @param {number} id - The unique identifier of the player to update.
 * @param {UpdatePlayer} updatePlayer - The updated player data.
 * @returns {Promise<Player>} A promise that resolves to the updated player data.
 */
export const updatePlayer = async (
  id: number,
  updatePlayer: UpdatePlayer
): Promise<Player> => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updatePlayer);
  return res.data;
};

/**
 * Deletes a player by ID.
 *
 * @async
 * @function deletePlayer
 * @param {number} id - The unique identifier of the player to delete.
 * @returns {Promise<any>} A promise that resolves when the player is deleted.
 */
export const deletePlayer = async (id: number): Promise<any> => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates multiple players in bulk.
 *
 * @async
 * @function createBulkPlayers
 * @param {CreatePlayer[]} createPlayers - An array of player creation objects.
 * @returns {Promise<Player[]>} A promise that resolves to the created players.
 */
export const createBulkPlayers = async (
  createPlayers: CreatePlayer[]
): Promise<Player[]> => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createPlayers);
  return res.data;
};
