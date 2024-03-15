import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const created_at = new Date();
      const date = created_at.toLocaleDateString();
      const hour = created_at.toLocaleTimeString();
      const hash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
      createUserDto.password = hash;
      createUserDto.created_at = `${date} ${hour}`;
      const response = await this.userRepository.insert(createUserDto);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async findAll() {
    try {
      const response = this.userRepository.find();
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.userRepository.findOneBy({ id });
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const update_at = new Date();
      const date = update_at.toLocaleDateString();
      const hour = update_at.toLocaleTimeString();

      const user = await this.userRepository.findOneBy({ id });
      user.updated_at = `${date} ${hour}`;
      if (updateUserDto.password != '' && updateUserDto.password != undefined) {
        const hash = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
        user.password = hash;
      }
      user.name =
        updateUserDto.name != undefined ? updateUserDto.name : user.name;
      user.email =
        updateUserDto.email != undefined ? updateUserDto.email : user.email;
      const response = await this.userRepository.save(user);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }

  async remove(id: number) {
    try {
      const response = await this.userRepository.delete({ id });
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: 400,
      });
    }
  }
}
