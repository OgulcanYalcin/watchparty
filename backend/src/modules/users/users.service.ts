import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: hashedPassword,
      },
    });
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status !== UserStatus.ACTIVE) {
      if (user.status === UserStatus.SUSPENDED) {
        throw new ForbiddenException('Hesabınız Askıya Alındı');
      } else {
        throw new ForbiddenException('Hesabınız Yasaklandı');
      }
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    const { passwordHash, ...safeUser } = user;
    return { ...safeUser, accessToken: token };
  }

  async getPublicProfile(userId: string) {
    const profile = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        profilePicture: true,
        biography: true,
        reputationScore: true,
        createdAt: true,
      },
    });
    if (!profile) {
      throw new NotFoundException('Profil Bulunamadı');
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...dto },
    });
    const { passwordHash, ...safeUser } = profile;
    return { ...safeUser };
  }

  async getMyFullProfile(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        biography: true,
        reputationScore: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Kullanıcı Bulunamadı');
    }
    return user;
  }
}
