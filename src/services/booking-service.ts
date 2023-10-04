import { forbiddenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories";

async function getBooking(userId: number){
  const { Booking } =  await bookingRepository.getUserInfosById(userId);
  if (!Booking) throw notFoundError('You dont have a booking yet');
  return Booking;
};

async function postBooking(userId: number, roomId: number){
  const room = await bookingRepository.getRoomInfoById(roomId);
  if (!room) throw notFoundError('Room not found');
  if (room.capacity === room._count.Booking) throw forbiddenError('This room has already reached maximum capacity');

  const { Enrollment, Booking } = await bookingRepository.getUserInfosById(userId);
  if (Booking) throw forbiddenError('You already have a booking, you cannot have two');
  if (Enrollment.length === 0) throw forbiddenError('You dont have a enrollment yet');
  if (!Enrollment[0].Ticket) throw forbiddenError('You dont have a ticket yet');
  if (Enrollment[0].Ticket.status !== 'PAID') throw forbiddenError('You still need to pay your ticket');
  if (!Enrollment[0].Ticket.TicketType.includesHotel) throw forbiddenError('Your ticket doesnt include an hotel');
  if (Enrollment[0].Ticket.TicketType.isRemote) throw forbiddenError('Your ticket is remote');

  const { id } = await bookingRepository.postBooking(userId, roomId);
  return { bookingId: id };
};

async function putBooking(userId: number, roomId: number, bookingId: number){
  const room = await bookingRepository.getRoomInfoById(roomId);
  if (!room) throw notFoundError('Room not found');
  if (room.capacity === room._count.Booking) throw forbiddenError('This room has already reached maximum capacity');

  const { Booking } = await bookingRepository.getUserInfosById(userId);
  if (!Booking) throw forbiddenError('You dont have a booking yet');

  const { id } = await bookingRepository.putBooking(bookingId, roomId);
  return { bookingId: id };
};

export const bookingService = {
  getBooking,
  postBooking,
  putBooking
};