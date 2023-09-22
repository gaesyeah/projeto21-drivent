import { prisma } from '../config/database';
import { CreateTicket } from "@/services";

type FindTicketType = CreateTicket

async function findTicketsTypeByIdOrThrow (body: FindTicketType) {
  return await prisma.ticketType.findUnique({
    where: {
      id: body.ticketTypeId
    }
  })
};

async function findTicketByEnrollmentIdOrThrow (enrollmentId: number) {
  return await prisma.ticket.findUnique({
    where: {
      enrollmentId
    },
    include: {
      TicketType: true
    }
  })
}

async function findEnrollmentIdByUserIdOrThrow (userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId
    },
    select: {
      id: true
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

async function findTicketsByUserIdOrThrow (enrollmentId: number) {
  return await prisma.ticket.findUnique({
    where: {
      enrollmentId
    }
  })
};

async function getTicketsTypes () {
  return await prisma.ticketType.findMany();
};

export const ticketsRepository = { createTicket, getTicketsTypes, findTicketsTypeByIdOrThrow, findEnrollmentIdByUserIdOrThrow, findTicketByEnrollmentIdOrThrow, findTicketsByUserIdOrThrow };