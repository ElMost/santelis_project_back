import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateDevisDto {
  @IsString()
  @IsNotEmpty()
  nomDesServices: string;

  @IsString()
  @IsNotEmpty()
  frequence: string;

  email: string;
}
