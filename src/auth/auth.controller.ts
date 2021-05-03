import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
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
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Passwords do not match  😓');
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    return this.userService.createUser({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() response: Response) {
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
  @Get('me')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verifyAsync(cookie);

    return this.userService.findOne({ id: data['id'] });
  }
}
