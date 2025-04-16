import { Bookmark } from './../../node_modules/.prisma/client/index.d';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getBookmarks(@GetUser('id') userId: number) {
    const bookmarks = await this.bookmarkService.getBookmarks(userId);
    if (!bookmarks || bookmarks.length === 0) {
      throw new NotFoundException('No bookmarks found');
    }
    return bookmarks;
  }
  //belirli bir bookmark'ı getirmek için
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: string,
  ) {
    const bookmark = await this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    return bookmark;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() body: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: string,
    @Body() body: EditBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
