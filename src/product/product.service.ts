import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Factory } from 'src/factory/entities/factory.entity';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Factory)
    private factoryRepository: Repository<Factory>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const created_at = new Date();
      const date = created_at.toLocaleDateString();
      const hour = created_at.toLocaleTimeString();
      createProductDto.created_at = `${date} ${hour}`;
      const factory = await this.factoryRepository.findOneBy({
        id: createProductDto.idFab,
      });
      const product = new Product();
      product.name = createProductDto.name;
      product.price = createProductDto.price;
      product.created_at = createProductDto.created_at;
      product.description = createProductDto.description;
      product.factory = factory;
      const response = await this.productRepository.save(product);
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
      const response = this.productRepository.find();
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async findAllForFabric(id: number) {
    try {
      const response = this.productRepository.find({
        where: {
          factory: {
            id,
          },
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

  async findOne(id: number) {
    try {
      const response = this.productRepository.findOneBy({ id });
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const update_at = new Date();
      const date = update_at.toLocaleDateString();
      const hour = update_at.toLocaleTimeString();

      updateProductDto.updated_at = `${date} ${hour}`;
      const product = await this.productRepository.findOneBy({ id });
      product.updated_at = updateProductDto.updated_at;
      product.name =
        updateProductDto !== undefined ? updateProductDto.name : product.name;
      product.description =
        updateProductDto.description !== undefined
          ? updateProductDto.description
          : product.description;
      product.price =
        updateProductDto.price !== undefined
          ? updateProductDto.price
          : product.price;
      const response = await this.productRepository.save(product);
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
      const response = await this.productRepository.delete({ id });
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
