import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      name: 'Admin',
      password: await bcrypt.hash('123456', 10),
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      name: 'User',
      password: await bcrypt.hash('123456', 10),
      role: 'USER',
    },
  });

  console.log('Seed thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
