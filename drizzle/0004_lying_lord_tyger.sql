ALTER TABLE "projects" RENAME COLUMN "created_by" TO "createdBy";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "isPublished" boolean DEFAULT false NOT NULL;