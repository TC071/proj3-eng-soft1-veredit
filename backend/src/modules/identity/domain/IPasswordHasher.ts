/**
 * Interface para hashing e verificação de senhas.
 * Aplicação dos princípios:
 * - D (Dependency Inversion): O domínio não conhece o algoritmo (bcrypt, argon2).
 * - S (Single Responsibility): Responsabilidade única de hash criptográfico.
 */
export interface IPasswordHasher {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hashed: string): Promise<boolean>;
}

