import { AuthGuard } from './../auth/auth.guard';
import { PermissionService } from './permission.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { HasPermission } from './has-permission.decorator';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  @HasPermission('view_permissions')
  async all() {
    return this.permissionService.all();
  }
}
