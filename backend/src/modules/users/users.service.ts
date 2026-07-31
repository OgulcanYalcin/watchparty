import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, UserStatus } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          emailVerificationCode: code,
          emailVerificationExpiresAt: expiresAt,
          passwordHash: hashedPassword,
        },
      });
      await this.sendVerificationEmail(dto.email, code);
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Bu e-posta adresi zaten kayıtlı');
      }
      throw error;
    }
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
    if (!user.emailVerified) {
      throw new ForbiddenException('Lütfen önce e-postanı doğrula');
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
        theme: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Kullanıcı Bulunamadı');
    }
    return user;
  }

  async getUserCount() {
    return this.prismaService.user.count();
  }

  private async sendVerificationEmail(email: string, code: string) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Watch Party <noreply@mail.ogulcnyalcin.com>',
        to: email,
        subject: 'E-posta Doğrulama Kodun',
        html: `<p>Watch Part'e hoş geldin! Doğrulama kodun: <b>${code}</b></p><p>Bu kod 15 dakika geçerlidir.</p>`,
      }),
    });
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new NotFoundException('Kullanıcı Bulunamadı');
    }
    if (user.emailVerified) {
      throw new ConflictException('e-posta zaten doğrulanmış');
    }
    if (
      user.emailVerificationCode !== dto.code ||
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Kod geçersiz veya süresi dolmuş');
    }
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationCode: null,
        emailVerificationExpiresAt: null,
      },
    });
    return { message: 'E-posta doğrulandı' };
  }
}
