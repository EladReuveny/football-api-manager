import { SetMetadata } from '@nestjs/common';

/**
 * IS_PUBLIC_KEY key
 *
 * This key is used to identify public requests in the application.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public custom decorator to mark requests as public.
 *
 * @returns A decorator that sets the IS_PUBLIC_KEY metadata to true.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
