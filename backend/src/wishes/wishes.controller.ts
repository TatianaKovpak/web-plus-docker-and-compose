import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() { user }): Promise<Wish> {
    return this.wishesService.create(user.id, createWishDto);
  }

  @Get('top')
  findFirstWishes(): Promise<Wish[]> {
    return this.wishesService.findFirstWishes();
  }

  @Get('last')
  findLastWishes(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findWishById(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findWishById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ): Promise<Wish> {
    return this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() { user }) {
    return this.wishesService.remove(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() { user }) {
    return this.wishesService.copy(id, user.id);
  }
}
