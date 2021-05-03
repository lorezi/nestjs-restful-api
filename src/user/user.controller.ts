import { UpdateUserDto } from './models/updateUser.dto';
import { AuthGuard } from './../auth/auth.guard';
import { CreateUserDto } from './models/createUser.dto';
import { UserService } from './user.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   *
   * @returns list of users
   */
  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash('123456', 12);

    const data = await this.userService.createUser({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password,
    });
    delete data.password;
    return data;
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne({ id });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    await this.userService.update(id, body);
    return this.userService.findOne({ id });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    if (await this.userService.findOne({ id })) {
      await this.userService.delete(id);
      return {
        message: 'success',
      };
    }

    throw new HttpException(
      `user not found with id: ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }
}
