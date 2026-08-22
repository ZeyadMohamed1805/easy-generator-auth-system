import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { INVALID_CREDENTIALS } from '../src/auth/auth.constants';

const validUser = {
  email: 'ada@example.com',
  name: 'Ada Lovelace',
  password: 'Abcd1234!',
};

describe('Auth API (e2e)', () => {
  let app: INestApplication | undefined;
  let mongod: MongoMemoryServer | undefined;
  let server: ReturnType<INestApplication['getHttpServer']>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = mongod.getUri();
    process.env.JWT_ACCESS_SECRET = 'test-jwt-access-secret-min-32-chars!!';
    process.env.JWT_ACCESS_TTL_SECONDS = '900';
    process.env.REFRESH_TOKEN_TTL_DAYS = '7';
    process.env.COOKIE_SECURE = 'false';
    process.env.PORT = '3000';
    process.env.AUTH_THROTTLE_LIMIT = '1000';
    process.env.AUTH_THROTTLE_TTL_MS = '60000';

    // Load after env is set so ConfigModule validation sees the memory-server URI.
    const { AppModule } =
      require('../src/app.module') as typeof import('../src/app.module');
    const { configureApp } =
      require('../src/configure-app') as typeof import('../src/configure-app');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (mongod) {
      await mongod.stop();
    }
  });

  it('GET /api/health returns ok', async () => {
    await request(server)
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('rejects a weak signup password', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({ ...validUser, password: 'short' })
      .expect(400);
    expect(response.body.message).toEqual(expect.any(Array));
    expect(response.body.error).toBe('Validation failed');
  });

  it('rejects a short name', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({ ...validUser, name: 'Al' })
      .expect(400);
  });

  it('signs up, exposes /users/me, and hides the password hash', async () => {
    const agent = request.agent(server);
    const created = await agent
      .post('/api/auth/signup')
      .send(validUser)
      .expect(201);

    expect(created.body.user).toMatchObject({
      email: 'ada@example.com',
      name: 'Ada Lovelace',
    });
    expect(created.body.user.passwordHash).toBeUndefined();
    expect(created.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining('access_token='),
        expect.stringContaining('HttpOnly'),
        expect.stringContaining('refresh_token='),
      ]),
    );

    const me = await agent.get('/api/users/me').expect(200);
    expect(me.body).toMatchObject({
      email: 'ada@example.com',
      name: 'Ada Lovelace',
    });
    expect(me.body.passwordHash).toBeUndefined();
  });

  it('rejects a duplicate email', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({ ...validUser, name: 'Ada Two' })
      .expect(409);
    expect(response.body.message).toMatch(/already exists/i);
  });

  it('returns the same error for a wrong password and an unknown email', async () => {
    const wrongPassword = await request(server)
      .post('/api/auth/signin')
      .send({ email: validUser.email, password: 'Wrong123!' })
      .expect(401);
    const unknownEmail = await request(server)
      .post('/api/auth/signin')
      .send({ email: 'nobody@example.com', password: 'Wrong123!' })
      .expect(401);

    expect(wrongPassword.body.message).toBe(INVALID_CREDENTIALS);
    expect(unknownEmail.body.message).toBe(INVALID_CREDENTIALS);
  });

  it('returns 401 for /users/me without a session', async () => {
    await request(server).get('/api/users/me').expect(401);
  });

  it('signs in, refreshes, and logs out', async () => {
    const agent = request.agent(server);
    await agent
      .post('/api/auth/signin')
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);

    await agent.get('/api/users/me').expect(200);
    await agent.post('/api/auth/refresh').expect(200);
    await agent.get('/api/users/me').expect(200);

    await agent.post('/api/auth/logout').expect(204);
    await agent.get('/api/users/me').expect(401);
  });
});
