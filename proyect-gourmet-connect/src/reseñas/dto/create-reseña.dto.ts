import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  userId!: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  productId!: number;
}
