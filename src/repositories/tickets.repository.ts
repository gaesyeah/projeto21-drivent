import { Prisma } from '@prisma/client';
import { prisma } from './../config/database';
import { CreateTicket } from "@/services";

type FindTicketType = CreateTicket

async function findTicketsTypeOrThrow (params: FindTicketType) {
  return await prisma.ticketType.findUnique({
    where: {
      id: params.ticketTypeId
    }
  })
};

async function findTicketOrThrow (enrollmentId: number) {
  return await prisma.ticket.findUnique({
    where: {
      enrollmentId
    },
    select: {
      id: true
    }
  })
}

async function findEnrollmentIdOrThrow (userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId
    }
  })
};

async function createTicket (enrollmentId: number, ticketTypeId: number) {
  return await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId
    }
  })
};

async function getTickets () {

};

async function getTicketsTypes () {
  return await prisma.ticketType.findMany();
};

export const ticketsRepository = { createTicket, getTickets, getTicketsTypes, findTicketsTypeOrThrow, findEnrollmentIdOrThrow, findTicketOrThrow };