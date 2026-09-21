import { injectable } from "inversify";

import { PendingRegistrationModel } from "../../models/PendingRegistration.model";
import { BaseRepository } from "../base/BaseRepository";

import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import type { IPendingRegistration } from "../../models/PendingRegistration.model";

@injectable()
export class PendingRegistrationRepository
  extends BaseRepository<IPendingRegistration>
  implements IPendingRegistrationRepository
{
  constructor() {
    super(PendingRegistrationModel);
  }

  async findByEmail(
    email: string,
  ): Promise<IPendingRegistration | null> {
    return this.findOne({
      email: email.trim().toLowerCase(),
    });
  }

  async create(
    data: Pick<
      IPendingRegistration,
      | "firstName"
      | "lastName"
      | "email"
      | "password"
      | "expiresAt"
    >,
  ): Promise<IPendingRegistration> {
    return super.create({
      ...data,
      email: data.email.trim().toLowerCase(),
    });
  }

  async updateByEmail(
    email: string,
    data: Partial<
      Pick<
        IPendingRegistration,
        | "firstName"
        | "lastName"
        | "password"
        | "expiresAt"
      >
    >,
  ): Promise<IPendingRegistration | null> {
    return this.updateOne(
      {
        email: email.trim().toLowerCase(),
      },
      data,
    );
  }

  async deleteByEmail(email: string): Promise<boolean> {
    return this.forceDelete({
      email: email.trim().toLowerCase(),
    });
  }
}