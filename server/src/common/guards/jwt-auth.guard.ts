import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JwtAuthGuard
 *
 * This guard checks if the request has a valid JWT token.
 * Skips the guard if the request has the @Public() decorator.
 * If the request has a valid JWT token, it will set the user object in the request.
 * If the request does not have a valid JWT token, it will throw an UnauthorizedException.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * Constructor
   *
   * @param jwtService The JWT service to verify the token
   * @param configService The config service to get the JWT secret key
   * @param reflector The reflector service to get the required roles from the request handler or class
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Check if the request has a valid JWT token.
   *
   * @param context The execution context.
   * @returns True if the request has a valid JWT token, false otherwise.
   * @throws UnauthorizedException if the request does not have a valid JWT token.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException(
        'Unauthorized. Invalid or missing token.',
      );
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      req['user'] = payload;
    } catch (err: unknown) {
      throw new UnauthorizedException(
        'Unauthorized. Invalid or missing token.',
      );
    }
    return true;
  }

  /**
   * Extract the JWT token from the Authorization header.
   *
   * @param req The request object.
   * @returns The JWT token if it exists, otherwise undefined.
   */
  private extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers['authorization']?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
