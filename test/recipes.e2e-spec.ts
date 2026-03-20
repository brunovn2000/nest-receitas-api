import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

jest.mock('uuid', () => ({
  v4: () => 'e2e-test-uuid',
}));

import { AppModule } from './../src/app.module';

describe('Receitas (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Register and Login to get token
    const login = `recipe_user_${Date.now()}`;
    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({ nome: 'Recipe User', login, senha: 'password123' });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ login, senha: 'password123' });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/recipes (POST) - Criar Receita', () => {
    return request(app.getHttpServer())
      .post('/api/v1/recipes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        nome: 'Pasta Carbonara',
        tempoPreparoMinutos: 20,
        porcoes: 2,
        modoPreparo: 'Mix ingredients and cook.',
        ingredientes: 'Pasta, eggs, cheese, guanciale',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.nome).toBe('Pasta Carbonara');
      });
  });

  it('/api/v1/recipes (GET) - Listar Receitas', () => {
    return request(app.getHttpServer())
      .get('/api/v1/recipes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });

  it('/api/v1/recipes (GET) - Falha ao Listar Receitas (Não Autorizado)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/recipes')
      .expect(401);
  });
});
