import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('PasswordController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const basePayload = {
    length: 10,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    quantity: 2,
    quoted: true,
  };

  it('should return JSON passwords', async () => {
    const res = await request(app.getHttpServer())
      .post('/password/generate')
      .send({ ...basePayload, format: 'json' })
      .expect(200);

    const body = res.body as { passwords: string[] };

    expect(Array.isArray(body.passwords)).toBe(true);
    expect(body.passwords.length).toBe(2);
  });

  it('should return text passwords', async () => {
    const res = await request(app.getHttpServer())
      .post('/password/generate')
      .send({ ...basePayload, format: 'text', separator: '\n' })
      .expect(200)
      .expect('Content-Type', /text\/plain/);

    const lines = res.text.trim().split('\n');
    expect(lines.length).toBe(2);
    lines.forEach((line) => expect(line.startsWith('"')).toBe(true));
  });

  it('should return XML passwords', async () => {
    const res = await request(app.getHttpServer())
      .post('/password/generate')
      .send({ ...basePayload, format: 'xml' })
      .expect(200)
      .expect('Content-Type', /application\/xml/);

    expect(res.text).toContain('<password>');
    expect(res.text).toContain('</passwords>');
  });

  it('should return YAML passwords', async () => {
    const res = await request(app.getHttpServer())
      .post('/password/generate')
      .send({ ...basePayload, format: 'yaml' })
      .expect(200)
      .expect('Content-Type', /text\/yaml/);

    expect(res.text).toContain('- ');
    expect(res.text).toContain('passwords:');
  });

  it('should return CSV passwords', async () => {
    const res = await request(app.getHttpServer())
      .post('/password/generate')
      .send({ ...basePayload, format: 'csv', separator: ', ' })
      .expect(200)
      .expect('Content-Type', /text\/csv/);

    const parts = res.text.split(', ');
    expect(parts.length).toBe(2);
  });

  it('should return HTML passwords', async () => {
    const res = await request(app.getHttpServer())
      .post('/password/generate')
      .send({ ...basePayload, format: 'html' })
      .expect(200)
      .expect('Content-Type', /text\/html/);

    expect(res.text).toContain('<ul>');
    expect(res.text).toContain('<li>');
  });

  it('should return 400 for invalid format', async () => {
    await request(app.getHttpServer())
      .post('/password/generate')
      .send({ ...basePayload, format: 'invalid' })
      .expect(400);
  });
});
