import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    try {
      // Generate password hash
      const hash = await argon.hash(dto.password);

      // Save new user to the database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      // Return the generated token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user doesn't exist, throw exception
    if (!user) throw new ForbiddenException('Invalid credentials');

    // Verify password
    const passwordMatches = await argon.verify(user.hash, dto.password);

    // If password is incorrect, throw exception
    if (!passwordMatches) throw new ForbiddenException('Invalid credentials');

    // Return the generated token
    const tokens = await this.signToken(user.id, user.email);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout() {
    // JWT is stateless, so technically there's no server-side logout
    // Client-side should remove the token
    return { message: 'Logged out successfully' };
  }

  async refresh(userId: number, email: string) {
    return this.signToken(userId, email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }
}
