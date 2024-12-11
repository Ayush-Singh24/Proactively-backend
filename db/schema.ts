import { relations } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users_table",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    firstName: text().notNull(),
    lastName: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    userType: text({ enum: ["user", "speaker"] }).notNull(),
    status: text({ enum: ["verified", "not verified"] })
      .notNull()
      .default("not verified"),
  },
  (t) => [index("user").on(t.id), index("user").on(t.email)]
);

export const usersRelations = relations(users, ({ one, many }) => ({
  speaker: one(speakers),
  bookings: many(bookings),
  otp: one(otps),
}));

export const speakers = sqliteTable(
  "speakers_table",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    expertise: text(),
    pricePerSession: real(),
  },
  (t) => [index("speaker").on(t.id)]
);

export const speakersRelation = relations(speakers, ({ one, many }) => ({
  user: one(users, { fields: [speakers.userId], references: [users.id] }),
  bookings: many(bookings),
}));

export const bookings = sqliteTable(
  "bookings_table",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    speakerId: integer("speaker_id")
      .references(() => speakers.id)
      .notNull(),
    date: text().notNull(),
    slot: text({
      enum: [
        "9 AM - 10 AM",
        "10 AM - 11 AM",
        "11 AM - 12 PM",
        "12 PM - 1 PM",
        "1 PM - 2 PM",
        "2 PM - 3 PM",
        "3 PM - 4 PM",
      ],
    }).notNull(),
  },
  (t) => [index("bookings").on(t.id)]
);

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  speaker: one(speakers, {
    fields: [bookings.speakerId],
    references: [speakers.id],
  }),
}));

export const otps = sqliteTable(
  "otp_table",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    otp: integer({ mode: "number" }).notNull(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (t) => [index("otp").on(t.id)]
);

export const otpRelations = relations(otps, ({ one }) => ({
  user: one(users, { fields: [otps.userId], references: [users.id] }),
}));
