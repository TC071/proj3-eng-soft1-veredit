import fs from 'fs/promises';
import path from 'path';
import { IStorageProvider } from '../domain/IStorageProvider';

export class LocalStorageProvider implements IStorageProvider {
  constructor(private readonly basePath: string) {}

  public async save(filename: string, content: Buffer): Promise<string> {
    await fs.mkdir(this.basePath, { recursive: true });
    const fullPath = path.resolve(this.basePath, filename);
    await fs.writeFile(fullPath, content);
    return fullPath;
  }

  public async read(filePath: string): Promise<Buffer> {
    return fs.readFile(filePath);
  }

  public async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

