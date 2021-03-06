import { ChangePassword } from './models/changePassword.dto';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { PaginatedResult } from './../common/paginated-result.interface';
import { UpdateUserDto } from './models/updateUser.dto';
import { AuthGuard } from './../auth/auth.guard';
import { CreateUserDto } from './models/createUser.dto';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  /**
   *
   * @returns list of users
   */
  @Get()
  @HasPermission('view_users')
  async getUsers(@Query('page') page = 1): Promise<PaginatedResult> {
    return await this.userService.paginate(page, ['role']);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash('123456', 12);

    const { role_id, ...data } = body;

    const newUser = await this.userService.create({
      ...data,
      password,
      role: { id: role_id },
    });
    delete newUser.password;
    return newUser;
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne({ id }, ['role']);
    if (user) {
      return user;
    }

    throw new NotFoundException(`user with the id:${id} not found`);
  }

  @Patch('profile')
  async updateProfile(
    @Req() request: Request,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    const id = await this.authService.signedUserID(request);

    await this.userService.update(id, body);
    return this.userService.findOne({ id });
  }

  @Patch('password')
  async updatePassword(
    @Req() request: Request,
    @Body() body: ChangePassword,
  ): Promise<User> {
    // if password does not match with confirm password throw an exception
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Passwords do not match! ????');
    }

    // get the signed in user
    const id = await this.authService.signedUserID(request);

    // hash password
    const hashed = await bcrypt.hash(body.password, 12);

    // update password
    await this.userService.update(id, {
      password: hashed,
    });

    // return signed user detail
    return this.userService.findOne({ id });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    const { role_id, ...data } = body;

    await this.userService.update(id, {
      ...data,
      role: {
        id: role_id,
      },
    });
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
