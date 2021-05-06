import { PermissionService } from './permission.service';
import { Controller, Get } from '@nestjs/common';
import { HasPermission } from './has-permission.decorator';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  @HasPermission('view_permissions')
  async all() {
    return this.permissionService.all();
  }
}
