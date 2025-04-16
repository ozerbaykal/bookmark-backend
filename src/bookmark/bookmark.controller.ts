import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }
  @Get(':id')
  getBookmarkById(@Param('id') bookmarkId: string) {
    return this.bookmarkService.getBookmarkById(bookmarkId);
  }
  @Post()
  createBookmark(@GetUser('id') userId: number, @Body() body: any) {
    return this.bookmarkService.createBookmark(userId, body);
  }
  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: string,
    @Body() body: any,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, body);
  }
  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
