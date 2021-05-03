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

  async paginate(page = 1): Promise<any> {
    const take = 10;

    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: users.map((user) => {
        const { password, ...data } = user;
        return data;
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
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

  async update(id: string, data): Promise<any> {
    return this.userRepository.update(id, data);
  }

  async delete(id): Promise<any> {
    return this.userRepository.delete(id);
  }
}
