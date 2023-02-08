import { Devis } from 'src/devis/entities/devi.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomDesServices: string;

  @Column()
  type: string;

  @IsOptional()
  @ManyToMany(() => Devis, { eager: false })
  @JoinTable()
  devis: Devis[];

  @IsOptional()
  @ManyToMany(() => Reservation, { eager: false })
  @JoinTable()
  reservation: Reservation[];
}
