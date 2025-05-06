import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "@hono/zod-openapi";

const userEventsKind = [
  "user-created",
  "user-update-paymnets",
  "user-has-late-payments",
  "user-update-role",
  "user-deleted",
] as const;
const roomEventsKind = [
  "room-created",
  "room-update-tenant",
  "room-update-rent",
  "room-deleted",
] as const;
const complaintEventsKind = [
  "complaint-created",
  "complaint-updated-is-resolved",
  "complaint-deleted",
] as const;

const eventsKind = [
  ...userEventsKind,
  ...roomEventsKind,
  ...complaintEventsKind,
] as const;

const webhooksTable = sqliteTable("webhooks", {
  id: text("id").primaryKey(),
  eventKind: text("event_kind", { enum: eventsKind }).notNull(),
  url: text("url").notNull(),
});

const eventKindSchema = z.enum(eventsKind);
const userEventKindSchema = z.enum(userEventsKind);
const roomEventKindSchema = z.enum(roomEventsKind);
const complaintEventKindSchema = z.enum(complaintEventsKind);

type TEventKind = z.infer<typeof eventKindSchema>;
type TUserEventKind = z.infer<typeof userEventKindSchema>;
type TRoomEventKind = z.infer<typeof roomEventKindSchema>;
type TComplaintEventKind = z.infer<typeof complaintEventKindSchema>;

export {
  complaintEventKindSchema,
  eventsKind,
  roomEventKindSchema,
  type TComplaintEventKind,
  type TEventKind,
  type TRoomEventKind,
  type TUserEventKind,
  userEventKindSchema,
  webhooksTable,
};
