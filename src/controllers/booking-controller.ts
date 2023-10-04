import { InputBookingBody } from './../protocols';
import { Response } from 'express';
import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from '@/services';
import httpStatus from 'http-status';

export async function getBooking(req: AuthenticatedRequest, res: Response){
  const booking = await bookingService.getBooking(req.userId);
  res.status(httpStatus.OK).send(booking);
};

export async function postBooking(req: AuthenticatedRequest, res: Response){
  const body = req.body as InputBookingBody;
  const booking = await bookingService.postBooking(req.userId, body.roomId);
  res.status(httpStatus.OK).send(booking);
};

export async function putBooking(req: AuthenticatedRequest, res: Response){
  const body = req.body as InputBookingBody;
  const bookingId = parseInt(req.params.bookingId) as number;
  const booking = await bookingService.putBooking(req.userId, body.roomId, bookingId);
  res.status(httpStatus.OK).send(booking);
};