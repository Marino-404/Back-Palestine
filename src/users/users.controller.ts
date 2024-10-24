import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userData: User) {
    return this.usersService.create(userData);
  }

  @Post('sendEmailToAll')
  sendEmailToAll(
    @Body() { subject, message }: { subject: string; message: string },
  ) {
    return this.usersService.sendEmailToAll({ subject, message });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedUserData: User) {
    return this.usersService.update(Number(id), updatedUserData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(id);
    const res=this.usersService.remove(Number(id))
    console.log(res)
    return res
  }
}
