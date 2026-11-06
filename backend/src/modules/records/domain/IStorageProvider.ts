/**
 * Interface para custódia e armazenamento seguro de evidências (C13).
 * Princípios SOLID:
 * - L (Liskov Substitution): LocalStorageProvider ou S3StorageProvider podem ser usados indiferentemente.
 * - D (Dependency Inversion): Os casos de uso não conhecem o sistema de arquivos local ou nuvem.
 */
export interface IStorageProvider {
  save(filename: string, content: Buffer): Promise<string>;
  read(filePath: string): Promise<Buffer>;
  exists(filePath: string): Promise<boolean>;
}

