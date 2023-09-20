import { createTicket, getTickets, getTicketsTypes } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas/tickets-schema";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getTickets)
  .post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
