import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  // validate fonksiyonu,tokenin doğru olduğunu kontrol eder ve içerisindeki verilere erişir
  async validate(payload: { sub: number; email: string }) {
    //kullanının id sine göre veritabanından kullanıcıyı bulur
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    //kullanıcı bulunamazsa hata döner
    if (!user) {
      throw new UnauthorizedException();
    }
    //kullanıcının hash bilgisini gizler
    const { hash, ...result } = user;
    //kullanıcının bilgilerini döner //request içine kullanıcı bilgilerini burada koyuyoruz
    return result;
  }
}
