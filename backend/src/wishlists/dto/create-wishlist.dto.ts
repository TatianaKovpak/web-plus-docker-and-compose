import { IsArray, IsOptional, IsString, Length } from 'class-validator';
export class CreateWishlistDto {
  @IsString()
  @Length(0, 250)
  name: string;

  @IsString()
  image: string;

  @IsArray()
  itemsId: number[];

  @Length(1, 1500)
  @IsOptional()
  description: string;
}
