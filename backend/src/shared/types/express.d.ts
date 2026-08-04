import type { DecodedTokenPayload } from "../../interfaces/services/auth/IJwtService";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedTokenPayload;
    }
  }
}

export {};
