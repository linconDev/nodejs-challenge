import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  idFab: number;

  @IsNotEmpty()
  name: string;

  description: string;

  @IsNotEmpty()
  price: number;

  created_at: string;

  updated_at: string;
}
