import { api } from "../config";
import type { AuthResponse } from "../types/auth/authResponse";
import type { CreateUser } from "../types/auth/createUser";
import type { LoginUser } from "../types/auth/loginUser";

const BASE_URL = "auth";

/**
 * Registers a new user.
 *
 * @async
 * @function registerUser
 * @param createUser The create user DTO.
 * @returns {Promise<AuthResponse>} The registered user with the JWT access token.
 */
export const registerUser = async (
  createUser: CreateUser
): Promise<AuthResponse> => {
  const res = await api.post(`/${BASE_URL}/register`, createUser);
  return res.data;
};

/**
 * Logs in a user.
 *
 * @async
 * @function loginUser
 * @param loginUser The login user DTO.
 * @returns {Promise<AuthResponse>} The user object with the JWT access token.
 */
export const loginUser = async (
  loginUser: LoginUser
): Promise<AuthResponse> => {
  const res = await api.post(`/${BASE_URL}/login`, loginUser);
  return res.data;
};
