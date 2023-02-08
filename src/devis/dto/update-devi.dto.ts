import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviDto } from './create-devi.dto';

export class UpdateDeviDto extends PartialType(CreateDeviDto) {}
