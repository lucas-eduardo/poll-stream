import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { pollOptionTable } from './poll-option'
import { voteTable } from './vote'

export const pollTable = pgTable('polls', {
  id: text('id').primaryKey().$defaultFn(createId),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const pollTableRelations = relations(pollTable, ({ many }) => ({
  options: many(pollOptionTable),
  votes: many(voteTable),
}))
