import { v4 as uuidv4 } from 'uuid';
import { EvidenceRecord, CaptureType } from '../domain/EvidenceRecord';
import { IRecordRepository } from '../domain/IRecordRepository';

export interface CreateRecordDTO {
  userId: string;
  targetUrl: string;
  captureType?: CaptureType;
}

/**
 * REQ 08: Iniciar registro de conteúdo
 * Princípios SOLID:
 * - S (Single Responsibility): Responsável por iniciar e persistir o registro em estado PENDING.
 * - D (Dependency Inversion): Depende da interface IRecordRepository.
 */
export class CreateRecordUseCase {
  constructor(private readonly recordRepository: IRecordRepository) {}

  public async execute(dto: CreateRecordDTO): Promise<EvidenceRecord> {
    if (!dto.targetUrl || !dto.targetUrl.startsWith('http')) {
      throw new Error('URL inválida. A URL deve iniciar com http:// ou https://');
    }

    const record = new EvidenceRecord({
      id: uuidv4(),
      userId: dto.userId,
      targetUrl: dto.targetUrl,
      status: 'PENDING',
      captureType: dto.captureType || 'SCREENSHOT',
    });

    await this.recordRepository.save(record);
    return record;
  }
}

