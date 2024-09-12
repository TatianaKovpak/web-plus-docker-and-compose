import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class DatabaseConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configServise: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configServise.get<string>('database.host'),
      port: this.configServise.get<number>('database.port'),
      username: this.configServise.get<string>('database.user'),
      password: this.configServise.get<string>('database.password'),
      database: this.configServise.get<string>('database.name'),
      entities: [join(__dirname, '../**/*.entity{.js, .ts}')],
      synchronize: true,
    };
  }
}
