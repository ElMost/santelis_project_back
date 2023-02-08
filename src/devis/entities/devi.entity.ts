import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Devis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomDesServices: string;

  @Column()
  frequence: string;

  @ManyToOne(() => User, (User) => User.devis, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'UserId' })
  User: User;
}
