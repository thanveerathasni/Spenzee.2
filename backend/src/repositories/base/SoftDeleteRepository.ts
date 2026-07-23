import {
    FilterQuery,
    Model,
} from "mongoose";

import { BaseRepository } from "./BaseRepository";

export abstract class SoftDeleteRepository<
    T extends { deletedAt: Date | null },
> extends BaseRepository<T> {
    constructor(protected readonly model: Model<T>) {
        super(model);
    }

    protected buildFilter(
        filter: FilterQuery<T> = {},
    ): FilterQuery<T> {
        return {
            ...filter,
            deletedAt: null,
        };
    }

    override async findById(
        id: string,
    ): Promise<T | null> {
        const document = await super.findById(id);

        if (!document || document.deletedAt !== null) {
            return null;
        }

        return document;
    }

    override async findOne(
        filter: FilterQuery<T>,
    ): Promise<T | null> {
        return super.findOne(this.buildFilter(filter));
    }

    override async findAll(
        filter: FilterQuery<T> = {},
    ): Promise<T[]> {
        return super.findAll(this.buildFilter(filter));
    }

    override async updateOne(
        filter: FilterQuery<T>,
        data: Partial<T>,
    ): Promise<T | null> {
        return super.updateOne(
            this.buildFilter(filter),
            data,
        );
    }

    override async exists(
        filter: FilterQuery<T>,
    ): Promise<boolean> {
        return super.exists(this.buildFilter(filter));
    }

    override async count(
        filter: FilterQuery<T> = {},
    ): Promise<number> {
        return super.count(this.buildFilter(filter));
    }

    async softDelete(
        filter: FilterQuery<T>,
    ): Promise<boolean> {
        const result = await this.model.findOneAndUpdate(
            this.buildFilter(filter),
            {
                deletedAt: new Date(),
            },
            {
                new: true,
            },
        );

        return !!result;
    }

    async restore(
        filter: FilterQuery<T>,
    ): Promise<boolean> {
        const result = await this.model.findOneAndUpdate(
            {
                ...filter,
                deletedAt: {
                    $ne: null,
                },
            },
            {
                deletedAt: null,
            },
            {
                new: true,
            },
        );

        return !!result;
    }
}