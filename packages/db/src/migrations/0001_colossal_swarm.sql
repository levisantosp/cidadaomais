CREATE TABLE "entity_unit" (
	"id" bigint PRIMARY KEY NOT NULL,
	"entity_id" bigint NOT NULL,
	"name" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entity" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "entity" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "entity" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "entity" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "entity_unit" ADD CONSTRAINT "entity_unit_entity_id_entity_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;