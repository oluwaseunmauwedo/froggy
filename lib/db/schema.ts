import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => projects.id),
  role: varchar("role").notNull(),
  parts: jsonb("parts").notNull(),
  attachments: jsonb("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => projects.id),
  name: text("name").notNull(),
  code: text("code").notNull(),
  isPublished: boolean("isPublished").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const activityEvents = pgTable("activityEvents", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activityId")
    .notNull()
    .references(() => activities.id),
  event: text("event").notNull(),
  data: jsonb("data"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
