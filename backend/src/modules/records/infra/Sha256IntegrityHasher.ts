import crypto from 'crypto';
import { IIntegrityHasher } from '../domain/IIntegrityHasher';

/**
 * Implementação do cálculo de Hash SHA-256 (ADR 7).
 * Garante a integridade e cadeia de custódia das provas digitais.
 */
export class Sha256IntegrityHasher implements IIntegrityHasher {
  public calculateHash(data: Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public verifyHash(data: Buffer, expectedHash: string): boolean {
    const calculated = this.calculateHash(data);
    return calculated.toLowerCase() === expectedHash.toLowerCase();
  }
}

