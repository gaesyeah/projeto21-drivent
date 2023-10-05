import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createBooking(userId: number, roomCapacity: number){
  const hotel = await prisma.hotel.create({
    data: {
      image: faker.internet.url(),
      name: faker.company.companyName()
    }
  });

  const room = await prisma.room.create({
    data: {
      hotelId: hotel.id,
      name: faker.company.companyName(),
      capacity: roomCapacity
    }
  });

  return await prisma.booking.create({
    data: {
      userId,
      roomId: room.id
    },
    select: {
      id: true,
      Room: true
    }
  });
};