import { IOtp } from "../../../models/Otp.models";

export interface IOtpRepository {
    create(
        data: Pick<IOtp, "email" | "code" | "expiresAt">,
    ): Promise<IOtp>;

    findByEmail(
        email: string,
    ): Promise<IOtp | null>;

    updateByEmail(
        email: string,
        data: Partial<Pick<IOtp, "code" | "expiresAt">>,
    ): Promise<IOtp | null>;

    incrementAttempts(
        email: string,
    ): Promise<IOtp | null>;

    deleteByEmail(
        email: string,
    ): Promise<boolean>;
}