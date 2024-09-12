import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<CreateUserDto> {
    const user = await this.authService.validate(username, password);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Неверное имя пользователя или пароль',
      });
    }

    return user;
  }
}
