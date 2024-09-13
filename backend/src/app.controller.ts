import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('crash-test')
  crashTest(@Res() res: Response) {
    console.log('Crashing the server...');
    process.exit(1);
    return res.status(HttpStatus.OK).send('Server crashed');
  }
}
