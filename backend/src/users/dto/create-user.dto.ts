import {
  IsEmail,
  IsString,
  IsUrl,
  Length,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @MinLength(2)
  password: string;

  @IsString()
  @Length(0, 200)
  about: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatar: string;
}
