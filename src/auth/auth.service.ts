import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    try {
      const user = await this.usersRepository.findOneBy({
        email: createAuthDto.email,
      });
      if (user == null) {
        throw new NotFoundException('Não Encontramos seu usuário no sistema');
      }
      const isMatch = await bcrypt.compare(
        createAuthDto.password,
        user.password,
      );
      if (isMatch) {
        const payload = {
          sub: user.id,
          secrete: `${user.email}${user.password}`,
        };
        delete user.password;
        return {
          user,
          access_token: await this.jwtService.signAsync(payload),
        };
      }

      if (!isMatch)
        throw new UnauthorizedException(
          'Falha em autenticar o usuário, verifique as credênciais',
        );
      return user;
    } catch (error) {
      if (error.status == 404) {
        throw new NotFoundException('Não Encontramos seu usuário no sistema');
      } else {
        throw new UnauthorizedException(
          'Falha em autenticar o usuário, verifique as credênciais',
        );
      }
    }
  }
}
