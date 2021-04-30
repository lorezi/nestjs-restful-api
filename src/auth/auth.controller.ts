import { UserService } from './../user/user.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body) {
    return this.userService.createUser(body);
  }
}
