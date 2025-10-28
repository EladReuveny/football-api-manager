import type { CreateUser } from "../auth/createUser";

export type UpdateUser = Partial<CreateUser> & {
  newPassword?: string;
  confirmPassword?: string;
};
