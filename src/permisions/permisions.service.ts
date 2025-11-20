import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermisionDto } from './dto/create-permision.dto';
import { UpdatePermisionDto } from './dto/update-permision.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermisionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermisionDto: CreatePermisionDto) {
    return this.prisma.permission.create({
      data: createPermisionDto,
    });
  }

  async findAll() {
    const permissions = await this.prisma.permission.findMany();
    return permissions;
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(id: string, updatePermisionDto: UpdatePermisionDto) {
    return this.prisma.permission.update({
      where: { id },
      data: updatePermisionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
