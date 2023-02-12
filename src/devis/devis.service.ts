import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileWatcherEventKind } from 'typescript';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';
import { Devis } from './entities/devis.entity';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private devisRepository: Repository<Devis>,
  ) {}

  async create(createDevisDto: CreateDevisDto) {
    try {
      const newDevis = this.devisRepository.create(createDevisDto);
      const savedDevis = await this.devisRepository.save(newDevis);
      console.log('Le devis a été créé avec succès :', savedDevis);
      return savedDevis;
    } catch (error) {
      console.log('Erreur lors de la création du devis :', error);
      throw new Error('Impossible de créer le devis');
    }
  }

  async findAll() {
    try {
      const devis = await this.devisRepository.find({ relations: ['User'] });
      return devis;
    } catch (error) {
      console.log('Erreur lors de la récupération des devis :', error);
      throw new Error('Impossible de récupérer les devis');
    }
  }

  async findOne(id: string) {
    try {
      const devis = await this.devisRepository.findOne({
        where: { id },
        relations: ['User'],
      });

      if (!devis) {
        throw new Error(`Devis avec l'ID ${id} introuvable`);
      }
      return devis;
    } catch (error) {
      console.log('Erreur lors de la récupération du devis :', error);
      throw new Error(`Impossible de récupérer le devis avec l'ID ${id}`);
    }
  }

  async update(id: string, updateDevisDto: UpdateDevisDto) {
    try {
      const devis = await this.devisRepository.findOne({ where: { id } });
      if (!devis) {
        throw new Error(`Devis avec l'ID ${id} introuvable`);
      }
      const updatedDevis = await this.devisRepository.save({
        ...devis,
        ...updateDevisDto,
      });
      console.log('Le devis a été mis à jour avec succès :', updatedDevis);
      return updatedDevis;
    } catch (error) {
      console.log('Erreur lors de la mise à jour du devis :', error);
      throw new Error(`Impossible de mettre à jour le devis avec l'ID ${id}`);
    }
  }

  async delete(id: string) {
    try {
      const devis = await this.devisRepository.findOne({ where: { id } });

      if (!devis) {
        throw new Error(`Devis avec l'ID ${id} introuvable`);
      }
      const deletedDevis = await this.devisRepository.delete(id);
      console.log('Le devis a été supprimé avec succès :', deletedDevis);
      return deletedDevis;
    } catch (error) {
      console.log('Erreur lors de la suppression du devis :', error);
      throw new Error(`Impossible de supprimer le devis avec l'ID ${id}`);
    }
  }
}
