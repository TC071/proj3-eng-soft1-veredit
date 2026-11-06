import { IRecordRepository } from '../domain/IRecordRepository';
import { ICaptureStrategy } from '../domain/ICaptureStrategy';
import { IIntegrityHasher } from '../domain/IIntegrityHasher';
import { IStorageProvider } from '../domain/IStorageProvider';
import { EvidenceRecord } from '../domain/EvidenceRecord';

export interface CaptureEvidenceDTO {
  recordId: string;
}

/**
 * REQ 11: Concluir captura de tela e assegurar integridade
 * Princípios SOLID:
 * - S (Single Responsibility): Orquestra o ciclo de captura, hash e armazenamento probatório.
 * - O (Open/Closed): Funciona com qualquer implementação de ICaptureStrategy sem alterações.
 * - L (Liskov Substitution): Permite substituição de IStorageProvider sem impacto.
 * - D (Dependency Inversion): Todas as dependências externas são interfaces injetadas no construtor.
 */
export class CaptureEvidenceUseCase {
  constructor(
    private readonly recordRepository: IRecordRepository,
    private readonly captureStrategy: ICaptureStrategy,
    private readonly integrityHasher: IIntegrityHasher,
    private readonly storageProvider: IStorageProvider
  ) {}

  public async execute(dto: CaptureEvidenceDTO): Promise<EvidenceRecord> {
    const record = await this.recordRepository.findById(dto.recordId);
    if (!record) {
      throw new Error('Registro não encontrado.');
    }

    record.status = 'CAPTURING';
    await this.recordRepository.update(record);

    try {
      // 1. Executa a captura através da estratégia selecionada
      const captureResult = await this.captureStrategy.capture(record.targetUrl);

      // 2. Calcula o Hash SHA-256 da prova (ADR 7)
      const sha256 = this.integrityHasher.calculateHash(captureResult.buffer);

      // 3. Salva a evidência de forma imutável no storage
      const filename = `evidence_${record.id}_${Date.now()}.png`;
      const filePath = await this.storageProvider.save(filename, captureResult.buffer);

      // 4. Marca o registro como concluído com todos os metadados de auditoria
      record.markAsCompleted(
        filePath,
        sha256,
        captureResult.serverIp || '127.0.0.1',
        captureResult.capturedAt,
        captureResult.httpHeaders
      );

      await this.recordRepository.update(record);
      return record;
    } catch (err: any) {
      record.markAsFailed();
      await this.recordRepository.update(record);
      throw new Error(`Falha durante a captura da evidência: ${err.message}`);
    }
  }
}

