import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  // Mock cho prisma.user.{create, findMany, findUnique, update, delete}
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // dữ liệu giả dùng chung
  const fakeUser = {
    id: 'u1',
    email: 'a@example.com',
    name: 'A',
    role: Role.USER,
  };

  describe('createUser', () => {
    it('should call prisma.user.create and return created user', async () => {
      const dto: CreateUserDto = {
        email: 'a@example.com',
        name: 'A',
        password: 'pwd',
        role: Role.USER,
      };
      mockPrisma.user.create.mockResolvedValue(fakeUser);

      const result = await service.createUser(dto);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(fakeUser);
    });
  });

  describe('getUsers', () => {
    it('should return array of users from prisma', async () => {
      const list = [fakeUser];
      mockPrisma.user.findMany.mockResolvedValue(list);

      const result = await service.getUsers();

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(list);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(fakeUser);

      const result = await service.getUserById('u1');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
      });
      expect(result).toEqual(fakeUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('u2')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u2' },
      });
    });
  });

  describe('updateUser', () => {
    it('should call prisma.user.update and return updated user', async () => {
      const dto: UpdateUserDto = { name: 'B' };
      const updated = { ...fakeUser, name: 'B' };
      mockPrisma.user.update.mockResolvedValue(updated);

      const result = await service.updateUser('u1', dto);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: dto,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('deleteUser', () => {
    it('should call prisma.user.delete and return deleted user', async () => {
      mockPrisma.user.delete.mockResolvedValue(fakeUser);

      const result = await service.deleteUser('u1');

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'u1' },
      });
      expect(result).toEqual(fakeUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(fakeUser);

      const result = await service.findByEmail('a@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'a@example.com' },
      });
      expect(result).toEqual(fakeUser);
    });

    it('should return null when not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' },
      });
      expect(result).toBeNull();
    });
  });
});
