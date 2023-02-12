import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDevisDto {
  @IsString()
  @IsNotEmpty()
  nomDesServices: string;

  @IsString()
  @IsNotEmpty()
  frequence: string;
}
