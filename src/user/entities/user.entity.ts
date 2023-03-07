import { Devis } from 'src/devis/entities/devis.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  nom: string;

  @Column({
    nullable: false,
  })
  prenom: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(() => Reservation, reservation => reservation.User)
  reservation: Reservation[];

  @OneToMany(() => Devis, devis => devis.User, {
    onDelete: 'CASCADE',
  })
  devis: Devis[];
}
