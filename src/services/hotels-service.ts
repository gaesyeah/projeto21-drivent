import { notFoundError, paymentRequiredError } from "@/errors";
import { hotelsRepository } from "@/repositories";

async function getHotels(userId: number) {
  const hotels = await hotelsRepository.getHotels();
  /* if (hotels.length === 0) throw notFoundError('sorry, but we dont have hotels right now'); */

  const enrollment = await hotelsRepository.getEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError('you dont have a enrollment yet');

  const ticket = await hotelsRepository.getTicketWithTypeByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError('you dont have a ticket yet');

  if (ticket.status === 'RESERVED') throw paymentRequiredError('you still need to pay the ticket');

  if (ticket.TicketType.isRemote) throw paymentRequiredError('your ticket is remote');

  if (!ticket.TicketType.includesHotel) throw paymentRequiredError('your ticket doesnt include a hotel');

  return hotels;
};

async function getHotelsById(userId: number, hotelId: number) {
  await hotelsService.getHotels(userId);

  const hotel = await hotelsRepository.getHotelsWithRoomsById(hotelId);
  if (!hotel) throw notFoundError('this hotel doesnt exist');

  return hotel;
};

export const hotelsService = {
  getHotels,
  getHotelsById,
};