import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  all() {
    return ['users'];
  }
}
