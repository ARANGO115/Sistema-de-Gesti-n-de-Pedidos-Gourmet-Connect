import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/reseñas.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity/product.entity';
import { CreateReviewDto } from './dto/create-reseña.dto';
import { UpdateReviewDto } from './dto/update-reseña.dto';

@Injectable()
export class ReseñasService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOne({
      where: { id: createReviewDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${createReviewDto.userId} no encontrado`,
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: createReviewDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${createReviewDto.productId} no encontrado`,
      );
    }

    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user,
      product,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: {
        user: true,
        product: true,
      },
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }

    if (updateReviewDto.comment !== undefined) {
      review.comment = updateReviewDto.comment;
    }

    return this.reviewRepository.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}
