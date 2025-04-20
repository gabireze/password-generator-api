import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';
import * as cors from 'cors';
import * as express from 'express';

import { AppModule } from './app.module';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

  expressApp.use(
    cors({
      origin: ['http://localhost:5173', 'https://password-ui.vercel.app'],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Password Generator API')
    .setDescription(
      'API for generating secure random passwords with customizable options',
    )
    .setVersion('1.0')
    .addTag('Passwords')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context, callback) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context, callback);
};
