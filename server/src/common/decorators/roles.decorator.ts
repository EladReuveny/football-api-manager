import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/enums/role.enum';

/**
 * ROLES_KEY key
 * This key is used to identify roles in the application.
 */
export const ROLES_KEY = 'roles';

/**
 * Roles custome decorator
 * @param roles The roles to be applied to the request handler.
 * @returns A decorator that sets the ROLES_KEY metadata to the provided roles.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
