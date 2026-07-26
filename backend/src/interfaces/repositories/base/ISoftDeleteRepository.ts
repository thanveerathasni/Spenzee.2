export interface ISoftDeleteRepository {
    softDelete(
        filter: Record<string, unknown>,
    ): Promise<boolean>;

    restore(
        filter: Record<string, unknown>,
    ): Promise<boolean>;
}