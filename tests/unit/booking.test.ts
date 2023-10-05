import { bookingRepository } from "@/repositories";
import { bookingService } from "@/services";

describe("GET /booking", () => {
  it("Should throw return the booking when the user have one", async () => {
    const bookingData: {
      Booking: {
        id: number,
        Room: { }
      }
    } = {
      Booking: { id: 1, Room: { } }
    };
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return bookingData;
    });
    const promise = bookingService.getBooking(1);
    expect(promise).resolves.toEqual(bookingData.Booking);
  });

  it("Should throw an error when the user doesnt have a booking", async () => {
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: null
      }
    });

    const promise = bookingService.getBooking(1);
    expect(promise).rejects.toEqual({ 
      name: 'NotFoundError', 
      message: 'You dont have a booking yet' 
    });
  });
});

describe("POST /booking", () => {
  it("Should throw an error when room doesnt exist", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return null;
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({ 
      name: 'NotFoundError', 
      message: 'Room not found' 
    });
  });

  it("Should throw an error when the room has already reached maximum capacity", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 1,
        _count: {
          Booking: 1
        }
      };
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This room has already reached maximum capacity'
    });
  });

  it("Should throw an error when the user already have a booking", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 10,
        _count: {
          Booking: 1
        }
      };
    });
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: { }
      };
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'You already have a booking, you cannot have two'
    });
  });

  it("Should throw an error when the user doesnt have a enrollment", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 10,
        _count: {
          Booking: 1
        }
      };
    });
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: null,
        Enrollment: []
      };
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'You dont have a enrollment yet'
    });
  });

  it("Should throw an error when the user doesnt have a ticket", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 10,
        _count: {
          Booking: 1
        }
      };
    });
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: null,
        Enrollment: [
          { Ticket: null }
        ]
      };
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({ 
      name: 'ForbiddenError', 
      message: 'You dont have a ticket yet' 
    });
  });

  it("Should throw an error when the user still need to pay the ticket", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 10,
        _count: {
          Booking: 1
        }
      };
    });
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: null,
        Enrollment: [
          { Ticket: { status: 'RESERVED' } }
        ]
      };
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'You still need to pay your ticket'
    });
  });

  it("Should throw an error when the ticket doesnt include an hotel", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 10,
        _count: {
          Booking: 1
        }
      };
    });
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: null,
        Enrollment: [
          { Ticket: 
            { 
              status: 'PAID',
              TicketType: {
                includesHotel: false,
                isRemote: false
              }
            } 
          }
        ]
      };
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Your ticket doesnt include an hotel'
    });
  });

  it("Should throw an error when the ticket is remote", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 10,
        _count: {
          Booking: 1
        }
      };
    });
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: null,
        Enrollment: [
          { Ticket: 
            { 
              status: 'PAID',
              TicketType: {
                includesHotel: true,
                isRemote: true
              }
            } 
          }
        ]
      };
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).rejects.toEqual({ 
      name: 'ForbiddenError', 
      message: 'Your ticket is remote' 
    });
  });

  it("Should return the booking when the user create one", async () => {
    jest.spyOn(bookingRepository, "getRoomInfoById").mockImplementationOnce((): any => {
      return {
        capacity: 10,
        _count: {
          Booking: 1
        }
      };
    });
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return {
        Booking: null,
        Enrollment: [
          { Ticket: 
            { 
              status: 'PAID',
              TicketType: {
                includesHotel: true,
                isRemote: false
              }
            } 
          }
        ]
      };
    });
    const id : number = 1;
    jest.spyOn(bookingRepository, "postBooking").mockImplementationOnce((): any => {
      return {
        id
      }
    });
    const promise = bookingService.postBooking(1, 1);
    expect(promise).resolves.toEqual({ bookingId: id });
  });
});