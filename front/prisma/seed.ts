import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // const password = await hash('ardian1234', 12)
  // const user = await prisma.user.upsert({
  //   where: { email: 'ah54088@ubt-uni.net' },
  //   update: {},
  //   create: {
  //     email: 'ah54088@ubt-uni.net',
  //     name: 'Ardian',
  //     password,
  //     role: 'ADMIN'
  //   }
  // })
  const password = await hash('armira1234', 12)
  const user = await prisma.user.upsert({
    where: { email: 'ak51925@ubt-uni.net' },
    update: {},
    create: {
      email: 'ak51925@ubt-uni.net',
      name: 'Armira',
      password,
      role: 'ADMIN'
    }
  })
  console.log({ user })
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })