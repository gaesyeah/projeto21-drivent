import { conflictError, notFoundError } from "@/errors";
import { ticketsRepository } from "@/repositories";
import { Ticket, TicketType } from "@prisma/client";

export type CreateTicket = Omit<Ticket, 'id' | 'enrollmentId' | 'status' |'createdAt' | 'updatedAt' >;
type TicketAndType = Ticket & { ticketType: TicketType };

async function createTicket (params: CreateTicket, token: string) {
  const ticketType = await ticketsRepository.findTicketsTypeOrThrow(params);
  if (!ticketType) throw notFoundError(`there isn't a ticketType with the id: ${params.ticketTypeId}`);

  const enrollmentArray = await ticketsRepository.findEnrollmentIdOrThrow(token); 
  if (enrollmentArray.length < 1) throw notFoundError('you need to register an enrollment first');

  const ticket = await ticketsRepository.findTicketOrThrow(enrollmentArray[0].id)
  if (ticket) throw conflictError('You already have an ticket related to your enrollment');

  const { id, ticketTypeId, enrollmentId, status, createdAt, updatedAt} = await ticketsRepository.createTicket(enrollmentArray[0].id, ticketType.id);
  
  return<TicketAndType>{ id, ticketTypeId, enrollmentId, status, ticketType, createdAt, updatedAt };
};

async function getTickets () {

};

async function getTicketsTypes () {

};

export const ticketsService = { createTicket, getTickets, getTicketsTypes };