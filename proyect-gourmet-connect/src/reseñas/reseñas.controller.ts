import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ReseñasService } from './reseñas.service';
import { CreateReviewDto } from './dto/create-reseña.dto';
import { UpdateReviewDto } from './dto/update-reseña.dto';

@Controller('resenas')
export class ReseñasController {
  constructor(private readonly reseñasService: ReseñasService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reseñasService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reseñasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reseñasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reseñasService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reseñasService.remove(id);
  }
}
