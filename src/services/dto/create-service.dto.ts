import { IsString, Length } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @Length(2, 50)
  nomDesServices: string;
}
