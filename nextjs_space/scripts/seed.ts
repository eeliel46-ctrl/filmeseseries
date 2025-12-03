
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create the default test user
  const testUserEmail = 'john@doe.com'
  const testUserPassword = 'johndoe123'

  const existingTestUser = await prisma.user.findUnique({
    where: { email: testUserEmail }
  })

  if (!existingTestUser) {
    const hashedPassword = await bcrypt.hash(testUserPassword, 12)
    
    await prisma.user.create({
      data: {
        email: testUserEmail,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
      }
    })
    console.log(`✅ Created test user: ${testUserEmail}`)
  } else {
    console.log(`ℹ️  Test user already exists: ${testUserEmail}`)
  }

  // Create a sample demo user
  const demoUserEmail = 'user@streamflix.com'
  const demoUserPassword = 'streamflix123'

  const existingDemoUser = await prisma.user.findUnique({
    where: { email: demoUserEmail }
  })

  if (!existingDemoUser) {
    const hashedPassword = await bcrypt.hash(demoUserPassword, 12)
    
    const demoUser = await prisma.user.create({
      data: {
        email: demoUserEmail,
        password: hashedPassword,
        firstName: 'Stream',
        lastName: 'Flix',
        name: 'Stream Flix',
      }
    })

    // Add some sample favorites for the demo user
    const sampleFavorites = [
      {
        contentId: '238',
        contentType: 'movie',
        title: 'The Godfather',
        poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        year: '1972',
        rating: '9.2'
      },
      {
        contentId: '424',
        contentType: 'movie',
        title: "Schindler's List",
        poster: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
        year: '1993',
        rating: '8.9'
      },
      {
        contentId: '1399',
        contentType: 'series',
        title: 'Game of Thrones',
        poster: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
        year: '2011',
        rating: '9.3'
      },
      {
        contentId: '94605',
        contentType: 'series',
        title: 'Arcane',
        poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
        year: '2021',
        rating: '8.7'
      }
    ]

    for (const favorite of sampleFavorites) {
      await prisma.favorite.create({
        data: {
          userId: demoUser.id,
          ...favorite
        }
      })
    }

    console.log(`✅ Created demo user: ${demoUserEmail} with sample favorites`)
  } else {
    console.log(`ℹ️  Demo user already exists: ${demoUserEmail}`)
  }

  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
