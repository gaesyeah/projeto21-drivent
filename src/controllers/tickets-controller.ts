import { Request, Response } from 'express';
import { CREATED } from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { CreateTicket, ticketsService } from '@/services';

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const body = req.body as CreateTicket;
  const result = await ticketsService.createTicket(body, req.userId);
  res.status(CREATED).send(result);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const result = await ticketsService.getTickets(req.userId);
  res.send(result);
}

export async function getTicketsTypes(_req: Request, res: Response) {
  const result = await ticketsService.getTicketsTypes();
  res.send(result);
}
