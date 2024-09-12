import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, userId) {
    const user = await this.usersService.findOwn(userId);
    const wishes = await this.wishesService.findAllWishes(
      createWishlistDto.itemsId,
    );

    return this.wishlistRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
  }

  async findOne(id: number) {
    return this.wishlistRepository.findOne({
      relations: {
        items: true,
        owner: true,
      },
      where: {
        id,
      },
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user) {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException(
        'Вы не можете изменять чужой список желаний',
      );
    }

    await this.wishlistRepository.save({ id, ...updateWishlistDto });
    return { ...wishlist, ...updateWishlistDto };
  }

  async remove(id: number, user) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException(
        'Вы не можете удалять чужой список желаний',
      );
    }
    return this.wishlistRepository.delete({
      id,
    });
  }

  async findAll(user) {
    return await this.wishlistRepository.findBy({ owner: { id: user.id } });
  }
}
