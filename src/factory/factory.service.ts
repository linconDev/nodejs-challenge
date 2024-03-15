import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { Factory } from './entities/factory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FactoryService {
  private readonly logger = new Logger(FactoryService.name);
  constructor(
    @InjectRepository(Factory)
    private factoryRepository: Repository<Factory>,
  ) {}

  async create(createFactoryDto: CreateFactoryDto) {
    try {
      const created_at = new Date();
      const date = created_at.toLocaleDateString();
      const hour = created_at.toLocaleTimeString();
      createFactoryDto.created_at = `${date} ${hour}`;

      const factory = new Factory();
      factory.created_at = createFactoryDto.created_at;
      factory.description = createFactoryDto.description;

      const response = await this.factoryRepository.save(factory);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async findAll() {
    try {
      const response = await this.factoryRepository.find();
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.factoryRepository.findOne({
        where: {
          id: id,
        },
      });
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async update(id: number, updateFactoryDto: UpdateFactoryDto) {
    try {
      const update_at = new Date();
      const date = update_at.toLocaleDateString();
      const hour = update_at.toLocaleTimeString();

      updateFactoryDto.updated_at = `${date} ${hour}`;
      const factory = await this.factoryRepository.findOneBy({ id });
      factory.updated_at = updateFactoryDto.updated_at;
      factory.description =
        updateFactoryDto.description !== undefined
          ? updateFactoryDto.description
          : factory.description;

      const response = await this.factoryRepository.save(factory);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async remove(id: number) {
    try {
      const response = await this.factoryRepository.delete({ id });
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }
}
