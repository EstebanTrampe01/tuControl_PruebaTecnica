import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  async healthcheck(): Promise<boolean> {
    await this.dataSource.query('SELECT 1');
    return true;
  }
}
