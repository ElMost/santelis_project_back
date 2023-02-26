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
      const reservations = await this.reservationRepository.find({
        relations: ['User'],
      });
      console.log('reservations', reservations);
      return reservations;
    } catch (error) {
      console.log('Erreur lors de la reservation', error);
      throw new Error('Impossible de récupérer les reservations');
    }
  }

  async findOne(id: string) {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id },
        relations: ['User'],
      });
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
      console.log('error', error);
      throw new Error(`Reservation avec l'ID ${id} introuvable`);
    }
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    try {
      console.log('updateReservationDto', updateReservationDto);
      const reservation = await this.reservationRepository.findOne({
        where: { id },
        relations: ['User'],
      });
      if (!reservation) {
        throw new Error(`Reservation avec l'ID ${id} introuvable`);
      }
      console.log('reservation', reservation);
      const updatedReservation = await this.reservationRepository.save({
        ...reservation,
        ...updateReservationDto,
      });
      console.log('La reservation a été mise à jour', updatedReservation);
      return updatedReservation;
    } catch (error) {
      console.log('Erreur lors de la mise à jour de la reservation', error);
      throw new Error(`Reservation avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id: id.toString() },
        relations: ['User'],
      });
      if (!reservation) {
        throw new Error(`Reservation avec l'ID ${id} introuvable`);
      }
      console.log('reservation', reservation);
      const deletedReservation = await this.reservationRepository.delete({
        id,
      });
      console.log('La reservation a été supprimée', deletedReservation);
      return deletedReservation;
    } catch (error) {
      console.log('Erreur lors de la suppression de la reservation', error);
      throw new Error(`Reservation avec l'ID ${id} introuvable`);
    }
  }
  async getAllByEmail(email: string): Promise<Reservation[]> {
    return this.reservationRepository.find({ where: { email: email } });
  }
}
