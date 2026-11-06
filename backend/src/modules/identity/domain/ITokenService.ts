export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Interface para geração e validação de tokens JWT (ADR 2 e ADR 5).
 * - D (Dependency Inversion): Isola a biblioteca jsonwebtoken do domínio.
 */
export interface ITokenService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
}

