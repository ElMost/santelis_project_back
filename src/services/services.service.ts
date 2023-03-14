import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  // Injection de dépendance pour la classe Repository
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  // Fonction pour créer un nouveau service
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      // Enregistrement du nouveau service dans la base de données
      const service = await this.serviceRepository.save(createServiceDto);
      // Retourne le nouveau service
      return service;
    } catch (error) {
      // Affichage de l'erreur en cas d'échec de la création du service
      console.log('Erreur lors de la création du service', error);
    }
  }

  // Fonction pour récupérer tous les services
  async findAll(): Promise<Service[]> {
    try {
      // Récupération de tous les services dans la base de données
      const services = await this.serviceRepository.find();
      // Retourne tous les services
      return services;
    } catch (error) {
      // Affichage de l'erreur en cas d'échec de la récupération de la liste des services
      console.log(
        'Erreur lors de la récupération de la liste des services',
        error,
      );
    }
  }
  // Fonction pour récupérer un service en fonction de son identifiant
  async findOne(id: string): Promise<Service> {
    try {
      // Conversion de l'identifiant en string
      const serviceId = id;
      // Récupération du service dans la base de données en fonction de son identifiant
      const service = await this.serviceRepository.findOneBy({ id: serviceId });
      // Retourne le service
      return service;
    } catch (error) {
      // Affichage de l'erreur en cas d'échec de la récupération du service
      console.log('Erreur lors de la récupération du service', error);
    }
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    try {
      // Conversion de l'identifiant en chaîne
      const stringId = id;
      // Récupération du service dans la base de données en fonction de son identifiant
      const service = await this.serviceRepository.findOne({
        where: { id: stringId },
      });
      if (!service) {
        // Erreur à afficher si le service n'a pas été trouvé en base de données
        console.log(`Service avec l'identifiant ${id} non trouvé`);
        return;
      }
      // Mise à jour du service trouvé avec les nouvelles informations
      await this.serviceRepository.update({ id: stringId }, updateServiceDto);
      // Récupération du service mis à jour
      const updatedService = await this.serviceRepository.findOne({
        where: { id: stringId },
      });
      // Retourne le service mis à jour
      return updatedService;
    } catch (error) {
      // Affichage de l'erreur en cas d'échec de la mise à jour du service
      console.log('Erreur lors de la mise à jour du service', error);
    }
  }

  // Fonction pour supprimer un service
  async delete(id: string) {
    try {
      // Récupération du service dans la base de données en fonction de son identifiant
      const service = await this.serviceRepository.findOne({
        where: { id },
      });

      if (!service) {
        // Erreur à afficher si le service n'a pas été trouvé en base de données
        console.log(`Service avec l'identifiant ${id} non trouvé`);
        throw new Error(`Service avec l'identifiant ${id} non trouvé`);
      }
      // // Suppression du service trouvé
      const deletedService = await this.serviceRepository.delete(id);
      return deletedService;
    } catch (error) {
      // Affichage de l'erreur en cas d'échec de la suppression du service
      console.log('Erreur lors de la suppression du service', error);

      throw new Error(`Erreur lors de la suppression du service ${id}`);
    }
  }
}
