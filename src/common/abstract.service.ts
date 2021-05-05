import { PaginatedResult } from './paginated-result.interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}

  /**
   *
   * @returns list of users
   */
  async all(relations = []): Promise<any[]> {
    return await this.repository.find({ relations });
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 10;

    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
    });

    return {
      data,
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
  async create(data: any): Promise<any> {
    return this.repository.save(data);
  }

  /**
   *
   * @param filter condition to select user
   * @returns a single user that matches the filter condition
   */
  async findOne(filter: any, relations = []): Promise<any> {
    return this.repository.findOne(filter, { relations });
  }

  async update(id: string, data: any): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<any> {
    return this.repository.delete(id);
  }
}
