import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../usecases/RegisterUserUseCase';
import { LoginUseCase } from '../usecases/LoginUseCase';

export class IdentityController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role, cpf, oab } = req.body;
      const user = await this.registerUserUseCase.execute({
        name,
        email,
        password,
        role,
        cpf,
        oab,
      });

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute({ email, password });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  };
}

