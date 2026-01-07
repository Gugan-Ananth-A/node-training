import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [join(process.cwd(), 'dist/**/*.entity.js')],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
