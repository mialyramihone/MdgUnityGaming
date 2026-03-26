import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  timestamp, 
  varchar, 
  boolean
} from 'drizzle-orm/pg-core';

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
  player1Id: varchar('player1_id', { length: 50 }),
  player1Name: varchar('player1_name', { length: 100 }),
  player2Id: varchar('player2_id', { length: 50 }),
  player2Name: varchar('player2_name', { length: 100 }),
  player3Id: varchar('player3_id', { length: 50 }),
  player3Name: varchar('player3_name', { length: 100 }),
  player4Id: varchar('player4_id', { length: 50 }),
  player4Name: varchar('player4_name', { length: 100 }),
  sub1Id: varchar('sub1_id', { length: 50 }),
  sub1Name: varchar('sub1_name', { length: 100 }),
  sub2Id: varchar('sub2_id', { length: 50 }),
  sub2Name: varchar('sub2_name', { length: 100 }),
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

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  matchNumber: integer('match_number').notNull(),
  matchGroup: varchar('match_group', { length: 1 }).notNull(), 
  tournamentId: integer('tournament_id').notNull().references(() => tournois.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const maps = pgTable('maps', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').notNull().references(() => matches.id, { onDelete: 'cascade' }),
  mapNumber: integer('map_number').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const mapResults = pgTable('map_results', {
  id: serial('id').primaryKey(),
  mapId: integer('map_id').notNull().references(() => maps.id, { onDelete: 'cascade' }),
  teamId: integer('team_id').notNull().references(() => teams.id),
  position: integer('position').notNull(),
  kills: integer('kills').notNull().default(0),
  booyah: boolean('booyah').default(false),
  points: integer('points').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rankings = pgTable('rankings', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  totalPoints: integer('total_points').notNull().default(0),
  totalKills: integer('total_kills').notNull().default(0),
  totalBooyahs: integer('total_booyahs').notNull().default(0),
  matchesPlayed: integer('matches_played').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types
export type Tournoi = typeof tournois.$inferSelect;
export type NewTournoi = typeof tournois.$inferInsert;
export type Joueuse = typeof joueuses.$inferSelect;
export type NewJoueuse = typeof joueuses.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamPlayer = typeof teamPlayers.$inferSelect;
export type NewTeamPlayer = typeof teamPlayers.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
export type Map = typeof maps.$inferSelect;
export type NewMap = typeof maps.$inferInsert;
export type MapResult = typeof mapResults.$inferSelect;
export type NewMapResult = typeof mapResults.$inferInsert;
export type Ranking = typeof rankings.$inferSelect;
export type NewRanking = typeof rankings.$inferInsert;