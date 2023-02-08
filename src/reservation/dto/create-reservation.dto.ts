import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  nomDesServices: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsString()
  heure: string;
}
