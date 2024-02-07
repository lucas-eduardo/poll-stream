import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { pollTable } from './poll'
import { pollOptionTable } from './poll-option'

export const voteTable = pgTable('votes', {
  id: text('id').primaryKey().$defaultFn(createId),
  pollId: text('poll_id')
    .references(() => pollTable.id)
    .notNull()
    .unique(),
  pollOptionId: text('poll_option_id')
    .references(() => pollOptionTable.id)
    .notNull()
    .unique(),
  sessionId: text('session_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const voteRelations = relations(voteTable, ({ one }) => ({
  pollId: one(pollTable, {
    fields: [voteTable.pollId],
    references: [pollTable.id],
  }),
  pollOption: one(pollOptionTable, {
    fields: [voteTable.pollOptionId],
    references: [pollOptionTable.id],
  }),
}))
