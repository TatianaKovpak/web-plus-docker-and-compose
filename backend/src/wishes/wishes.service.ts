import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository, In } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(id: number, createWishDto: CreateWishDto) {
    const user = await this.userService.findOwn(id);
    return this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  async findWishById(id: number) {
    const wish = this.wishRepository.findOne({
      relations: {
        offers: {
          user: true,
        },
        owner: true,
      },
      where: { id },
    });
    if (!wish) {
      throw new BadRequestException('Такого подарка нет');
    }
    return wish;
  }

  async findFirstWishes() {
    const wishes: Wish[] = await this.wishRepository.find({
      order: {
        copied: 'desc',
      },
      take: 20,
    });
    return wishes;
  }

  async findLastWishes() {
    const wishes: Wish[] = await this.wishRepository.find({
      order: {
        createdAt: 'desc',
      },
      take: 40,
    });
    return wishes;
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId,
  ): Promise<Wish> {
    const wish = await this.findWishById(id);
    if (wish.offers.length > 0 && updateWishDto.price > 0) {
      throw new BadRequestException(
        'Нельзя изменить стоимость подарка, на который уже скинулись',
      );
    }
    if (wish.owner.id !== userId) {
      throw new BadRequestException('Нельзя редактировать чужие подарки');
    }
    await this.wishRepository.update(id, updateWishDto);
    return wish;
  }

  async updateWishRaised(
    id: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findWishById(id);
    await this.wishRepository.update(id, updateWishDto);
    return wish;
  }

  async remove(id: number, user) {
    const wish = await this.findWishById(id);
    if (wish.raised > 0) {
      throw new BadRequestException(
        'Нельзя удалить подарок, на который уже скинулись',
      );
    }

    if (wish.owner.id !== user.id) {
      throw new BadRequestException('Нельзя удалять чужие подарки');
    }
    await this.wishRepository.remove(wish);
    return wish;
  }

  async copy(wishId: number, userId) {
    const { id, copied, link, ...CreateWishDto } =
      await this.findWishById(wishId);
    const owner = await this.userService.findOwn(userId);
    const wishes = await this.userService.getOwnWishes(userId);
    if (wishes.find((i) => i.link === link)) {
      throw new BadRequestException(
        ' В вашем списке желаний уже есть такой подарок',
      );
    }
    await this.wishRepository.update(id, { copied: copied + 1 });
    return this.wishRepository.save({
      ...CreateWishDto,
      raised: 0,
      owner,
      link,
    });
  }

  async findAllWishes(id: number[]) {
    return this.wishRepository.find({
      where: { id: In(id) },
    });
  }
}
