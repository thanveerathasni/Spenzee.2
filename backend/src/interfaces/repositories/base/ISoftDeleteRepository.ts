import { FilterQuery } from "mongoose";

import { IBaseRepository } from "./IBaseRepository";

export interface ISoftDeleteRepository<T>
    extends IBaseRepository<T> {
    softDelete(
        filter: FilterQuery<T>,
    ): Promise<boolean>;

    restore(
        filter: FilterQuery<T>,
    ): Promise<boolean>;
}