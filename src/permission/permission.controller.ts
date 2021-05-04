import { PermissionService } from './permission.service';
import { Controller, Get } from '@nestjs/common';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  async all() {
    return this.permissionService.all();
  }
}
