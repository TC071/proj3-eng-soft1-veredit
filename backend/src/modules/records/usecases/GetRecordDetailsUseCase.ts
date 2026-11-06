import { IRecordRepository } from '../domain/IRecordRepository';
import { IStorageProvider } from '../domain/IStorageProvider';
import { IIntegrityHasher } from '../domain/IIntegrityHasher';
import { EvidenceRecord } from '../domain/EvidenceRecord';

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

  public async execute(recordId: string): Promise<RecordDetailsResult> {
    const record = await this.recordRepository.findById(recordId);
    if (!record) {
      throw new Error('Registro não encontrado.');
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

