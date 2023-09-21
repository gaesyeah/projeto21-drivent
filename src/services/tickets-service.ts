import { conflictError, notFoundError } from "@/errors";
import { ticketsRepository } from "@/repositories";
import { Ticket, TicketType } from "@prisma/client";

export type CreateTicket = Omit<Ticket, 'id' | 'enrollmentId' | 'status' |'createdAt' | 'updatedAt' >;
type TicketAndType = Ticket & { ticketType: TicketType };

async function createTicket (params: CreateTicket, userId: number) {
  const ticketType = await ticketsRepository.findTicketsTypeOrThrow(params);
  if (!ticketType) throw notFoundError(`there isn't a ticketType with the id: ${params.ticketTypeId}`);

  const enrollment = await ticketsRepository.findEnrollmentIdOrThrow(userId); 
  if (!enrollment) throw notFoundError('you need to register a enrollment first');

  const ticket = await ticketsRepository.findTicketOrThrow(enrollment.id)
  if (ticket) throw conflictError('You already have a ticket related to your enrollment');

  const { id, ticketTypeId, enrollmentId, status, createdAt, updatedAt } = await ticketsRepository.createTicket(enrollment.id, ticketType.id);
  
  return<TicketAndType>{ id, ticketTypeId, enrollmentId, status, ticketType, createdAt, updatedAt };
};

async function getTickets () {

};

async function getTicketsTypes () {
  return await ticketsRepository.getTicketsTypes();
};

export const ticketsService = { createTicket, getTickets, getTicketsTypes };