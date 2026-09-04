import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
  const existingUser = await this.userRepository.findOne({
    where: [
      { username: createUserDto.username },
      { email: createUserDto.email },
    ],
  });

  if (existingUser) {
    throw new ConflictException(
      'El usuario o correo electrónico ya está registrado',
    );
  }

  const role = await this.roleRepository.findOne({
    where: { id: createUserDto.roleId },
  });

  if (!role) {
    throw new NotFoundException(
      `Rol con ID ${createUserDto.roleId} no encontrado`,
    );
  }

  const user = this.userRepository.create({
    username: createUserDto.username,
    email: createUserDto.email,
    password: createUserDto.password,
    role: role,
  });

  return this.userRepository.save(user);
}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: {
        role: true,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);
  }
}