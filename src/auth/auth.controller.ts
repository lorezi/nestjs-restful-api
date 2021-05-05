import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response, Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Passwords do not match  😓');
    }

    const password = await bcrypt.hash(body.password, 12);

    const newUser = await this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password,
      role: {
        id: '39f06084-dd6b-49cc-9601-5edd4023c4ab', // default role for registered users ====> Admin
      },
    });
    delete newUser.password;
    return newUser;
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // filter user db with email

    const user = await this.userService.findOne({ email: body.email });

    if (!user) {
      // return not found
      throw new NotFoundException('user not found 🥵');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('invalid login credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    // using http only cookies
    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  /**
   *
   * @param request to get cookies
   * @returns authenticated user
   */
  @UseGuards(AuthGuard)
  @Get('me')
  async user(@Req() request: Request) {
    const id = await this.authService.signedUserID(request);

    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
}
