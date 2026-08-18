import { BaseRepository } from "./BaseRepository";

import type { Model } from "mongoose";


export abstract class SoftDeleteRepository<
  T extends { deletedAt?: Date | null },
> extends BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {
    super(model);
  }

  protected override buildFilter(filter: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      ...filter,
      deletedAt: null,
    };
  }

  override async findById(id: string): Promise<T | null> {
    const document = await super.findById(id);

    if (!document || document.deletedAt !== null) {
      return null;
    }

    return document;
  }

  override async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return super.findOne(this.buildFilter(filter));
  }

  override async findAll(filter: Record<string, unknown> = {}): Promise<T[]> {
    return super.findAll(this.buildFilter(filter));
  }

  override async updateOne(filter: Record<string, unknown>, data: Partial<T>): Promise<T | null> {
    return super.updateOne(this.buildFilter(filter), data);
  }

  override async exists(filter: Record<string, unknown>): Promise<boolean> {
    return super.exists(this.buildFilter(filter));
  }

  override async count(filter: Record<string, unknown> = {}): Promise<number> {
    return super.count(this.buildFilter(filter));
  }

  override async softDelete(filter: Record<string, unknown>): Promise<boolean> {
    return super.softDelete(filter);
  }

  override async restore(filter: Record<string, unknown>): Promise<boolean> {
    return super.restore(filter);
  }
}
