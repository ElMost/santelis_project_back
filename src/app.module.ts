import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DevisModule } from './devis/devis.module';
import { ServicesModule } from './services/services.module';
import { ReservationModule } from './reservation/reservation.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Devis } from './devis/entities/devis.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { Service } from './services/entities/service.entity';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MulterModule.register({ dest: './files' }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'files') }),
    // TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Reservation, Service, Devis],
      synchronize: process.env.MODE === 'DEV' ? true : false,
    }),
    UserModule,
    ReservationModule,
    ServicesModule,
    DevisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
