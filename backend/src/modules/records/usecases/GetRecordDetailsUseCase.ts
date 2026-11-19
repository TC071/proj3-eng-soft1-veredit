import { IRecordRepository } from '../domain/IRecordRepository';
import { IStorageProvider } from '../domain/IStorageProvider';
import { IIntegrityHasher } from '../domain/IIntegrityHasher';
import { EvidenceRecord } from '../domain/EvidenceRecord';
import { RecordNotFoundError } from '../domain/RecordNotFoundError';

export interface RecordDetailsResult {
  record: EvidenceRecord;
  isIntegrityValid: boolean;
}

/**
 * REQ 13: Visualizar detalhes do registro com verificação de integridade
 * Princípios SOLID:
 * - S (Single Responsibility): Consulta de evidência probatória e validação de autenticidade.
 * - D (Dependency Inversion): Depende de abstrações de repositório, armazenamento e hasher.
 */
export class GetRecordDetailsUseCase {
  constructor(
    private readonly recordRepository: IRecordRepository,
    private readonly storageProvider: IStorageProvider,
    private readonly integrityHasher: IIntegrityHasher
  ) {}

  public async execute(recordId: string, userId: string): Promise<RecordDetailsResult> {
    const record = await this.recordRepository.findById(recordId);
    // ADR 3 (Segurança) + ADR 5: só o dono do registro (userId vindo do JWT) pode visualizá-lo
    if (!record || record.userId !== userId) {
      throw new RecordNotFoundError();
    }

    let isIntegrityValid = false;
    if (record.filePath && record.sha256Hash) {
      const fileExists = await this.storageProvider.exists(record.filePath);
      if (fileExists) {
        const fileBuffer = await this.storageProvider.read(record.filePath);
        isIntegrityValid = this.integrityHasher.verifyHash(fileBuffer, record.sha256Hash);
      }
    }

    return {
      record,
      isIntegrityValid,
    };
  }
}

