import * as jwt from 'jsonwebtoken';
import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { createBooking, createRoom } from '../factories/booking-factory';

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
    it('Should respond with 404 (NOT_FOUND) if the user doesnt have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const { status } = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with 200 (OK) if everything is ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom();
      const booking = await createBooking(user.id, room.id);
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
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('Should respond with 404 (NOT_FOUND) when the room doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with 403 (FORBIDDEN) if the room already reached max capacity', async () => {
      const user = await createUser();
      await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom(1);
      await createBooking(user.id, room.id);

      const user2 = await createUser();
      const token2 = await generateValidToken(user2);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      await createTicket(enrollment2.id, ticketType.id, 'PAID');

      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token2}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 403 (FORBIDDEN) if the user already have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom();
      await createBooking(user.id, room.id);
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 403 (FORBIDDEN) if the user doesnt have a enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const room = await createRoom();
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 403 (FORBIDDEN) if the user doesnt have a ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const room = await createRoom();
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 403 (FORBIDDEN) if the user still need to pay the ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'RESERVED');
      const room = await createRoom();
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 403 (FORBIDDEN) if the ticket doesnt include an hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom();
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 403 (FORBIDDEN) if the ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom();
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 200 (OK) if everything is ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom();
      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.OK);
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('Should respond with 404 (NOT_FOUND) when the room doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom();
      const booking = await createBooking(user.id, room.id);
      const { status } = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id + 1 });
      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with 403 (FORBIDDEN) if the room already reached max capacity', async () => {
      const user = await createUser();
      await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom(1);
      await createBooking(user.id, room.id);

      const user2 = await createUser();
      const token2 = await generateValidToken(user2);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      await createTicket(enrollment2.id, ticketType.id, 'PAID');
      const room2 = await createRoom();
      const booking2 = await createBooking(user2.id, room2.id);

      const { status } = await server.put(`/booking/${booking2.id}`).set('Authorization', `Bearer ${token2}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 403 (FORBIDDEN) if the user doesnt have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const room = await createRoom();
      const { status } = await server.put(`/booking/${1}`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with 200 (OK) if everything is ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const room = await createRoom();
      const room2 = await createRoom();
      const booking = await createBooking(user.id, room.id);
      const { status } = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: room2.id });
      expect(status).toBe(httpStatus.OK);
    });
  });
});
