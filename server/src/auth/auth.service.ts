import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly adminSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.adminSecret = this.configService.get<string>('ADMIN_SECRET_KEY') || '';
  }

  async register(createUserDto: CreateUserDto) {
    await this.usersService.validateUniqueness(createUserDto);

    const { email, password, secretKey } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = secretKey === this.adminSecret ? Role.ADMIN : Role.USER;
    const user = {
      email,
      password: hashedPassword,
      role,
    };

    const createdUser = await this.usersService.create(user);

    return this.usersService.toResponseDto(createdUser);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    let user: User | undefined;
    try {
      user = await this.usersService.findByEmail(email);
    } catch (err: unknown) {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException(
          'Invalid credentials. Email or password is incorrect',
        );
      }
      throw err;
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException(
        'Invalid credentials. Email or password is incorrect',
      );
    }

    // TODO: generate JWT Access Token
    return this.usersService.toResponseDto(user);
  }
}
