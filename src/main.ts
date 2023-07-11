import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PgNotifyServer } from 'nestjs-pg-notify';
import { graphqlUploadExpress } from 'graphql-upload-ts';

import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';

dotenv.config();

export const corsAllowedOrigins =
  process.env.CORS_ALLOW_ORIGINS?.split(',').filter((s) => s) || [];

console.log(corsAllowedOrigins);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new PgNotifyServer({
      connection: {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
      },
      strategy: {
        retryInterval: 1_000,
        retryTimeout: Infinity,
      },
    }),
  });

  app.enableCors({
    origin: '*',
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,',
    // allowedHeaders:
    //   'Content-Type, Accept, Authorization, content-disposition, apollographql-client-name, apollographql-client-version',
    // exposedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 50,
    }),
  );

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Database load API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
