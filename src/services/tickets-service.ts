import { Ticket } from "@prisma/client";

export type CreateTicket = Omit<Ticket, 'id' | 'enrollmentId' | 'status' |'createdAt' | 'updatedAt' >;

async function createTicket (params: CreateTicket) {
  
};

async function getTickets () {

};

async function getTicketsTypes () {

};

export const ticketsService = { createTicket, getTickets, getTicketsTypes };