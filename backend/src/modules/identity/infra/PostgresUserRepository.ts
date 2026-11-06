import { Pool } from 'pg';
import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/User';

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  public async findByEmail(email: string): Promise<User | null> {
    const res = await this.pool.query(
      'SELECT id, name, email, password_hash, role, cpf, oab, created_at, updated_at FROM identidade.users WHERE email = $1',
      [email]
    );

    if (res.rows.length === 0) return null;
    return this.mapToDomain(res.rows[0]);
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    const res = await this.pool.query(
      'SELECT id, name, email, password_hash, role, cpf, oab, created_at, updated_at FROM identidade.users WHERE cpf = $1',
      [cpf]
    );

    if (res.rows.length === 0) return null;
    return this.mapToDomain(res.rows[0]);
  }

  public async findById(id: string): Promise<User | null> {
    const res = await this.pool.query(
      'SELECT id, name, email, password_hash, role, cpf, oab, created_at, updated_at FROM identidade.users WHERE id = $1',
      [id]
    );

    if (res.rows.length === 0) return null;
    return this.mapToDomain(res.rows[0]);
  }

  public async save(user: User): Promise<void> {
    await this.pool.query(
      `INSERT INTO identidade.users (id, name, email, password_hash, role, cpf, oab, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        user.id,
        user.name,
        user.email,
        user.passwordHash,
        user.role,
        user.cpf,
        user.oab || null,
        user.createdAt,
        user.updatedAt,
      ]
    );
  }

  private mapToDomain(row: any): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      cpf: row.cpf,
      oab: row.oab || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}

