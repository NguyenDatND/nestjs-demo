import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto, CreateUserPermissionDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { Permissions, Roles } from 'src/common/decorators';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions('USER_CREATE')
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get('user-permissions')
  getUserPermissions(
    @Query('userId') userId?: string,
    @Query('permissionId') permissionId?: string,
  ) {
    return this.usersService.getUsersByPermissions(userId, permissionId);
  }

  @Post('user-permissions')
  createUserPermissions(
    @Body() createUserPermissionDto: CreateUserPermissionDto,
  ) {
    return this.usersService.createUserPermissions(
      createUserPermissionDto.userId,
      createUserPermissionDto.permissionIds,
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Permissions('USER_UPDATE')
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.updateUser(id, user);
  }

  @Permissions('USER_DELETE')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
