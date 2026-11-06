import { EvidenceRecord } from './EvidenceRecord';

/**
 * Interface para persistência de registros probatórios (Schema: registros).
 * - D (Dependency Inversion): O domínio depende desta abstração.
 */
export interface IRecordRepository {
  save(record: EvidenceRecord): Promise<void>;
  update(record: EvidenceRecord): Promise<void>;
  findById(id: string): Promise<EvidenceRecord | null>;
  findByUserId(userId: string): Promise<EvidenceRecord[]>;
}

