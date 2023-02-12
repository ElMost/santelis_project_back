import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { constructor } from 'typescript';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';

@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  create(@Body() createDevisDto: CreateDevisDto) {
    return this.devisService.create(createDevisDto);
  }

  @Get()
  findAll() {
    return this.devisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDeviDto: UpdateDevisDto) {
    return this.devisService.update(id, updateDeviDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const deletedDevis = await this.devisService.delete(id);
      return { message: 'Devis supprimé avec succès', deletedDevis };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Impossible de supprimer le devis avec l'ID ${id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
