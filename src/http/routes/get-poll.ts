import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { db } from '@/db/connection'
import { pollTable } from '@/db/schema'
import { redis } from '@/lib/redis'

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().cuid2(),
    })

    const { pollId } = getPollParams.parse(request.params)

    const poll = await db.query.pollTable.findFirst({
      where: eq(pollTable.id, pollId),
      with: {
        options: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
      columns: {
        id: true,
        title: true,
      },
    })

    if (!poll) {
      return reply.status(500).send({ message: 'Poll not found.' })
    }

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

    const votes = result.reduce(
      (obj, line, index) => {
        if (index % 2 === 0) {
          const score = result[index + 1]

          Object.assign(obj, { [line]: Number(score) })
        }

        return obj
      },
      {} as Record<string, number>,
    )

    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => ({
          id: option.id,
          title: option.title,
          score: option.id in votes ? votes[option.id] : 0,
        })),
      },
    })
  })
}
