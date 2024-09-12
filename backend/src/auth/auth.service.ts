import { Injectable } from '@nestjs/common';
// import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
// import { SignupAuthDto } from './dto/signup-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    const { username, id: sub } = user;

    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }

  async validate(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (user) {
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return null;
        }
        delete user.password;
        return user;
      });
    }
    return null;
  }
}
