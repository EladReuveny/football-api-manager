import { User } from 'src/users/entities/user.entity';

export class AuthResponseDto {
  status: 'SUCCESS' | 'ERROR';

  message: string;

  data?: {
    accessToken: string;
    user: Partial<User>;
  };
}
