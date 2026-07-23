import { Model } from "mongoose";


export interface IBaseRepository<T> {
    create(
        data: Partial<T>
    ): Promise<T>;

    findById(
        id: string
    ): Promise<T | null>;

    findOne(
        filter: Record<string, unknown>
    ): Promise<T | null>;

    findAll(
        filter?: Record<string, unknown>
    ): Promise<T[]>;

    updateById(
        id: string,
        data: Partial<T>
    ): Promise<T | null>;

    updateOne(
        filter: Record<string, unknown>,
        data: Partial<T>
    ): Promise<T | null>;

    exists(
        filter: Record<string, unknown>
    ): Promise<boolean>;

    count(
        filter?: Record<string, unknown>
    ): Promise<number>;

    softDelete(
        filter: Record<string, unknown>
    ): Promise<boolean>;

    restore(
        filter: Record<string, unknown>
    ): Promise<boolean>;

    forceDelete(
        filter: Record<string, unknown>
    ): Promise<boolean>;
}