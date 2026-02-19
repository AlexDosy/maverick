import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
  let authService: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
  });

  it("should return JWT token for valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      password: hashedPassword,
      role: "ADMIN",
    });

    const result = await authService.login({
      email: "test@test.com",
      password: "password123",
    });

    expect(result).toHaveProperty("accessToken");
    expect(typeof result.accessToken).toBe("string");
  });

  it("should throw if user does not exist", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.login({
        email: "missing@test.com",
        password: "password",
      }),
    ).rejects.toThrow();
  });

  it("should throw if password is invalid", async () => {
    const hashedPassword = await bcrypt.hash("correct-password", 10);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      password: hashedPassword,
      role: "USER",
    });

    await expect(
      authService.login({
        email: "test@test.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow();
  });
});
