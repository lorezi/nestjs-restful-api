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
    return this.roleService.all(['permissions']);
  }

  @Post()
  async create(
    @Body('name') name: string,
    @Body('permissions') permission_ids: string[],
  ): Promise<Role> {
    return this.roleService.create({
      name,
      permissions: permission_ids.map((id) => ({ id })), // returns an array of objects [{id:"a"}, {id:"b"}]
    });
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Role> {
    const role = await this.roleService.findOne({ id }, ['permissions']);

    if (role) {
      return role;
    }

    throw new NotFoundException(`role with the id ${id} not found`);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('permissions') permission_ids: string[],
  ): Promise<Role> {
    const role = await this.roleService.findOne({ id });

    if (role) {
      if (name) {
        await this.roleService.update(id, {
          name,
        });
        role.name = name;
      }

      return await this.roleService.create({
        ...role,
        permissions: permission_ids.map((id) => ({ id })),
      });
    }

    throw new BadRequestException(`role with id ${id} not found`);
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
      `role with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
