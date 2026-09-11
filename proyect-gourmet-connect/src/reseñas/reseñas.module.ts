import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReseñasService } from './reseñas.service';
import { ReseñasController } from './reseñas.controller';
import { Review } from './entities/reseñas.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Product])],
  providers: [ReseñasService],
  controllers: [ReseñasController],
})
export class ReseñasModule {}
