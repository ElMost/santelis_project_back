import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const corsOptions: CorsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors(corsOptions);
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
