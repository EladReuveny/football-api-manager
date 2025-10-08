import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './types/jwt-payload.type';

/**
 * AuthService
 *
 * This service provides authentication functionality.
 */
@Injectable()
export class AuthService {
  private readonly adminSecret: string;

  /**
   * Constructor
   *
   * @param configService The config service.
   * @param jwtService The JWT service.
   * @param usersService The users service.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.adminSecret = this.configService.get<string>('ADMIN_SECRET_KEY', '');
  }

  /**
   * Registers a new user.
   *
   * @param createUserDto The create user DTO.
   * @returns The user object with the JWT access token.
   */
  async register(createUserDto: CreateUserDto) {
    await this.usersService.validateUniqueness(createUserDto);

    const { email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = email === this.adminSecret ? Role.ADMIN : Role.USER;
    const user = {
      email,
      password: hashedPassword,
      role,
    };

    const createdUser = await this.usersService.create(user);

    return this.generateAuthResponse(createdUser);
  }

  /**
   * Logs in a user.
   *
   * @param loginUserDto The login user DTO.
   * @returns The user object with the JWT access token.
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUserCredentials(loginUserDto);

    return this.generateAuthResponse(user);
  }

  /**
   * Validates user credentials.
   *
   * @param loginUserDto The login user DTO.
   * @returns The user object if the credentials are valid, otherwise throws an UnauthorizedException.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  private async validateUserCredentials(loginUserDto: LoginUserDto) {
    let user: User | undefined;
    try {
      user = await this.usersService.findByEmail(loginUserDto.email);

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Invalid credentials. Email or password are incorrect',
        );
      }

      return user;
    } catch (err: unknown) {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException(
          'Invalid credentials. Email or password are incorrect',
        );
      }
      throw err;
    }
  }

  /**
   * Generates an access token for the given payload.
   *
   * @param payload The payload to sign.
   * @returns The signed access token.
   */
  private async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });
  }

  /**
   * Generates an authentication response for the given user.
   *
   * @param user The user object.
   * @returns The authentication response with the JWT access token.
   */
  private async generateAuthResponse(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.generateAccessToken(payload);
    const { password, ...result } = user;

    return {
      status: 'SUCCESS',
      message: 'User logged in successfully',
      data: {
        accessToken,
        user: result,
      },
    } as AuthResponseDto;
  }
}
