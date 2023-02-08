import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomDesServices: string;

  @Column()
  date: Date;

  @Column()
  heure: string;

  @ManyToOne(() => User, (user) => user.reservation, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'UserId' })
  User: User;
  UserId: string;
}
