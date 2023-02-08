import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  create(createReservationDto: CreateReservationDto) {
    try {
      console.log('createReservationDto', createReservationDto);
      return 'This action adds a new reservation';
    } catch (error) {
      console.log('error', error);
    }
  }

  findAll() {
    try {
      return `This action returns all reservation`;
    } catch (error) {
      console.log('error', error);
    }
  }

  findOne(id: number) {
    try {
      return `This action returns a #${id} reservation`;
    } catch (error) {
      console.log('error', error);
    }
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      console.log('updateReservationDto', updateReservationDto);

      return `This action updates a #${id} reservation`;
    } catch (error) {
      console.log('error', error);
    }
  }

  remove(id: number) {
    try {
      return `This action removes a #${id} reservation`;
    } catch (error) {
      console.log('error', error);
    }
  }
}
