import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { connectTestDb, closeTestDb } from './setup/testDb.js';

let app;
let User;
let Loan;
const API = '/api/v1';

const tokens = {};
const ids = {};

beforeAll(async () => {
  await connectTestDb();
  const loader = await import('../src/loaders/express.loader.js');
  app = loader.createApp();
  ({ User } = await import('../src/models/user.model.js'));
  ({ Loan } = await import('../src/models/loan.model.js'));

  await User.create({ name: 'Admin', email: 'admin@nj.com', password: 'Admin@123', role: 'admin' });
  const adminLogin = await request(app).post(`${API}/auth/login`).send({ email: 'admin@nj.com', password: 'Admin@123' });
  tokens.admin = adminLogin.body.data.accessToken;

  const reg = await request(app).post(`${API}/auth/register`).send({ name: 'Cust', email: 'cust@nj.com', password: 'Cust@1234' });
  tokens.customer = reg.body.data.accessToken;
  ids.customer = reg.body.data.user._id;
});
afterAll(closeTestDb);

const auth = (t) => ({ Authorization: `Bearer ${t}` });

describe('Loan categories & RBAC', () => {
  it('lets admin create a category and blocks customers', async () => {
    const created = await request(app).post(`${API}/loan-categories`).set(auth(tokens.admin)).send({
      name: 'Personal Loan', minAmount: 50000, maxAmount: 2000000, minTenureMonths: 6, maxTenureMonths: 60, interestRateMin: 11, interestRateMax: 18,
    });
    expect(created.status).toBe(201);
    expect(created.body.data.item.slug).toBe('personal-loan');
    ids.category = created.body.data.item._id;

    const blocked = await request(app).post(`${API}/loan-categories`).set(auth(tokens.customer)).send({ name: 'X', minAmount: 1, maxAmount: 2, minTenureMonths: 1, maxTenureMonths: 2, interestRateMin: 1, interestRateMax: 2 });
    expect(blocked.status).toBe(403);
  });

  it('exposes only active categories publicly', async () => {
    const res = await request(app).get(`${API}/loan-categories`);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
  });
});

describe('Application workflow', () => {
  it('lets a customer create an application', async () => {
    const res = await request(app).post(`${API}/applications`).set(auth(tokens.customer)).send({
      category: ids.category, amount: 500000, tenureMonths: 24, employmentType: 'salaried', monthlyIncome: 80000,
    });
    expect(res.status).toBe(201);
    expect(res.body.data.applicationNumber).toMatch(/^NJ-/);
    ids.application = res.body.data.item._id;
  });

  it('rejects amounts outside the category range', async () => {
    const res = await request(app).post(`${API}/applications`).set(auth(tokens.customer)).send({ category: ids.category, amount: 10, tenureMonths: 24 });
    expect(res.status).toBe(400);
  });

  it('scopes the list to the customer and includes stats', async () => {
    const res = await request(app).get(`${API}/applications`).set(auth(tokens.customer));
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.stats.total).toBe(1);
    expect(res.body.data.stats.pending).toBe(1);
  });

  it('blocks customers from changing status', async () => {
    const res = await request(app).put(`${API}/applications/${ids.application}`).set(auth(tokens.customer)).send({ status: 'approved' });
    expect(res.status).toBe(403);
  });

  it('creates a Loan + notification on disbursal', async () => {
    const res = await request(app).put(`${API}/applications/${ids.application}`).set(auth(tokens.admin)).send({ status: 'disbursed', approvedAmount: 500000, approvedRate: 12 });
    expect(res.status).toBe(200);
    const loan = await Loan.findOne({ application: ids.application });
    expect(loan).toBeTruthy();
    expect(loan.emi).toBeGreaterThan(0);

    const notifs = await request(app).get(`${API}/notifications`).set(auth(tokens.customer));
    expect(notifs.body.data.items.some((n) => n.title === 'Application update')).toBe(true);
  });
});

describe('Reviews moderation', () => {
  it('hides unapproved reviews and reveals them after approval', async () => {
    const created = await request(app).post(`${API}/reviews`).send({ name: 'Ravi', rating: 5, message: 'Fantastic service!' });
    expect(created.status).toBe(201);
    const reviewId = created.body.data.item._id;

    let pub = await request(app).get(`${API}/reviews`);
    expect(pub.body.data.items).toHaveLength(0);

    await request(app).patch(`${API}/reviews/${reviewId}`).set(auth(tokens.admin)).send({ isApproved: true });
    pub = await request(app).get(`${API}/reviews`);
    expect(pub.body.data.items).toHaveLength(1);
  });
});

describe('Documents', () => {
  it('uploads a document for the customer', async () => {
    const res = await request(app)
      .post(`${API}/documents`)
      .set(auth(tokens.customer))
      .field('type', 'pan')
      .attach('document', Buffer.from('fake'), { filename: 'pan.png', contentType: 'image/png' });
    expect(res.status).toBe(201);
    expect(res.body.data.item.type).toBe('pan');
  });
});

describe('Employees', () => {
  it('provisions a User when creating an employee', async () => {
    const res = await request(app).post(`${API}/employees`).set(auth(tokens.admin)).send({
      name: 'Emp One', email: 'emp@nj.com', password: 'Emp@1234', employeeId: 'EMP100', department: 'credit',
    });
    expect(res.status).toBe(201);
    const login = await request(app).post(`${API}/auth/login`).send({ email: 'emp@nj.com', password: 'Emp@1234' });
    expect(login.body.data.user.role).toBe('employee');
  });
});

describe('Analytics', () => {
  it('requires auth and returns aggregated KPIs for admins', async () => {
    const anon = await request(app).get(`${API}/admin/analytics`);
    expect(anon.status).toBe(401);
    const res = await request(app).get(`${API}/admin/analytics`).set(auth(tokens.admin));
    expect(res.status).toBe(200);
    expect(res.body.data.kpis.applications).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.data.byStatus)).toBe(true);
  });
});
