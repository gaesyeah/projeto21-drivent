import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';
import { createUser } from '../factories';

const server = supertest(app);

beforeAll(async () => {
  await init();
});
/* beforeEach(async () => {
  cleanDb();
}); */

describe('GET /hotels', () => {
  it('Should respond with 404 (not found) if the user doesnt have an enrollment, ticket or hotel', async () => {
    const { email, password } = await createUser();

  });
  it('Should respond with 402 (payment required) if the ticket was not paid (status: RESERVED), if the TicketType is remote (isRemote: true) or doesnt have an hotel (includesHotel: false)', async () => {

  });
  it('Should respond with 200 (OK) if everything is ok', async () => {

  });
});

describe('GET /hotels/:hotelId', () => {
  it('Should respond with 404 (not found) if the user doesnt have an enrollment, ticket or hotel', async () => {

  });
  it('Should respond with 402 (payment required) if the ticket was not paid (status: RESERVED), if the TicketType is remote (isRemote: true) or doesnt have an hotel (includesHotel: false)', async () => {

  });
  it('Should respond with 200 (OK) if everything is ok', async () => {

  });
});