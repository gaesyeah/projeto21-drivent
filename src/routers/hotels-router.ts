import { getHotels, getHotelsById } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { hotelSchema } from '@/schemas/hotels-schemas';
import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter  
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/:hotelId', validateBody(hotelSchema), getHotelsById);

export { hotelsRouter };
