import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }
  getBookmarkById(userId: number, bookmarkId: string) {
    return this.prisma.bookmark.findUnique({
      where: { id: parseInt(bookmarkId), userId },
    });
  }
  async createBookmark(userId: number, body: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...body,
      },
    });

    return bookmark;
  }
  async updateBookmark(
    userId: number,
    bookmarkId: string,
    body: EditBookmarkDto,
  ) {
    //güncellemek istediğimiz bookmark'ı buluyoruz
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: parseInt(bookmarkId) },
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    if (bookmark.userId !== userId) {
      throw new ForbiddenException('İçeriğe erişim reddedildi');
    }

    //bookmark'ı güncelliyoruz
    const updatedBookmark = await this.prisma.bookmark.update({
      where: { id: parseInt(bookmarkId) },
      data: { ...body },
    });
    //güncellenen bookmark'ı döndürüyoruz
    return updatedBookmark;
  }
  async deleteBookmark(userId: number, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: parseInt(bookmarkId) },
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    if (bookmark.userId !== userId) {
      throw new ForbiddenException('İçeriğe erişim reddedildi');
    }
    await this.prisma.bookmark.delete({
      where: { id: parseInt(bookmarkId) },
    });
    return { message: 'Bookmark deleted successfully' };
  }
}
