import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Factory } from 'src/factory/entities/factory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Factory])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
