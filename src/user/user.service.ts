import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}


  async me(userId: number) {
    return await this.userRepo.me(userId)
  }
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
    return this.userRepo.create(createUserDto);
  }
  findAll() {
    return this.userRepo.findAll();
  }

  findOne(id: number) {
    return this.userRepo.findOne(id);
  }

  async findOneByEmail(email: string) {
    return this.userRepo.findOneByEmail(email);
  }
  async changePassword(id: number, password: string) {
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepo.update(id, { password: hashedPassword });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  delete(id: number) {
    return this.userRepo.delete(id);
  }

  banUser(id: number) {
    return this.userRepo.banUser(id);
  }

  unbanUser(id: number) {
    return this.userRepo.unbanUser(id);
  }
}
