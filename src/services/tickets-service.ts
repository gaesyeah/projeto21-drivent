import { conflictError, notFoundError } from "@/errors";
import { ticketsRepository } from "@/repositories";
import { Ticket, TicketType } from "@prisma/client";

export type CreateTicket = Omit<Ticket, 'id' | 'enrollmentId' | 'status' |'createdAt' | 'updatedAt' >;
type TicketAndType = Ticket & { TicketType: TicketType };

async function createTicket (params: CreateTicket, userId: number) {
  const ticketType = await ticketsRepository.findTicketsTypeByIdOrThrow(params);
  if (!ticketType) throw notFoundError(`there isn't a ticketType with the id: ${params.ticketTypeId}`);

  const enrollment = await ticketsRepository.findEnrollmentIdByUserIdOrThrow(userId); 
  if (!enrollment) throw notFoundError('you need to register a enrollment first');

  const ticket = await ticketsRepository.findTicketByEnrollmentIdOrThrow(enrollment.id)
  if (ticket) throw conflictError('You already have a ticket related to your enrollment');

  const { id, ticketTypeId, enrollmentId, status, createdAt, updatedAt } = await ticketsRepository.createTicket(enrollment.id, ticketType.id);
  
  return<TicketAndType>{ id, ticketTypeId, enrollmentId, status, TicketType: ticketType, createdAt, updatedAt };
};

async function getTickets (userId: number) {
  const enrollment = await ticketsRepository.findEnrollmentIdByUserIdOrThrow(userId); 
  if (!enrollment) throw notFoundError('you need to register a enrollment first');

  const ticket = await ticketsRepository.findTicketByEnrollmentIdOrThrow(enrollment.id);
  if (!ticket) throw notFoundError("you don't have a ticket yet");

  return ticket;
}

async function getTicketsTypes () {
  return await ticketsRepository.getTicketsTypes();
};

export const ticketsService = { createTicket, getTickets, getTicketsTypes };