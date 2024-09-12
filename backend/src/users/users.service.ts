import {
  ConflictException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const isUser = await this.userRepository.findBy([
      { username: createUserDto.username },
      { email: createUserDto.email },
    ]);

    if (isUser.length > 0) {
      throw new ConflictException('Такой пользователь уже существует');
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = { ...createUserDto, password: hash };
    await this.userRepository.save(user);
    return user;
  }

  async findOne(username: string): Promise<CreateUserDto> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        username: true,
        about: true,
      },
      where: {
        username,
      },
    });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    return user;
  }

  async findOwn(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        password: true,
      },
      where: {
        id: id,
      },
    });
    for (const i in updateUserDto) {
      if (i === ' password') {
        const hash = await bcrypt.hash(updateUserDto[i], 10);
        user[i] = hash;
      }
      user[i] = updateUserDto[i];
    }

    try {
      const newUserInfo = await this.userRepository.save(user);
      delete newUserInfo.password;
      return newUserInfo;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Такой пользователь уже существует');
      }
    }
  }

  async getOwnWishes(id: number) {
    const user = await this.userRepository.findOne({
      relations: {
        wishes: true,
      },
      where: {
        id: id,
      },
    });
    return user.wishes;
  }

  async getWishes(username: string) {
    const user = await this.userRepository.findOne({
      relations: {
        wishes: true,
        offers: true,
      },
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new BadRequestException('Такого пользователя не существует');
    }
    return user.wishes;
  }

  async findMany(query: string) {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }
}
