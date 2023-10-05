import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createRoom(capacity: number = 10){
  const hotel = await prisma.hotel.create({
    data: {
      image: faker.internet.url(),
      name: faker.company.companyName()
    }
  });

  return await prisma.room.create({
    data: {
      hotelId: hotel.id,
      name: faker.company.companyName(),
      capacity
    },
    select: {
      id: true
    }
  });
}

export async function createBooking(userId: number, roomId: number){
  return await prisma.booking.create({
    data: {
      userId,
      roomId
    },
    select: {
      id: true,
      Room: true
    }
  });
};