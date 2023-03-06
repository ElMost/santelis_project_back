import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Devis } from './entities/devis.entity';
import { DevisMailerController } from './devis.mailer';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Devis]), UserModule],
  controllers: [DevisController, DevisMailerController],
  providers: [DevisService],
})
export class DevisModule {}
