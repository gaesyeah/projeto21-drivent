import { Router } from 'express';
import { getAddressFromCEP, getEnrollmentByUser, postCreateOrUpdateEnrollment } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createOrUpdateEnrollmentSchema } from '@/schemas';

const enrollmentsRouter = Router();

enrollmentsRouter
  .get('/cep', getAddressFromCEP)
  .all('/*', authenticateToken)
  .get('/', getEnrollmentByUser)
  .post('/', validateBody(createOrUpdateEnrollmentSchema), postCreateOrUpdateEnrollment);

export { enrollmentsRouter };
