import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true, length: 50 })
  username?: string;

  @Column({ unique: true, length: 100 })
  email?: string;

  @Column({ length: 255 })
  password?: string;

  @Column({ default: true })
  isActive?: boolean;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}