import { type IPendingRegistration } from "../../../models/PendingRegistration.model";


export interface IPendingRegistrationRepository {


  create(
    data: Pick<
      IPendingRegistration,
      "firstName" | "lastName" | "email" | "password" | "expiresAt"
    >
  ): Promise<IPendingRegistration>;


  findByEmail(
email:string,

  ):Promise<IPendingRegistration|null>

   updateByEmail(
    email: string,
    data: Partial<
      Pick<
        IPendingRegistration,
        "firstName" | "lastName" | "password" | "expiresAt"
      >
    >,
  ): Promise<IPendingRegistration | null>;

  deleteByEmail(
    email: string,
  ): Promise<boolean>;

}















