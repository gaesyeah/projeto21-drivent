import Joi from 'joi';
import { CreateTicket } from '@/services/tickets-service';

export const createTicketSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().required(),
});
