import { type Model } from "mongoose";
import { type IBaseRepository } from "../../interfaces/repositories/base/IBaseRepository";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(entity: Partial<T>): Promise<T> {
    const document = await this.model.create(entity);
    return document;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }
  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }
  async updateById(id: string, entity: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, entity, {
      new: true,
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);

    return result !== null;
  }
  async exists(filter: Partial<T>): Promise<boolean> {
    const document = await this.model.exists(filter);

    return document !== null;
  }
}
