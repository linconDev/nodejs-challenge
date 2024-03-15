import { IsNotEmpty } from 'class-validator';

export class CreateFactoryDto {
  @IsNotEmpty()
  readonly description: string;

  created_at: string;

  updated_at: string;
}
