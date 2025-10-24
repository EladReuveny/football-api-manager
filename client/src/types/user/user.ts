import type { Role } from "./role";

export type User = {
  id: number;

  email: string;

  password: string;

  role: Role;

  createdAt: Date;
};
