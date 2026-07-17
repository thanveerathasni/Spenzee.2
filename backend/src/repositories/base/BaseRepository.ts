import { Model } from "mongoose";

import { IBaseRepository } from "../../interfaces/repositories/base/IBaseRepository"

export abstract class BaseRepository<T> implements IBaseRepository<T> {

    constructor(
        protected readonly model: Model<T>
    ) {}

    async create(entity: Partial<T>): Promise<T> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    async findOne(filter: Partial<T>): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    async updateById(
        id: string,
        entity: Partial<T>
    ): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    async deleteById(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async exists(filter: Partial<T>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}