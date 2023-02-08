import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDeviDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  nomDesServices: string;

  @IsString()
  @IsNotEmpty()
  frequence: string;

  @IsString()
  @IsOptional()
  UserId: string;
}
