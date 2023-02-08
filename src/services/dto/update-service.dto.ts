import { IsString, Length } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @Length(2, 50)
  nomDesServices: string;
}
