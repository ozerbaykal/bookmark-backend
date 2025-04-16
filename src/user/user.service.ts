import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: number, body: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: {
        ...body,
      },
    });
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
  }
}
