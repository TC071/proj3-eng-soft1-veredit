import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../domain/ITokenService';
import { env } from '../../../config/env';

export class JwtTokenService implements ITokenService {
  public generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as any,
    });
  }

  public verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }
}

