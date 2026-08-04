export interface JwtPayload {
  userId: string;
  email: string;
}

export interface GeneratedRefreshToken {
  token: string;
  expiresAt: Date;
}

export interface IJwtService {
  generateAccessToken(payload: JwtPayload): string;

  generateRefreshToken(payload: JwtPayload): GeneratedRefreshToken;
}
