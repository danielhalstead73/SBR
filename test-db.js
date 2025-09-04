const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Check users
    const users = await prisma.user.findMany()
    console.log(`📊 Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`)
    })
    
    // Check organizations
    const organizations = await prisma.organization.findMany()
    console.log(`📊 Found ${organizations.length} organizations:`)
    organizations.forEach(org => {
      console.log(`  - ${org.name}`)
    })
    
    // Check events
    const events = await prisma.event.findMany()
    console.log(`📊 Found ${events.length} events:`)
    events.forEach(event => {
      console.log(`  - ${event.title} (${event.type})`)
    })
    
    // Check board games
    const boardGames = await prisma.boardGame.findMany()
    console.log(`📊 Found ${boardGames.length} board games:`)
    boardGames.forEach(game => {
      console.log(`  - ${game.name} (BGG ID: ${game.bggId})`)
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
