import { Devis } from 'src/devis/entities/devi.entity';
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

  @OneToMany(
    () => Reservation,
    (reservationDeServices) => reservationDeServices.User,
  )
  reservationDeServices: Reservation[];

  @OneToMany(() => Devis, (devis) => devis.User, {
    onDelete: 'CASCADE',
  })
  devis: Devis[];
  reservation: any;
}
