import { pgTable, serial, text, integer, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';


export const tournois = pgTable('tournois', {
  id: serial('id').primaryKey(),
  titre: varchar('titre', { length: 255 }).notNull(),
  jeu: varchar('jeu', { length: 100 }).notNull(),
  description: text('description'),
  format: varchar('format', { length: 50 }).notNull(),
  cash_prize: varchar('cash_prize', { length: 50 }),
  places: integer('places').notNull(),
  participants: integer('participants').default(0),
  date: timestamp('date').notNull(),
  status: varchar('status', { length: 20 }).default('ouvert'),
  date_creation: timestamp('date_creation').defaultNow(),
});


export const joueuses = pgTable('joueuses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  compte_id: text('compte_id').unique().notNull(),
  pseudo_ingame: text('pseudo_ingame').notNull(),
  pseudo_facebook: text('pseudo_facebook').notNull(),
  pseudo_discord: text('pseudo_discord').notNull(),
  handcam: text('handcam').default('Non'),
  tournoi_id: integer('tournoi_id').references(() => tournois.id),
  date_inscription: timestamp('date_inscription').defaultNow(),
});


export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  teamName: varchar('team_name', { length: 100 }).notNull(),
  teamTag: varchar('team_tag', { length: 20 }),
  captainName: varchar('captain_name', { length: 100 }).notNull(),
  captainLink: text('captain_link').notNull(),
  registrationCode: varchar('registration_code', { length: 20 }).unique().notNull(),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(),
  paymentRef: varchar('payment_ref', { length: 50 }).notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  paymentImage: text('payment_image'),
  tournamentId: integer('tournament_id').references(() => tournois.id).notNull(),
  termsAccepted: boolean('terms_accepted').default(true),
  rulesAccepted: boolean('rules_accepted').default(true),
  status: varchar('status', { length: 20 }).default('confirmed'),
  createdAt: timestamp('created_at').defaultNow(),
});


export const teamPlayers = pgTable('team_players', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  playerNumber: integer('player_number').notNull(),
  playerId: varchar('player_id', { length: 50 }).notNull(),
  playerName: varchar('player_name', { length: 100 }).notNull(),
  isSubstitute: boolean('is_substitute').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});


// Types
export type Tournoi = typeof tournois.$inferSelect;
export type NewTournoi = typeof tournois.$inferInsert;
export type Joueuse = typeof joueuses.$inferSelect;
export type NewJoueuse = typeof joueuses.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;