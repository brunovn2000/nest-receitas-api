import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

jest.mock('uuid', () => ({
  v4: () => 'e2e-test-uuid',
}));

import { AppModule } from './../src/app.module';

describe('Autenticação (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    nome: 'E2E User',
    login: `e2e_user_${Date.now()}`,
    senha: 'password123',
  };

  it('/api/v1/users (POST) - Registro', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send(testUser)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.login).toBe(testUser.login);
      });
  });

  it('/api/v1/auth/login (POST) - Login', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        login: testUser.login,
        senha: testUser.senha,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.login).toBe(testUser.login);
      });
  });

  it('/api/v1/auth/login (POST) - Falha no Login', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        login: testUser.login,
        senha: 'wrongpassword',
      })
      .expect(401);
  });
});
