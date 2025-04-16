import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getUsers(@GetUser() user: User) {
    return user;
  }
  //@GetUser("id") ile kullanıcının id sini alıyoruz
  //@Body ile kullanıcının bilgilerini alıyoruz
  //EditUserDto ile body içindeki bilgileri kontrol ediyoruz
  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  updateUser(@Body() body: EditUserDto, @GetUser('id') id: number) {
    return this.userService.updateUser(id, body);
  }
}
('');
