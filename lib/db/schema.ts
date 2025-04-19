import { relations } from "drizzle-orm"
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  isOnboarded: boolean("is_onboarded").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  bio: text("bio"),
  skills: text("skills").array(),
  interests: text("interests").array(),
  location: text("location"),
  role: text("role"),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const contactInfo = pgTable("contact_info", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  email: text("email").notNull(),
  phone: text("phone"),
  linkedin: text("linkedin"),
  address: text("address"),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const connectionRequests = pgTable("connection_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromUserId: uuid("from_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  toUserId: uuid("to_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  contactInfo: one(contactInfo, {
    fields: [users.id],
    references: [contactInfo.userId],
  }),
  sentRequests: many(connectionRequests, {
    fields: [users.id],
    references: [connectionRequests.fromUserId],
  }),
  receivedRequests: many(connectionRequests, {
    fields: [users.id],
    references: [connectionRequests.toUserId],
  }),
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))

export const contactInfoRelations = relations(contactInfo, ({ one }) => ({
  user: one(users, {
    fields: [contactInfo.userId],
    references: [users.id],
  }),
}))

export const connectionRequestsRelations = relations(connectionRequests, ({ one }) => ({
  fromUser: one(users, {
    fields: [connectionRequests.fromUserId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [connectionRequests.toUserId],
    references: [users.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert

export type ContactInfo = typeof contactInfo.$inferSelect
export type NewContactInfo = typeof contactInfo.$inferInsert

export type ConnectionRequest = typeof connectionRequests.$inferSelect
export type NewConnectionRequest = typeof connectionRequests.$inferInsert
