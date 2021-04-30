import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   *
   * @returns list of users
   */
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(data): Promise<User> {
    return this.userRepository.save(data);
  }
}
