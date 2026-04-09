import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    };
  }
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'tucontrol_user',
    password: process.env.DB_PASSWORD ?? 'tucontrol_pass',
    database: process.env.DB_NAME ?? 'tucontrol',
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
  };
}