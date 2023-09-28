import Joi from 'joi';
import { InputHotelBody } from '@/protocols';

export const hotelSchema = Joi.object<InputHotelBody>({
  hotelId: Joi.number().required(),
});