import { Factory } from 'src/factory/entities/factory.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'PRODUCTS',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => Factory, (factory) => factory.products)
  factory: Factory;

  @Column()
  created_at: string;

  @Column({
    nullable: true,
  })
  updated_at: string;
}
