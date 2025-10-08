import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * RolesGuard
 *
 * This guard checks if the user has the required roles to access a resource.
 * Skips the guard if the request has no required roles defined by the @Roles() decorator.
 * If the user does not have the required roles, it will throw a ForbiddenException.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Constructor
   *
   * @param reflector The reflector service to get the required roles from the request handler or class
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Check if the user has the required roles to access a resource.
   * @param context The execution context
   * @returns True if the user has the required roles, false otherwise
   * @throws ForbiddenException if the user does not have the required roles
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest<Request>()['user'];

    if (!user || !requiredRoles?.includes(user.role)) {
      throw new ForbiddenException(
        'Access denied. You do not have permission to access this resource.',
      );
    }

    return true;
  }
}
