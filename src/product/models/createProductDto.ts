import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;
  description: string;
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  price: number;
}
