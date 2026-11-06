import { User } from './User';

/**
 * Interface de repositório de usuários (Schema: identidade).
 * Aplicação dos princípios:
 * - D (Dependency Inversion): Casos de uso dependem desta abstração.
 * - I (Interface Segregation): Contrato exclusivo de persistência de identidade.
 */
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}

