import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const joueuses = pgTable('joueuses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  compte_id: text('compte_id').unique().notNull(),
  pseudo_ingame: text('pseudo_ingame').notNull(),
  pseudo_facebook: text('pseudo_facebook').notNull(),
  pseudo_discord: text('pseudo_discord').notNull(),
  handcam: text('handcam').default('Non'),
  tournoi_id: integer('tournoi_id'),
  date_inscription: timestamp('date_inscription').defaultNow(),
});