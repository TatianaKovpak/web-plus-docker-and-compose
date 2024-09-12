import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId) {
    const user = await this.usersService.findOwn(userId);
    const wish = await this.wishesService.findWishById(createOfferDto.itemId);

    if (wish.owner.id === user.id) {
      throw new BadRequestException('Нельзя скидываться на свои подарки');
    }
    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new BadRequestException('Сумма больше, чем остаток сбора');
    }

    await this.wishesService.updateWishRaised(createOfferDto.itemId, {
      raised: Number(wish.raised) + createOfferDto.amount,
    } as UpdateWishDto);

    return this.offerRepository.save({
      ...createOfferDto,
      user,
      item: wish,
    });
  }

  async findAll() {
    return this.offerRepository.find({
      where: {
        user: true,
        item: true,
      },
    });
  }

  async findOfferById(id: number) {
    return await this.offerRepository.findOneBy({ id });
  }
}
