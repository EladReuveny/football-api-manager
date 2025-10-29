import {
  BadRequestException,
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
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './types/jwt-payload.type';

/**
 * AuthService
 * This service provides authentication functionality.
 */
@Injectable()
export class AuthService {
  private readonly adminSecret: string;

  /**
   * Constructor
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
   * @param createUserDto The create user DTO.
   * @returns The user object with the JWT access token.
   */
  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    await this.usersService.validateEmail(email);

    const hashedPassword =
      await this.usersService.generateHashedPassword(password);

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
   * @param loginUserDto The login user DTO.
   * @returns The user object with the JWT access token.
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUserCredentials(loginUserDto);

    return this.generateAuthResponse(user);
  }

  /**
   * Validates user credentials.
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

  /**
   * Requests a password reset for the given email.
   * @param requestResetPasswordDto The request to reset password DTO.
   * @returns A success message confirming that a reset request was processed.
   */
  async requestPasswordReset(requestResetPasswordDto: RequestResetPasswordDto) {
    await this.usersService.findByEmail(requestResetPasswordDto.email);
  }

  /**
   * Resets a user's password.
   *
   * @param resetPasswordDto The request to reset password DTO.
   * @returns An authentication response indicating success.
   * @throws BadRequestException if the provided passwords are invalid or do not match.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);

    const isPasswordUpdateIncomplete =
      (resetPasswordDto.newPassword && !resetPasswordDto.confirmPassword) ||
      (!resetPasswordDto.newPassword && resetPasswordDto.confirmPassword);
    if (isPasswordUpdateIncomplete) {
      throw new BadRequestException(
        'New password and confirm password must be provided together',
      );
    }
    if (resetPasswordDto.newPassword && resetPasswordDto.confirmPassword) {
      const isPasswordEqual =
        resetPasswordDto.newPassword === resetPasswordDto.confirmPassword;
      if (!isPasswordEqual) {
        throw new BadRequestException(
          'New password and confirm password must be the same',
        );
      }
      user.password = await this.usersService.generateHashedPassword(
        resetPasswordDto.newPassword,
      );
    }

    await this.usersService.save(user);

    return {
      status: 'SUCCESS',
      message: 'Password reset successfully',
    } as AuthResponseDto;
  }
}
