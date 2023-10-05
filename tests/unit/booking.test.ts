import { bookingRepository } from "@/repositories";
import { bookingService } from "@/services";

describe("GET /booking", () => {
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

  it("Should throw return the booking when the user have one", async () => {
    const bookingData = {
      Booking: { id: 1, Room: { } }
    };
    jest.spyOn(bookingRepository, "getUserInfosById").mockImplementationOnce((): any => {
      return bookingData;
    });
    const promise = bookingService.getBooking(1);
    expect(promise).resolves.toEqual(bookingData.Booking);
  });
});