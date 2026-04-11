import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchesRepository {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
  ) {}

  findAll() {
    return this.branchesRepository.find({
      order: { id: 'ASC' },
    });
  }
}
