import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { connectTestDb, clearTestDb, closeTestDb } from './setup/testDb.js';

let app;
const API = '/api/v1';

beforeAll(async () => {
  await connectTestDb();
  const { createApp } = await import('../src/loaders/express.loader.js');
  app = createApp();
});
afterAll(closeTestDb);
beforeEach(clearTestDb);

const validUser = { name: 'Asha Rao', email: 'asha@example.com', password: 'Secret123', phone: '9876543210' };

describe('Auth', () => {
  it('registers a new customer and returns an access token', async () => {
    const res = await request(app).post(`${API}/auth/register`).send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.headers['set-cookie']?.[0]).toMatch(/nj_refresh=/);
  });

  it('rejects invalid registration input with 422 field errors', async () => {
    const res = await request(app).post(`${API}/auth/register`).send({ name: 'A', email: 'bad', password: 'weak' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(3);
  });

  it('prevents duplicate email registration', async () => {
    await request(app).post(`${API}/auth/register`).send(validUser);
    const res = await request(app).post(`${API}/auth/register`).send(validUser);
    expect(res.status).toBe(409);
  });

  it('logs in with correct credentials and rejects wrong ones', async () => {
    await request(app).post(`${API}/auth/register`).send(validUser);
    const bad = await request(app).post(`${API}/auth/login`).send({ email: validUser.email, password: 'WrongPass1' });
    expect(bad.status).toBe(401);
    const good = await request(app).post(`${API}/auth/login`).send({ email: validUser.email, password: validUser.password });
    expect(good.status).toBe(200);
    expect(good.body.data.accessToken).toBeTruthy();
  });

  it('guards /auth/me and returns the profile with a valid token', async () => {
    const reg = await request(app).post(`${API}/auth/register`).send(validUser);
    const token = reg.body.data.accessToken;
    const noAuth = await request(app).get(`${API}/auth/me`);
    expect(noAuth.status).toBe(401);
    const withAuth = await request(app).get(`${API}/auth/me`).set('Authorization', `Bearer ${token}`);
    expect(withAuth.status).toBe(200);
    expect(withAuth.body.data.user.email).toBe(validUser.email);
  });

  it('refreshes the access token via the refresh cookie', async () => {
    const agent = request.agent(app);
    await agent.post(`${API}/auth/register`).send(validUser);
    const res = await agent.post(`${API}/auth/refresh`);
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
  });

  it('does not reveal whether an email exists on forgot-password', async () => {
    const known = await request(app).post(`${API}/auth/forgot-password`).send({ email: validUser.email });
    const unknown = await request(app).post(`${API}/auth/forgot-password`).send({ email: 'nobody@example.com' });
    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
  });
});
