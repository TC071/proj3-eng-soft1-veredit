import { Router } from 'express';
import { RecordsController } from './RecordsController';
import { createAuthMiddleware } from '../../../shared/infra/authMiddleware';
import { ITokenService } from '../../identity/domain/ITokenService';

export function createRecordsRoutes(
  controller: RecordsController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const auth = createAuthMiddleware(tokenService);

  router.use(auth);

  router.post('/', controller.create);
  router.post('/:recordId/capture', controller.capture);
  router.get('/', controller.listByUser);
  router.get('/:recordId', controller.getDetails);
  router.get('/:recordId/file', controller.getEvidenceFile);

  return router;
}

