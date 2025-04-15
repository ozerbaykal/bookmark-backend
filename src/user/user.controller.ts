import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getUsers() {
    return this.userService.getUsers();
  }

  @Patch('/update')
  updateUser(@Body() body: any) {
    return this.userService.updateUser(body);
  }
}
