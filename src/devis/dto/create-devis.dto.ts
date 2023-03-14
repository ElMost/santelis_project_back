import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDevisDto {
  @IsString()
  @IsNotEmpty()
  nomDesServices: string;

  @IsString()
  @IsNotEmpty()
  frequence: string;

  email: string;
}
