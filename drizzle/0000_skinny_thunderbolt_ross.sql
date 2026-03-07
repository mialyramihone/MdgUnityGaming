CREATE TABLE "joueuses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "joueuses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"compte_id" text NOT NULL,
	"pseudo_ingame" text NOT NULL,
	"pseudo_facebook" text NOT NULL,
	"pseudo_discord" text NOT NULL,
	"handcam" text DEFAULT 'Non',
	"tournoi_id" integer,
	"date_inscription" timestamp DEFAULT now(),
	CONSTRAINT "joueuses_compte_id_unique" UNIQUE("compte_id")
);

CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"method" varchar(20) NOT NULL,
	"reference" varchar(50) NOT NULL,
	"proof_image" text,
	"status" varchar(20) DEFAULT 'pending',
	"verified_at" timestamp,
	"verified_by" varchar(50),
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "scans" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"registration_code" varchar(20) NOT NULL,
	"scanned_at" timestamp DEFAULT now(),
	"status" varchar(20) DEFAULT 'valid',
	"scanned_by" varchar(50)
);

CREATE TABLE "team_players" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"joueuse_id" integer,
	"player_number" integer NOT NULL,
	"player_id" varchar(50) NOT NULL,
	"player_name" varchar(100) NOT NULL,
	"is_substitute" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_name" varchar(100) NOT NULL,
	"team_tag" varchar(20),
	"captain_name" varchar(100) NOT NULL,
	"captain_link" text NOT NULL,
	"captain_joueuse_id" integer,
	"registration_code" varchar(20) NOT NULL,
	"payment_method" varchar(20) NOT NULL,
	"payment_ref" varchar(50) NOT NULL,
	"payment_date" timestamp NOT NULL,
	"payment_image" text,
	"tournament_id" integer,
	"terms_accepted" boolean DEFAULT true,
	"rules_accepted" boolean DEFAULT true,
	"status" varchar(20) DEFAULT 'confirmed',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "teams_registration_code_unique" UNIQUE("registration_code")
);

CREATE TABLE "tournois" (
	"id" serial PRIMARY KEY NOT NULL,
	"titre" varchar(255) NOT NULL,
	"jeu" varchar(100) NOT NULL,
	"description" text,
	"format" varchar(50) NOT NULL,
	"cash_prize" varchar(50),
	"places" integer NOT NULL,
	"participants" integer DEFAULT 0,
	"date" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'ouvert',
	"date_creation" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_joueuse_id_joueuses_id_fk" FOREIGN KEY ("joueuse_id") REFERENCES "public"."joueuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_captain_joueuse_id_joueuses_id_fk" FOREIGN KEY ("captain_joueuse_id") REFERENCES "public"."joueuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_tournois_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournois"("id") ON DELETE no action ON UPDATE no action;