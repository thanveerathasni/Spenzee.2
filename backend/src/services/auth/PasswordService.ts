import { injectable } from "inversify";
import bcrypt from "bcrypt";

import { IPasswordService } from "../../interfaces/services/auth/IPasswordService";

@injectable()
export class PasswordService
    implements IPasswordService
{
    private readonly saltRounds = 12;

    async hash(
        password: string,
    ): Promise<string> {
        return bcrypt.hash(
            password,
            this.saltRounds,
        );
    }

    async compare(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(
            plainPassword,
            hashedPassword,
        );
    }
}