import { createId } from '@paralleldrive/cuid2'
import { and, eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { db } from '@/db/connection'
import { voteTable } from '@/db/schema'
import { redis } from '@/lib/redis'
import { voting } from '@/utils/voting-pub-sub'

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().cuid2(),
    })

    const voteOnPollParams = z.object({
      pollId: z.string().cuid2(),
    })

    const { pollId } = voteOnPollParams.parse(request.params)
    const { pollOptionId } = voteOnPollBody.parse(request.body)

    let { sessionId } = request.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await db.query.voteTable.findFirst({
        where: and(
          eq(voteTable.sessionId, sessionId),
          eq(voteTable.pollId, pollId),
        ),
      })

      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        await db
          .delete(voteTable)
          .where(eq(voteTable.id, userPreviousVoteOnPoll.id))

        const votes = await redis.zincrby(
          pollId,
          -1,
          userPreviousVoteOnPoll.pollOptionId,
        )

        voting.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(votes),
        })
      } else if (userPreviousVoteOnPoll) {
        return reply
          .status(400)
          .send({ message: 'You have already voted on this poll' })
      }
    }

    if (!sessionId) {
      sessionId = createId()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      })
    }

    await db.insert(voteTable).values({
      sessionId,
      pollId,
      pollOptionId,
    })

    const votes = await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes),
    })

    return reply.status(201).send()
  })
}
