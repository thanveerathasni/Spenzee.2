import { injectable } from "inversify";

import { OtpModel } from "../../models/Otp.models";
import { BaseRepository } from "../base/BaseRepository";

import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IOtp } from "../../models/Otp.models";

@injectable()
export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository
{
  constructor() {
    super(OtpModel);
  }

  async create(
    data: Pick<IOtp, "email" | "code" | "expiresAt">,
  ): Promise<IOtp> {
    return super.create({
      ...data,
      email: data.email.trim().toLowerCase(),
    });
  }

  async findByEmail(
    email: string,
  ): Promise<IOtp | null> {
    return this.findOne({
      email: email.trim().toLowerCase(),
    });
  }

  async updateByEmail(
    email: string,
    data: Partial<
      Pick<IOtp, "code" | "expiresAt" | "attempts">
    >,
  ): Promise<IOtp | null> {
    return this.updateOne(
      {
        email: email.trim().toLowerCase(),
      },
      data,
    );
  }

  async incrementAttempts(
    email: string,
  ): Promise<IOtp | null> {
    return this.model.findOneAndUpdate(
      {
        email: email.trim().toLowerCase(),
        deletedAt: null,
      },
      {
        $inc: {
          attempts: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteByEmail(email: string): Promise<boolean> {
    return this.forceDelete({
      email: email.trim().toLowerCase(),
    });
  }
}