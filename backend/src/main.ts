import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CrashTestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/crash-test') {
      throw new HttpException(
        'Crash test triggered!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    next();
  }
}

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const crashTestMiddleware = new CrashTestMiddleware();
  app.use(crashTestMiddleware);

  await app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
}
bootstrap();
