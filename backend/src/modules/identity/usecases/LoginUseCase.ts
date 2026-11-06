import { IUserRepository } from '../domain/IUserRepository';
import { IPasswordHasher } from '../domain/IPasswordHasher';
import { ITokenService } from '../domain/ITokenService';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * REQ 03: Logar no sistema (Autenticação com JWT)
 * Princípios SOLID:
 * - S (Single Responsibility): Foco exclusivo no fluxo de autenticação e credenciais.
 * - D (Dependency Inversion): Injeção de repositório, hasher e serviço de token.
 */
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(dto: LoginDTO): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas.');
    }

    const token = this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

