import { injectable } from "inversify";
import { Model } from "mongoose";

import { IBaseRepository } from "../../interfaces/repositories/base/IBaseRepository";

@injectable()
export abstract class BaseRepository<T extends { deletedAt?: Date | null }>
    implements IBaseRepository<T>
{
    constructor(
        protected readonly model: Model<T>
    ) {}

    protected buildFilter(
        filter: Record<string, unknown> = {}
    ) {
        return {
            ...filter,
            deletedAt: null,
        };
    }

    async create(
        data: Partial<T>
    ): Promise<T> {
        return this.model.create(data);
    }

    async findById(
        id: string
    ): Promise<T | null> {
        return this.model
            .findOne({
                _id: id,
                deletedAt: null,
            })
            .exec();
    }

    async findOne(
        filter: Record<string, unknown>
    ): Promise<T | null> {
        return this.model
            .findOne(this.buildFilter(filter))
            .exec();
    }

    async findAll(
        filter: Record<string, unknown> = {}
    ): Promise<T[]> {
        return this.model
            .find(this.buildFilter(filter))
            .exec();
    }

    async updateById(
        id: string,
        data: Partial<T>
    ): Promise<T | null> {
        return this.model.findOneAndUpdate(
            {
                _id: id,
                deletedAt: null,
            },
            data,
            {
                new: true,
            }
        );
    }

    async updateOne(
        filter: Record<string, unknown>,
        data: Partial<T>
    ): Promise<T | null> {
        return this.model.findOneAndUpdate(
            this.buildFilter(filter),
            data,
            {
                new: true,
            }
        );
    }

    async exists(
        filter: Record<string, unknown>
    ): Promise<boolean> {
        return (
            await this.model.exists(
                this.buildFilter(filter)
            )
        ) !== null;
    }

    async count(
        filter: Record<string, unknown> = {}
    ): Promise<number> {
        return this.model.countDocuments(
            this.buildFilter(filter)
        );
    }

    async softDelete(
        id: string
    ): Promise<boolean> {
        const result =
            await this.model.findOneAndUpdate(
                {
                    _id: id,
                    deletedAt: null,
                },
                {
                    deletedAt: new Date(),
                },
                {
                    new: true,
                }
            );

        return result !== null;
    }

    async restore(
        id: string
    ): Promise<boolean> {
        const result =
            await this.model.findByIdAndUpdate(
                id,
                {
                    deletedAt: null,
                }
            );

        return result !== null;
    }

    async forceDelete(
        id: string
    ): Promise<boolean> {
        const result =
            await this.model.findByIdAndDelete(id);

        return result !== null;
    }
}