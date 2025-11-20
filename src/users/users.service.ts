import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: CreateUserDto) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return new UserEntity(user);
  }

  async updateUser(id: string, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUserPermissions(userId: string, permissionIds: string[]) {
    await this.prisma.userPermission.createMany({
      data: permissionIds.map((permissionId) => ({
        userId,
        permissionId,
      })),
    });
    return {
      message: 'User permissions created successfully',
    };
  }

  async getUsersByPermissions(userId?: string, permissionId?: string) {
    const users = await this.prisma.user.findMany({
      where: {
        id: userId || undefined,

        userPermissions: permissionId
          ? {
              some: {
                permissionId: permissionId, // lọc theo permissionId
              },
            }
          : {
              some: {}, // không truyền permissionId thì chỉ lấy user có permissions
            },
      },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      userPermissions: user.userPermissions.map((up) => ({
        id: up.permission.id,
        name: up.permission.name,
      })),
    }));
  }
}
