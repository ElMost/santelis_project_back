import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReservationDto {
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

// import { HttpException, HttpStatus } from '@nestjs/common';
// import { validate, ValidationError } from 'class-validator';

// export class UpdateReservationDto {
//   email: string;
//   nomDesServices: string;
//   date: string;
//   heure: string;

//   static async from(dto: UpdateReservationDto) {
//     const updateReservation = new UpdateReservationDto();
//     updateReservation.email = dto.email;
//     updateReservation.nomDesServices = dto.nomDesServices;
//     updateReservation.date = dto.date;
//     updateReservation.heure = dto.heure;
//     const errors = await validate(updateReservation);
//     if (errors.length) {
//       const message = errors
//         .map((error: ValidationError) =>
//           Object.values(error.constraints).join(', '),
//         )
//         .join(', ');
//       throw new HttpException(message, HttpStatus.BAD_REQUEST);
//     }
//     return updateReservation;
//   }
// }
