import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}
