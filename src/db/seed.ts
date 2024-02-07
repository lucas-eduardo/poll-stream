import { createId } from '@paralleldrive/cuid2'

import { db } from './connection'
import { pollOptionTable, pollTable, voteTable } from './schema'

async function exec() {
  await db.delete(voteTable)
  await db.delete(pollOptionTable)
  await db.delete(pollTable)

  console.log('✔ Database reset')

  const [poll] = await db
    .insert(pollTable)
    .values([{ title: 'Qual a melhor linguagem de programação?' }])
    .returning()

  console.log('✔ Created poll')

  const [javascript] = await db
    .insert(pollOptionTable)
    .values([
      { pollId: poll.id, title: 'JavaScript' },
      { pollId: poll.id, title: 'Java' },
      { pollId: poll.id, title: 'PHP' },
      { pollId: poll.id, title: 'C#' },
    ])
    .returning()

  console.log('✔ Created poll options')

  await db.insert(voteTable).values({
    pollId: poll.id,
    pollOptionId: javascript.id,
    sessionId: createId(),
  })

  console.log('✔ Created vote')

  console.log('Database seeded successfully!')

  process.exit()
}

exec()
