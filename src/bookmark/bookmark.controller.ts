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
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

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
  createBookmark(
    @GetUser('id') userId: number,
    @Body() body: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, body);
  }
  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: string,
    @Body() body: EditBookmarkDto,
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
