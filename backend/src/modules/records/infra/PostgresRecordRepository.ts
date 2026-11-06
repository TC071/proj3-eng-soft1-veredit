import { Pool } from 'pg';
import { IRecordRepository } from '../domain/IRecordRepository';
import { EvidenceRecord } from '../domain/EvidenceRecord';

export class PostgresRecordRepository implements IRecordRepository {
  constructor(private readonly pool: Pool) {}

  public async save(record: EvidenceRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO registros.evidence_records (
        id, user_id, target_url, status, capture_type, file_path, sha256_hash, server_ip, captured_at, http_headers, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        record.id,
        record.userId,
        record.targetUrl,
        record.status,
        record.captureType,
        record.filePath || null,
        record.sha256Hash || null,
        record.serverIp || null,
        record.capturedAt || null,
        record.httpHeaders ? JSON.stringify(record.httpHeaders) : null,
        record.metadata ? JSON.stringify(record.metadata) : null,
        record.createdAt,
        record.updatedAt,
      ]
    );
  }

  public async update(record: EvidenceRecord): Promise<void> {
    await this.pool.query(
      `UPDATE registros.evidence_records SET
        status = $1,
        file_path = $2,
        sha256_hash = $3,
        server_ip = $4,
        captured_at = $5,
        http_headers = $6,
        metadata = $7,
        updated_at = $8
      WHERE id = $9`,
      [
        record.status,
        record.filePath || null,
        record.sha256Hash || null,
        record.serverIp || null,
        record.capturedAt || null,
        record.httpHeaders ? JSON.stringify(record.httpHeaders) : null,
        record.metadata ? JSON.stringify(record.metadata) : null,
        record.updatedAt,
        record.id,
      ]
    );
  }

  public async findById(id: string): Promise<EvidenceRecord | null> {
    const res = await this.pool.query(
      `SELECT id, user_id, target_url, status, capture_type, file_path, sha256_hash, server_ip, captured_at, http_headers, metadata, created_at, updated_at
       FROM registros.evidence_records WHERE id = $1`,
      [id]
    );

    if (res.rows.length === 0) return null;
    return this.mapToDomain(res.rows[0]);
  }

  public async findByUserId(userId: string): Promise<EvidenceRecord[]> {
    const res = await this.pool.query(
      `SELECT id, user_id, target_url, status, capture_type, file_path, sha256_hash, server_ip, captured_at, http_headers, metadata, created_at, updated_at
       FROM registros.evidence_records WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return res.rows.map((row) => this.mapToDomain(row));
  }

  private mapToDomain(row: any): EvidenceRecord {
    return new EvidenceRecord({
      id: row.id,
      userId: row.user_id,
      targetUrl: row.target_url,
      status: row.status,
      captureType: row.capture_type,
      filePath: row.file_path || undefined,
      sha256Hash: row.sha256_hash || undefined,
      serverIp: row.server_ip || undefined,
      capturedAt: row.captured_at ? new Date(row.captured_at) : undefined,
      httpHeaders: row.http_headers ? (typeof row.http_headers === 'string' ? JSON.parse(row.http_headers) : row.http_headers) : undefined,
      metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}

