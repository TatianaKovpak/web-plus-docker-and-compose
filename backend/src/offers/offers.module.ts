import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), UsersModule, WishesModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
