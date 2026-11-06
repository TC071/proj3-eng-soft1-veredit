import express from 'express';
import cors from 'cors';
import { pool } from './config/database';
import { env } from './config/env';

// Identity Module Dependencies
import { BcryptPasswordHasher } from './modules/identity/infra/BcryptPasswordHasher';
import { JwtTokenService } from './modules/identity/infra/JwtTokenService';
import { PostgresUserRepository } from './modules/identity/infra/PostgresUserRepository';
import { RegisterUserUseCase } from './modules/identity/usecases/RegisterUserUseCase';
import { LoginUseCase } from './modules/identity/usecases/LoginUseCase';
import { IdentityController } from './modules/identity/infra/IdentityController';
import { createIdentityRoutes } from './modules/identity/infra/identityRoutes';

// Records Module Dependencies
import { Sha256IntegrityHasher } from './modules/records/infra/Sha256IntegrityHasher';
import { LocalStorageProvider } from './modules/records/infra/LocalStorageProvider';
import { PuppeteerCaptureStrategy } from './modules/records/infra/PuppeteerCaptureStrategy';
import { PostgresRecordRepository } from './modules/records/infra/PostgresRecordRepository';
import { CreateRecordUseCase } from './modules/records/usecases/CreateRecordUseCase';
import { CaptureEvidenceUseCase } from './modules/records/usecases/CaptureEvidenceUseCase';
import { GetRecordDetailsUseCase } from './modules/records/usecases/GetRecordDetailsUseCase';
import { RecordsController } from './modules/records/infra/RecordsController';
import { createRecordsRoutes } from './modules/records/infra/recordsRoutes';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Veridit Backend', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // Injeção de Dependências — Identity Module
  // ==========================================
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();
  const userRepository = new PostgresUserRepository(pool);

  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
  const identityController = new IdentityController(registerUserUseCase, loginUseCase);

  app.use('/api/identity', createIdentityRoutes(identityController));

  // ==========================================
  // Injeção de Dependências — Records Module
  // ==========================================
  const integrityHasher = new Sha256IntegrityHasher();
  const storageProvider = new LocalStorageProvider(env.evidenceStoragePath);
  const captureStrategy = new PuppeteerCaptureStrategy();
  const recordRepository = new PostgresRecordRepository(pool);

  const createRecordUseCase = new CreateRecordUseCase(recordRepository);
  const captureEvidenceUseCase = new CaptureEvidenceUseCase(
    recordRepository,
    captureStrategy,
    integrityHasher,
    storageProvider
  );
  const getRecordDetailsUseCase = new GetRecordDetailsUseCase(
    recordRepository,
    storageProvider,
    integrityHasher
  );

  const recordsController = new RecordsController(
    createRecordUseCase,
    captureEvidenceUseCase,
    getRecordDetailsUseCase,
    recordRepository,
    storageProvider
  );

  app.use('/api/records', createRecordsRoutes(recordsController, tokenService));

  return app;
}

