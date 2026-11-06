/**
 * Interface para cálculo e verificação de hash criptográfico de evidências (ADR 7).
 * Princípios SOLID:
 * - S (Single Responsibility): Foco exclusivo em integridade criptográfica.
 * - I (Interface Segregation): Contrato limpo com métodos essenciais de hash.
 */
export interface IIntegrityHasher {
  calculateHash(data: Buffer): string;
  verifyHash(data: Buffer, expectedHash: string): boolean;
}

