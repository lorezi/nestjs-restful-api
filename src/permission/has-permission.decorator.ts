import { SetMetadata } from '@nestjs/common';

/**
 *
 * @param access permissions
 * @returns list of permissions
 */
export const HasPermission = (access: string) => SetMetadata('access', access);
