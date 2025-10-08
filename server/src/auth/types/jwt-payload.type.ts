import { Role } from 'src/users/enums/role.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};
