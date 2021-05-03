import { RoleService } from './role.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from './model/role.entity';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async all() {
    return this.roleService.all();
  }

  @Post()
  async create(@Body('name') name: string): Promise<Role> {
    return this.roleService.create(name);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Role> {
    const role = await this.roleService.findOne({ id });

    if (role) {
      return role;
    }

    throw new NotFoundException(`role with the id ${id} not found`);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Role> {
    if (await this.roleService.update(id, name)) {
      return this.roleService.findOne({ id });
    }

    throw new BadRequestException('role name required');
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    if (await this.roleService.findOne({ id })) {
      await this.roleService.delete(id);
      return {
        message: 'success',
      };
    }

    throw new HttpException(
      `role not found with id: ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }
}
