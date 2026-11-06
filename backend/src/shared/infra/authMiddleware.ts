import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../modules/identity/domain/ITokenService';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * C17: Validador de Token JWT
 * Middleware compartilhado que valida o JWT recebido no cabeçalho Authorization
 * sem necessidade de consultar o banco de dados a cada requisição (ADR 2 e 5).
 */
export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Token de autenticação não fornecido.' });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ error: 'Formato do cabeçalho de autenticação inválido.' });
      return;
    }

    const token = parts[1];
    const payload = tokenService.verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Token inválido ou expirado.' });
      return;
    }

    req.user = payload;
    next();
  };
}

