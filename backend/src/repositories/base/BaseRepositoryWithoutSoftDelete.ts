import { injectable } from "inversify";
import { Model, type UpdateQuery } from "mongoose";

import type { IBaseRepository } from "../../interfaces/repositories/base/IBaseRepository";

@injectable()
export abstract class BaseRepositoryWithoutSoftDelete<T>
  implements IBaseRepository<T>
{
  constructor(
    protected readonly model: Model<T>,
  ) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findAll(
    filter: Record<string, unknown> = {},
  ): Promise<T[]> {
    return this.model.find(filter);
  }

  async updateById(
    id: string,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      update,
      { new: true },
    );
  }

  async updateOne(
    filter: Record<string, unknown>,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(
      filter,
      update,
      { new: true },
    );
  }

  async exists(
    filter: Record<string, unknown>,
  ): Promise<boolean> {
    return (await this.model.exists(filter)) !== null;
  }

  async count(
    filter: Record<string, unknown> = {},
  ): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async forceDelete(
    filter: Record<string, unknown>,
  ): Promise<boolean> {
    const result = await this.model.findOneAndDelete(filter);

    return result !== null;
  }
}