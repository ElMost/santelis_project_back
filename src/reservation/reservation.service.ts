import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @Inject(UserService)
    private userRepository: UserService,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    try {
      // console.log('createReservationDto', createReservationDto);
      const user = await this.userRepository.findOneByEmail(
        createReservationDto.email,
      );

      if (!user) {
        throw new NotFoundException(
          `User with email ${createReservationDto.email} not found`,
        );
      }

      const newReservation = this.reservationRepository.create({
        ...createReservationDto,
        User: user,
      });
      // console.log('newReservation', newReservation);
      const savedReservation = await this.reservationRepository.save(
        newReservation,
      );

      console.log('savedReservation', savedReservation);
      return newReservation;
    } catch (error) {
      console.log('error', error);
    }
  }

  async findAll() {
    try {
      // Ce code permet de récupérer les reservations avec les infos de l'utilisateur
      //qui a fait la reservation en utilisant la relation  OneToMany avec la table User
      const reservations = await this.reservationRepository.find({
        relations: ['User'],
      });
      console.log('reservations', reservations);
      // si tout se passe bien, on renvoie les reservations
      return reservations;
    } catch (error) {
      // si une erreur survient, on la log et on renvoie un message d'erreur
      throw new Error('Impossible de récupérer les reservations');
    }
  }

  async findOne(id: string) {
    try {
      // Ce code permet de récupérer les reservations avec les infos de l'utilisateur
      //qui a fait la reservation en utilisant la relation  OneToMany avec la table User
      const reservation = await this.reservationRepository.findOne({
        where: { id },
        relations: ['User'],
      });
      // si la reservation n'existe pas, on renvoie un message d'erreur
      //  et un code d'erreur ( 404 = Not Found)
      if (!reservation) {
        return {
          message: `Reservation avec l'ID ${id} introuvable`,
          error: 404,
        };
      }
      //  console.log('reservation', reservation);
      else {
        return reservation;
      }
    } catch (error) {
      // si une erreur survient, on la log et on renvoie un message d'erreur
      console.log('error', error);
      throw new Error(`Reservation avec l'ID ${id} introuvable`);
    }
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    try {
      // Ce code permet de récupérer les reservations avec les infos de l'utilisateur
      //qui a fait la reservation en utilisant la relation  OneToMany avec la table User
      const reservation = await this.reservationRepository.findOne({
        where: { id },
        relations: ['User'],
      });
      // si la reservation n'existe pas, on renvoie un message d'erreur
      if (!reservation) {
        throw new Error(`Reservation avec l'ID ${id} introuvable`);
      }
      // si la reservation existe, on met à jour les infos
      // et on renvoie la reservation mise à jour
      const updatedReservation = await this.reservationRepository.save({
        ...reservation,
        ...updateReservationDto,
      });

      console.log('La reservation a été mise à jour', updatedReservation);
      return updatedReservation;
    } catch (error) {
      // si une erreur survient, on la log et on renvoie un message d'erreur
      console.log('Erreur lors de la mise à jour de la reservation', error);
      throw new Error(`Reservation avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      // Ce code permet de récupérer les reservations avec les infos de l'utilisateur
      const reservation = await this.reservationRepository.findOne({
        where: { id: id.toString() },
        relations: ['User'],
      });
      if (!reservation) {
        // si la reservation n'existe pas, on renvoie un message d'erreur
        throw new Error(`Reservation avec l'ID ${id} introuvable`);
      }
      console.log('reservation', reservation);
      // si la reservation existe, on la supprime
      const deletedReservation = await this.reservationRepository.delete({
        id,
      });
      console.log('La reservation a été supprimée', deletedReservation);
      return deletedReservation;
    } catch (error) {
      // si une erreur survient, on la log et on renvoie un message d'erreur
      console.log('Erreur lors de la suppression de la reservation', error);
      throw new Error(`Reservation avec l'ID ${id} introuvable`);
    }
  }

  async getAllByEmail(email: string): Promise<Reservation[]> {
    // Ce code permet de récupérer les reservations avec les infos de l'utilisateur
    return this.reservationRepository.find({ where: { email: email } });
  }
}
