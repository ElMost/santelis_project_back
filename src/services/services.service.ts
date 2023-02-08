import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  create(createServiceDto: CreateServiceDto) {
    try {
      console.log('createServiceDto', createServiceDto);

      return 'This action adds a new service';
    } catch (error) {
      console.log('error', error);
    }
  }

  findAll() {
    try {
      return `This action returns all services`;
    } catch (error) {
      console.log('error', error);
    }
  }

  findOne(id: number) {
    try {
      return `This action returns a #${id} service`;
    } catch (error) {
      console.log('error', error);
    }
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      console.log('updateServiceDto', updateServiceDto);

      return `This action updates a #${id} service`;
    } catch (error) {
      console.log('error', error);
    }
  }

  remove(id: number) {
    try {
      return `This action removes a #${id} service`;
    } catch (error) {
      console.log('error', error);
    }
  }
}
