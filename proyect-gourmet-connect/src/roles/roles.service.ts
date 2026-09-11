import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(name: string, description?: string): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name },
    });

    if (existingRole) {
      throw new ConflictException(`El rol "${name}" ya existe`);
    }

    const role = this.roleRepository.create({
      name,
      description,
    });

    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return role;
  }

  async update(id: number, name?: string, description?: string): Promise<Role> {
    const role = await this.findOne(id);

    if (name && name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name },
      });

      if (existingRole) {
        throw new ConflictException(`El rol "${name}" ya existe`);
      }
    }

    if (name !== undefined) {
      role.name = name;
    }

    if (description !== undefined) {
      role.description = description;
    }

    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    await this.roleRepository.remove(role);
  }
}
