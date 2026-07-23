import { injectable } from "inversify";

import { BaseRepository } from "../base/BaseRepository";

import { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";

import {
  IPendingRegistration,
  PendingRegistrationModel,
} from "../../models/PendingRegistration.model";





@injectable()

export class PendingRegistrationRepository  extends BaseRepository<IPendingRegistration> implements IPendingRegistrationRepository{

constructor(  ){
    super(PendingRegistrationModel)
}

async findByEmail(email: string): Promise<IPendingRegistration | null> {
    return this.findOne({email})
}

async create(data: Pick<IPendingRegistration, "firstName" | "lastName" | "email" | "password" | "expiresAt">): Promise<IPendingRegistration> {
    

return super.create({data})

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
      { email },
      data,
    );
}
  async deleteByEmail(
    email: string,
  ): Promise<void> {
    await this.softDelete({
      email,
    });
  }

}


