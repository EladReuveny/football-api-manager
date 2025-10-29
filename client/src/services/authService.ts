import { api } from "../config";
import type { AuthResponse } from "../types/auth/authResponse";
import type { CreateUser } from "../types/auth/createUser";
import type { LoginUser } from "../types/auth/loginUser";
import type { RequestResetPassword } from "../types/auth/requestResetPassword";
import type { ResetPassword } from "../types/auth/resetPassword";

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

/**
 * Requests a password reset for the given email.
 * @async
 * @function requestPasswordReset
 * @param requestResetPasswordDto The request to reset password DTO.
 * @returns {Promise<void>} A success message confirming that a reset request was processed.
 */
export const requestPasswordReset = async (
  requestResetPassword: RequestResetPassword
): Promise<void> => {
  const res = await api.post(
    `/${BASE_URL}/request-password-reset`,
    requestResetPassword
  );
  return res.data;
};

/**
 * Resets a user's password.
 *
 * @async
 * @function resetPassword
 * @param resetPasswordDto The request to reset password DTO.
 * @returns {Promise<AuthResponse>} An authentication response indicating success.
 */
export const resetPassword = async (
  resetPassword: ResetPassword
): Promise<AuthResponse> => {
  const res = await api.patch(`/${BASE_URL}/reset-password`, resetPassword);
  return res.data;
};
