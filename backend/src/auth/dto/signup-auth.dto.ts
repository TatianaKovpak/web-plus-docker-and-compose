import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class SignupAuthDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(0, 200)
  about: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsUrl()
  avatar: string;
}
