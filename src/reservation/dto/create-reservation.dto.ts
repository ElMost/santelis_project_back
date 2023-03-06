import { IsDate, isDate, IsNotEmpty, IsString } from 'class-validator';

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
  heure: string;
}

// import { HttpException, HttpStatus } from '@nestjs/common';
// import { validate, ValidationError } from 'class-validator';

// export class CreateReservationDto {
//   email: string;
//   nomDesServices: string;
//   date: string;
//   heure: string;

//   static async from(dto: CreateReservationDto) {
//     const createReservation = new CreateReservationDto();
//     createReservation.email = dto.email;
//     createReservation.nomDesServices = dto.nomDesServices;
//     createReservation.date = dto.date;
//     createReservation.heure = dto.heure;
//     const errors = await validate(createReservation);
//     if (errors.length) {
//       const message = errors
//         .map((error: ValidationError) =>
//           Object.values(error.constraints).join(', '),
//         )
//         .join(', ');
//       throw new HttpException(message, HttpStatus.BAD_REQUEST);
//     }
//     return createReservation;
//   }
// }
