import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { Role } from "@prisma/client";


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  private async generateTokens(userId: string, role: Role) {
    const accessToken = this.jwtService.sign(
      { sub: userId, role },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } =
      await this.generateTokens(user.id, user.role);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string };

    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, role: user.role },
      { expiresIn: '15m' },
    );

    return { accessToken };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }



}
