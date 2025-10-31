import { api } from "../config";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { UpdateUser } from "../types/user/updateUser";
import type { User } from "../types/user/user";

const BASE_URL = "users";

/**
 * Fetches the current user's profile.
 *
 * @async
 * @function getProfile
 * @returns {Promise<Partial<User>>} A promise that resolves to the current user's profile.
 */
export const getProfile = async (): Promise<Partial<User>> => {
  const res = await api.get(`/${BASE_URL}/profile`);
  return res.data;
};

/**
 * Fetches all users from the API.
 *
 * @async
 * @param {PaginationQuery} query - The pagination query parameters.
 * @returns {Promise<PaginationResponse<User>>} The paginated data of users.
 */
export const getAllUsers = async (
  query?: PaginationQuery
): Promise<PaginationResponse<User>> => {
  const res = await api.get(`/${BASE_URL}`, { params: query });
  return res.data;
};

/**
 * Fetches a single user by ID.
 *
 * @async
 * @function getUserById
 * @param {number} id - The unique identifier of the user.
 * @returns {Promise<User>} A promise that resolves to the user data.
 */
export const getUserById = async (id: number): Promise<User> => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Updates an existing user by ID.
 *
 * @async
 * @function updateUser
 * @param {number} id - The unique identifier of the user to update.
 * @param {UpdateUser} updateUser - The updated user data.
 * @returns {Promise<User>} A promise that resolves to the updated user data.
 */
export const updateUser = async (
  id: number,
  updateUser: UpdateUser
): Promise<User> => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateUser);
  return res.data;
};

/**
 * Deletes a user by ID.
 *
 * @async
 * @function deleteUser
 * @param {number} id - The unique identifier of the user to delete.
 * @returns {Promise<any>} A promise that resolves when the user is deleted.
 */
export const deleteUser = async (id: number): Promise<any> => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};
