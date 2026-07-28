import { Controller, Post, Body, Get, Req, Patch, Param } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return this.usersService.getMyFullProfile(
      (req.user as { userId: string; email: string }).userId,
    );
  }
  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Body() dto: UpdateProfileDto, @Req() req: Request) {
    return this.usersService.updateProfile(
      (req.user as { userId: string; email: string }).userId,
      dto,
    );
  }
  @HttpCode(200)
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.usersService.verifyEmail(dto);
  }
}
