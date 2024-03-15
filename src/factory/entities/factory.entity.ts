import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'Factory',
})
export class Factory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.factory)
  products: Product[];

  @Column()
  created_at: string;

  @Column({
    nullable: true,
  })
  updated_at: string;
}
