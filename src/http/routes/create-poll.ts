import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { db } from '@/db/connection'
import { pollOptionTable, pollTable } from '@/db/schema'

export async function createPoll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    })

    const { title, options } = createPollBody.parse(request.body)

    const [poll] = await db
      .insert(pollTable)
      .values({
        title,
      })
      .returning()

    await db
      .insert(pollOptionTable)
      .values(options.map((option) => ({ pollId: poll.id, title: option })))

    return reply.status(201).send({ pollId: poll.id })
  })
}
