import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { jwtConfig } from 'src/configs/environment';
import { API_COMMON_MSG, API_ERROR_MSG } from 'src/configs/messages/api';
import type { JwtConfig } from 'src/configs/environment';
import { Token } from './interfaces/token';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: JwtConfig,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) throw new ConflictException(API_ERROR_MSG.EMAIL_ALREADY_EXISTS);

    const hashed = await bcrypt.hash(dto.password, 10);

    const newUser = await this.usersService.createUser({
      ...dto,
      password: hashed,
      role: Role.USER,
    });

    return { message: API_COMMON_MSG.SUCCESS, user: newUser };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException(API_ERROR_MSG.WRONG_EMAIL_OR_PASSWORD);

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match)
      throw new UnauthorizedException(API_ERROR_MSG.WRONG_EMAIL_OR_PASSWORD);

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      expires_in: this.jwtConfiguration.accessTokenTtl,
    };
  }

  private async generateTokens(user: User): Promise<Token> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.jwtConfiguration.refreshTokenTtl,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
