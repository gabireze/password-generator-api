import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';

import { AppModule } from './app.module';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Password Generator API')
    .setDescription('API for generating secure passwords')
    .setVersion('1.0')
    .addTag('Passwords')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  mkdirSync('./docs', { recursive: true });
  writeFileSync('./docs/swagger.json', JSON.stringify(document, null, 2));

  console.log('✅ Swagger JSON generated at ./docs/swagger.json');

  await app.close();
}

void generateSwagger();
