import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';
import { IPasswordHasher } from '../domain/IPasswordHasher';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  cpf: string;
  oab?: string;
}

/**
 * REQ 01: Cadastrar Usuário
 * Princípio SOLID:
 * - S (Single Responsibility): Responsável exclusivamente pelas regras de negócio de cadastro.
 * - D (Dependency Inversion): Depende das abstrações IUserRepository e IPasswordHasher via construtor.
 */
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  public async execute(dto: RegisterUserDTO): Promise<User> {
    const emailExists = await this.userRepository.findByEmail(dto.email);
    if (emailExists) {
      throw new Error('E-mail já cadastrado no sistema.');
    }

    const cpfExists = await this.userRepository.findByCpf(dto.cpf);
    if (cpfExists) {
      throw new Error('CPF já cadastrado no sistema.');
    }

    if (dto.role === 'lawyer' && !dto.oab) {
      throw new Error('Número de OAB é obrigatório para cadastro de advogado.');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const newUser = new User({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      cpf: dto.cpf,
      oab: dto.oab,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }
}

