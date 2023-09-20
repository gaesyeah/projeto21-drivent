import { CreateTicket, ticketsService } from '@/services';
import { Request, Response } from 'express';
import { CREATED } from 'http-status';

export async function createTicket (req: Request, res: Response) {
  console.log(res.locals);

  const body = req.body as CreateTicket;
  const token = req.headers.authorization.replace('Bearer ', '') as string;

  const result = await ticketsService.createTicket(body, token);
  res.status(CREATED).send(result);
};

export async function getTickets () {

};

export async function getTicketsTypes () {

};