import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const corsOptions: CorsOptions = {
  // origin: 'http://localhost:3000',
  origin: [/^(https?:\/\/)?localhost(:\d+)?$/, 'https://santelys.vercel.app'],

  credentials: true,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(8080);
}
bootstrap();
