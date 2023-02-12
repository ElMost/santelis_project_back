import { IsDate } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreateReservationDto } from '../dto/create-reservation.dto';

@Entity()
export class Reservation {
  save(createReservationDto: CreateReservationDto) {
    console.log(createReservationDto);
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  nomDesServices: string;

  @Column()
  @IsDate()
  date: Date;

  @Column()
  heure: string;

  @ManyToOne(() => User, user => user.reservation, {
    onDelete: 'CASCADE',
    // nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'UserId' })
  User: User;
  UserId: string;
}
