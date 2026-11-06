import { Router } from 'express';
import { IdentityController } from './IdentityController';

export function createIdentityRoutes(controller: IdentityController): Router {
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  return router;
}

