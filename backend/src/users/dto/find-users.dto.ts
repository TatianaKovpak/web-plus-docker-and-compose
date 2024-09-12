import { IsEmail, IsString } from 'class-validator';

export class FindUsersDto {
  @IsString()
  @IsEmail()
  query: string;
}
