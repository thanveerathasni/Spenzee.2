export interface JwtPayload {
  userId: string;
  email: string;
}

export interface DecodedTokenPayload extends JwtPayload {
  iat?: number;
  exp?: number;
}

export interface GeneratedRefreshToken {
  token: string;
  expiresAt: Date;
}

export interface IJwtService {
  generateAccessToken(payload: JwtPayload): string;

  generateRefreshToken(payload: JwtPayload): GeneratedRefreshToken;

  verifyAccessToken(token: string): DecodedTokenPayload;

  verifyRefreshToken(token: string): DecodedTokenPayload;

  decodeToken(token: string): DecodedTokenPayload | null;
}
