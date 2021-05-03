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

  /**
   *
   * @param data request data
   * @returns persisted data
   */
  async createUser(data): Promise<User> {
    return this.userRepository.save(data);
  }

  /**
   *
   * @param filter condition to select user
   * @returns a single user that matches the filter condition
   */
  async findOne(filter): Promise<User> {
    return this.userRepository.findOne(filter);
  }
}
