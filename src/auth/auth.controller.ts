import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

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
}
