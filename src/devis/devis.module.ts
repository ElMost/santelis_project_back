import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Devis } from './entities/devis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Devis])],
  controllers: [DevisController],
  providers: [DevisService],
})
export class DevisModule {}
