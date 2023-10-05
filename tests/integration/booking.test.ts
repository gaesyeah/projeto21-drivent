import * as jwt from 'jsonwebtoken';
import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { createBooking } from '../factories/booking-factory';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('Should respond with 200 (OK) if everything is ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const booking = await createBooking(user.id, 10);
      const { status, body } = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        ...booking,
        Room:{
          ...booking.Room,
          createdAt: booking.Room.createdAt.toISOString(),
          updatedAt: booking.Room.updatedAt.toISOString()
        }
      });
    });

    it('Should responde with 404 (NOT_FOUND) if the user doesnt have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const { status } = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(status).toBe(httpStatus.NOT_FOUND);
    });
  });
});
