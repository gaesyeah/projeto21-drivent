import { AuthenticatedRequest } from '@/middlewares';
import { CreateTicket, ticketsService } from '@/services';
import { Request, Response } from 'express';
import { CREATED, OK } from 'http-status';

export async function createTicket (req: AuthenticatedRequest, res: Response) {
  const body = req.body as CreateTicket;
  const result = await ticketsService.createTicket(body, req.userId);
  res.status(CREATED).send(result);
};

export async function getTickets (_req: AuthenticatedRequest, res: Response) {
  const result = await ticketsService.getTickets();
  res.status(OK).send(result);
};

export async function getTicketsTypes (_req: Request, res: Response) {
  const result = await ticketsService.getTicketsTypes();
  res.status(OK).send(result);
};