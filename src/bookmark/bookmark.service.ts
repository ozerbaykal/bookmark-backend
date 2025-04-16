import { Injectable } from '@nestjs/common';
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
  createBookmark(userId: number, body: CreateBookmarkDto) {}
  updateBookmark(userId: number, bookmarkId: string, body: EditBookmarkDto) {}
  deleteBookmark(userId: number, bookmarkId: string) {}
}
