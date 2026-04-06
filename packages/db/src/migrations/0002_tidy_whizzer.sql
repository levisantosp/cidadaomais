CREATE TYPE "public"."AuditAction" AS ENUM('Create', 'Update', 'Delete');--> statement-breakpoint
CREATE TABLE "audit" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"entity_id" bigint,
	"entity" text NOT NULL,
	"action" "AuditAction" NOT NULL,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit" ADD CONSTRAINT "audit_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit" ADD CONSTRAINT "audit_entity_id_entity_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entity"("id") ON DELETE set null ON UPDATE no action;