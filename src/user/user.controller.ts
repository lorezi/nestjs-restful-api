import { UserService } from './user.service';
import { Controller, Get } from '@nestjs/common';
import { User } from './models/user.entity';

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
}
