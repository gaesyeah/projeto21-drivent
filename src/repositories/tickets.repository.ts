import { Prisma } from '@prisma/client';
import { prisma } from './../config/database';
import { CreateTicket } from "@/services";

type FindTicketType = CreateTicket

async function findTicketsTypeOrThrow (params: FindTicketType) {
  return prisma.ticketType.findUnique({
    where: {
      id: params.ticketTypeId
    }
  })
};

async function findTicketOrThrow (enrollmentId: number) {
  return await prisma.ticket.findUnique({
    where: {
      enrollmentId
    }
  })
}

type EnrollmentId = { id: number }

async function findEnrollmentIdOrThrow (token: string) {
  return prisma.$queryRaw<EnrollmentId[]>(
    Prisma.sql`
      SELECT "Enrollment".id
      FROM "Enrollment"
      WHERE "Enrollment"."userId" = (SELECT "Session"."userId" FROM "Session" WHERE token = ${token})
    `
  )
};

async function createTicket (enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
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

};

export const ticketsRepository = { createTicket, getTickets, getTicketsTypes, findTicketsTypeOrThrow, findEnrollmentIdOrThrow, findTicketOrThrow };