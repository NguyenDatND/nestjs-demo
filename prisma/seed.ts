import { Permission, PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    email: 'admin@gmail.com',
    name: 'Admin',
    password: '123456',
    role: 'ADMIN',
  },
  {
    email: 'user_1@gmail.com',
    name: 'User 1',
    password: '123456',
    role: 'USER',
  },
  {
    email: 'user_2@gmail.com',
    name: 'User 2',
    password: '123456',
    role: 'USER',
  },
];

const permissions: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'USER_CREATE' },
  { name: 'USER_READ' },
  { name: 'USER_UPDATE' },
  { name: 'USER_DELETE' },
];

const generateUsers = async () => {
  await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const userExists = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (!userExists) {
        await prisma.user.create({
          data: {
            ...user,
            password: hashedPassword,
          },
        });
      }
    }),
  );
  console.log('Seed users thành công!');
};

const generatePermissions = async () => {
  await Promise.all(
    permissions.map(async (permission) => {
      const permissionExists = await prisma.permission.findFirst({
        where: { name: permission.name },
      });

      if (!permissionExists) {
        await prisma.permission.create({
          data: permission,
        });
      }
    }),
  );

  console.log('Seed permissions thành công!');
};

async function main() {
  await generateUsers();
  await generatePermissions();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
