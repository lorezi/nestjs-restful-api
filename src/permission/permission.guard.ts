import { Role } from './../role/model/role.entity';
import { User } from './../user/models/user.entity';
import { RoleService } from './../role/role.service';
import { UserService } from './../user/user.service';
import { AuthService } from './../auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler());
    if (!access) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const id = await this.authService.signedUserID(request);

    const user: User = await this.userService.findOne({ id }, ['role']);

    if (user.role) {
      const role: Role = await this.roleService.findOne({ id: user.role.id }, [
        'permissions',
      ]);

      // if (request.method === 'GET') {
      //   return role.permissions.some(
      //     (permission) => permission.name === `view_${access}`,
      //   );
      // }

      return role.permissions.some((permission) => permission.name === access);
    }

    return false;
  }
}
