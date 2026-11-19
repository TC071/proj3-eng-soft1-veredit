import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared/infra/authMiddleware';
import { CreateRecordUseCase } from '../usecases/CreateRecordUseCase';
import { CaptureEvidenceUseCase } from '../usecases/CaptureEvidenceUseCase';
import { GetRecordDetailsUseCase } from '../usecases/GetRecordDetailsUseCase';
import { IRecordRepository } from '../domain/IRecordRepository';
import { IStorageProvider } from '../domain/IStorageProvider';
import { RecordNotFoundError } from '../domain/RecordNotFoundError';

export class RecordsController {
  constructor(
    private readonly createRecordUseCase: CreateRecordUseCase,
    private readonly captureEvidenceUseCase: CaptureEvidenceUseCase,
    private readonly getRecordDetailsUseCase: GetRecordDetailsUseCase,
    private readonly recordRepository: IRecordRepository,
    private readonly storageProvider: IStorageProvider
  ) {}

  public create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { targetUrl, captureType } = req.body;

      const record = await this.createRecordUseCase.execute({
        userId,
        targetUrl,
        captureType,
      });

      res.status(201).json({
        message: 'Registro iniciado com sucesso.',
        record,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  public capture = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;
      const userId = req.user!.userId;
      const record = await this.captureEvidenceUseCase.execute({ recordId, userId });

      res.status(200).json({
        message: 'Captura realizada e integridade registrada com sucesso.',
        record,
      });
    } catch (err: any) {
      const status = err instanceof RecordNotFoundError ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  };

  public getDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;
      const userId = req.user!.userId;
      const result = await this.getRecordDetailsUseCase.execute(recordId, userId);

      res.status(200).json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  };

  public listByUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const records = await this.recordRepository.findByUserId(userId);
      res.status(200).json({ records });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  public getEvidenceFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;
      const userId = req.user!.userId;
      const record = await this.recordRepository.findById(recordId);
      // ADR 3 (Segurança) + ADR 5: só o dono do registro pode baixar a evidência
      if (!record || record.userId !== userId || !record.filePath) {
        res.status(404).json({ error: 'Arquivo de evidência não encontrado.' });
        return;
      }

      const fileBuffer = await this.storageProvider.read(record.filePath);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `inline; filename="evidence_${record.id}.png"`);
      res.send(fileBuffer);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao carregar arquivo de evidência.' });
    }
  };
}

