import { Injectable } from '@nestjs/common';
import { CreateDeviDto } from './dto/create-devi.dto';
import { UpdateDevisDto } from './dto/update-devi.dto';
// import { UpdateDevisDto, UpdateDevisDto } from './dto/update-devi.dto';

@Injectable()
export class DevisService {
  create(createDeviDto: CreateDeviDto) {
    try {
      console.log('createDeviDto', createDeviDto);
      return 'This action adds a new devi';
    } catch (error) {
      console.log('error', error);
    }
  }

  findAll() {
    try {
      return `This action returns all devis`;
    } catch (error) {
      console.log('error', error);
    }
  }

  findOne(id: number) {
    try {
      return `This action returns a #${id} devi`;
    } catch (error) {
      console.log('error', error);
    }
  }

  update(id: number, updateDeviDto: UpdateDevisDto) {
    try {
      console.log('updateDeviDto', updateDeviDto);

      return `This action updates a #${id} devi`;
    } catch (error) {
      console.log('error', error);
    }
  }

  remove(id: number) {
    try {
      return `This action removes a #${id} devi`;
    } catch (error) {
      console.log('error', error);
    }
  }
}
