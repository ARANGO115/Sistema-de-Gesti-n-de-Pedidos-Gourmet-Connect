import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password?: string;

  @IsInt()
  @Min(1)
  roleId?: number;
}
