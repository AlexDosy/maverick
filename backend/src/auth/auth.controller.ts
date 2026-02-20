import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout((req.user as any).userId);
  }

}
