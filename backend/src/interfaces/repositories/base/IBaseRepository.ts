export interface IBaseRepository<T> {
    create(entity: Partial<T>): Promise<T>;

    findById(id: string): Promise<T | null>;

    findOne(criteria: Record<string, unknown>): Promise<T | null>;

    updateById(id: string, entity: Partial<T>): Promise<T | null>;

    deleteById(id: string): Promise<boolean>;

    exists(criteria: Record<string, unknown>): Promise<boolean>;
}