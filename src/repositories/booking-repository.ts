import { prisma } from '@/config';

async function getUserInfosById(userId: number){
  return await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      Booking: {
        select: {
          id: true,
          Room: true
        }
      },
      Enrollment: {
        select: {
          Ticket: {
            select: {
              status: true,
              TicketType: {
                select: {
                  includesHotel: true,
                  isRemote: true
                }
              }
            }
          }
        }
      }
    }
  });
};

async function getRoomInfoById(roomId: number){
  return await prisma.room.findUnique({
    where: {
      id: roomId
    },
    select: {
      capacity: true,
      _count: {
        select: {
          Booking: true
        }
      }
    }
  });
};

async function postBooking(userId: number, roomId: number){
  return await prisma.booking.create({
    data: {
      userId,
      roomId
    },
    select: {
      id: true
    }
  });
};

async function getBooking(userId: number){

}

export const bookingRepository = {
  getUserInfosById,
  getRoomInfoById,
  postBooking,
  getBooking
};