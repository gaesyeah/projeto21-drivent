import { CreateTicket, ticketsService } from '@/services';
import { Request, Response } from 'express';
import { CREATED, OK } from 'http-status';

export async function createTicket (req: Request, res: Response) {
  const body = req.body as CreateTicket;
  const token = req.headers.authorization.replace('Bearer ', '') as string;

  const result = await ticketsService.createTicket(body, token);
  res.status(CREATED).send(result);
};

export async function getTickets (_req: Request, res: Response) {
  const result = await ticketsService.getTickets();
  res.status(OK).send(result);
};

export async function getTicketsTypes (_req: Request, res: Response) {
  const result = await ticketsService.getTicketsTypes();
  res.status(OK).send(result);
};