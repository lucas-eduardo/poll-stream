import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'

import { pollTable } from './poll'
import { voteTable } from './vote'

export const pollOptionTable = pgTable('poll-options', {
  id: text('id').primaryKey().$defaultFn(createId),
  pollId: text('poll_id')
    .references(() => pollTable.id)
    .notNull(),
  title: text('title').notNull(),
})

export const pollOptionsRelations = relations(
  pollOptionTable,
  ({ one, many }) => ({
    poll: one(pollTable, {
      fields: [pollOptionTable.pollId],
      references: [pollTable.id],
    }),
    votes: many(voteTable),
  }),
)
