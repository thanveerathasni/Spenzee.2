import type { UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
    create(
        data: Partial<T>,
    ): Promise<T>;

    findById(
        id: string,
    ): Promise<T | null>;

    findOne(
        filter: Record<string, unknown>,
    ): Promise<T | null>;

    findAll(
        filter?: Record<string, unknown>,
    ): Promise<T[]>;

    updateById(
        id: string,
        update: UpdateQuery<T>,
    ): Promise<T | null>;

    updateOne(
        filter: Record<string, unknown>,
        update: UpdateQuery<T>,
    ): Promise<T | null>;

    exists(
        filter: Record<string, unknown>,
    ): Promise<boolean>;

    count(
        filter?: Record<string, unknown>,
    ): Promise<number>;

    forceDelete(
        filter: Record<string, unknown>,
    ): Promise<boolean>;
}