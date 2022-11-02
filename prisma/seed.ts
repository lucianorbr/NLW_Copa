import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Luciano',
      email: 'luciano@gmail.com.br',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Pool 1',
      code: '123456',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-30T18:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-29T18:00:00.201Z',
      firstTeamCountryCode: 'AR',
      secondTeamCountryCode: 'US',

      guesses: {
        create: {
          firstTeamPoints: 1,
          secondTeamPoints: 2,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    }
  })
}

main()