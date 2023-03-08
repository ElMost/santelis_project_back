import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  // Cette route permet de créer une reservation
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  // Cette route permet de récupérer toutes les reservations
  findAll() {
    return this.reservationService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  // Cette route permet de récupérer une reservation en fonction de son id
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  // Cette route permet de mettre à jour une reservation en fonction de son id
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  // Cette route permet de supprimer une reservation en fonction de son id
  remove(@Param('id') id: string) {
    return this.reservationService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/by-email/:email')
  // Cette route permet de récupérer toutes les reservations d'un utilisateur en fonction de son email
  async getReservationsByEmail(
    @Param('email') email: string,
  ): Promise<Reservation[]> {
    return this.reservationService.getAllByEmail(email);
  }
}
