import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, IsUrl, Length, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(0, 200)
  about: string;

  @IsString()
  @IsUrl()
  avatar: string;

  @IsString()
  @MinLength(2)
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
