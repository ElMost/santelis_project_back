import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST,PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';

// dotenv.config();

// const corsOptions: CorsOptions = {
//   origin: process.env.CLIENT_SIDE,
//   credentials: true,
// };

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe());
//   app.use(cookieParser());
//   app.enableCors(corsOptions);
//   await app.listen(process.env.BACKEND_PORT || 8080);
// }
// bootstrap();
