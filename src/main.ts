import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

dotenv.config();

export const corsAllowedOrigins =
  process.env.CORS_ALLOW_ORIGINS?.split(',').filter((s) => s) || [];

console.log(corsAllowedOrigins);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    exposedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.use(
    graphqlUploadExpress({
      maxFileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 50,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Database load API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
