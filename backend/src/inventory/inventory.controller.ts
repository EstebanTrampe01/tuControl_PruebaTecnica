import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { GetInventoryQueryDto } from './dto/get-inventory-query.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(@Query() query: GetInventoryQueryDto) {
    return this.inventoryService.findAll(query);
  }

  @Put()
  upsert(@Body() payload: UpdateInventoryDto) {
    return this.inventoryService.upsert(payload);
  }
}
