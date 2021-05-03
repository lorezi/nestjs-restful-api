import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './model/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async all(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async paginate(page = 1): Promise<any> {
    const take = 10;

    const [roles, total] = await this.roleRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: roles,
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
  async create(data): Promise<Role> {
    return this.roleRepository.save(data);
  }

  /**
   *
   * @param filter condition to select user
   * @returns a single user that matches the filter condition
   */
  async findOne(filter): Promise<Role> {
    return this.roleRepository.findOne(filter);
  }

  async update(id: string, data): Promise<any> {
    return this.roleRepository.update(id, data);
  }

  async delete(id): Promise<any> {
    return this.roleRepository.delete(id);
  }
}
