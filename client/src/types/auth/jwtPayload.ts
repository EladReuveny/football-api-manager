import type { Role } from "../user/role";

export type JwtPayload = {
  sub: number;

  email: string;

  role: Role;
};
