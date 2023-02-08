import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ReservationModule } from './reservation/reservation.module';
import { ServicesModule } from './services/services.module';
import { DevisModule } from './devis/devis.module';

@Module({
  imports: [UserModule, ReservationModule, ServicesModule, DevisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
