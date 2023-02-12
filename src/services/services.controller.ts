import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  // Injection de dépendance pour le service des services
  constructor(private readonly servicesService: ServicesService) {}

  // Endpoint pour la création d'un nouveau service
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.create(createServiceDto);
  }

  // Endpoint pour la récupération de tous les services
  @Get()
  async findAll() {
    return await this.servicesService.findAll();
  }

  // Endpoint pour la récupération d'un service en fonction de son identifiant
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.servicesService.findOne(id);
  }

  // Endpoint pour la mise à jour d'un service
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return await this.servicesService.update(id, updateServiceDto);
  }

  // Endpoint pour la suppression d'un service
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const deletedService = await this.servicesService.delete(id);
      return deletedService ? 'Service supprimé' : 'Service non trouvé';
    } catch (error) {
      throw new HttpException('Erreur lors de la suppression du service', 500);
    }
    // return await this.servicesService.delete(id);
  }
}
