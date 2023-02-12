import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDevisDto {
  @IsString()
  @IsNotEmpty()
  nomDesServices: string;

  @IsString()
  @IsNotEmpty()
  frequence: string;
}
