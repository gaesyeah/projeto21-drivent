import { forbiddenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories";

async function getBooking(userId: number){

};

async function postBooking(userId: number, roomId: number){
  const { Enrollment } = await bookingRepository.getTicketInfos(userId);
  /* if (!Enrollment[0].Ticket) throw forbiddenError('You dont have a ticket yet'); */
  if (Enrollment[0].Ticket.status !== 'PAID') throw forbiddenError('You still need to pay your ticket');
  if (!Enrollment[0].Ticket.TicketType.includesHotel) throw forbiddenError('Your ticket doesnt include an Hotel');
  if (Enrollment[0].Ticket.TicketType.isRemote) throw forbiddenError('Your ticket is remote');

  const room = await bookingRepository.getRoomInfoById(roomId);
  if (!room) throw notFoundError('Room not found');
  if (room.capacity === room._count.Booking) throw forbiddenError('this Room has already reached maximum capacity');

  const { id } = await bookingRepository.postBooking(userId, roomId);
  return { bookingId: id };
};

async function putBooking(userId: number, roomId: number){

};

export const bookingService = {
  getBooking,
  postBooking,
  putBooking
};