import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["OWNER", "ADMIN", "MEMBER"]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "DRAFT",
  "OPEN",
  "PAID",
  "VOID",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    role: roleEnum("role").notNull().default("MEMBER"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
  },
  (t) => [
    uniqueIndex("memberships_user_org_unique").on(t.userId, t.organizationId),
    index("memberships_org_idx").on(t.organizationId),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("projects_org_idx").on(t.organizationId)],
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hash: text("hash").notNull().unique(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    lastUsedAt: timestamp("last_used_at"),
    expiresAt: timestamp("expires_at"),
  },
  (t) => [index("api_keys_project_idx").on(t.projectId)],
);

export const webhooks = pgTable(
  "webhooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    secret: text("secret").notNull(),
    events: text("events").array().notNull(),
    active: boolean("active").notNull().default(true),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (t) => [index("webhooks_project_idx").on(t.projectId)],
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    number: text("number").notNull().unique(),
    status: invoiceStatusEnum("status").notNull().default("DRAFT"),
    amountCents: integer("amount_cents").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    issuedAt: timestamp("issued_at").notNull().defaultNow(),
    paidAt: timestamp("paid_at"),
  },
  (t) => [index("invoices_org_status_idx").on(t.organizationId, t.status)],
);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  plan: text("plan").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  organizationId: uuid("organization_id")
    .notNull()
    .unique()
    .references(() => organizations.id, { onDelete: "cascade" }),
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: text("action").notNull(),
    payload: jsonb("payload").notNull(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("audit_logs_org_created_idx").on(t.organizationId, t.createdAt)],
);

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  auditLogs: many(auditLogs),
}));

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  memberships: many(memberships),
  projects: many(projects),
  invoices: many(invoices),
  auditLogs: many(auditLogs),
  subscription: one(subscriptions),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [memberships.organizationId],
    references: [organizations.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  apiKeys: many(apiKeys),
  webhooks: many(webhooks),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  project: one(projects, {
    fields: [apiKeys.projectId],
    references: [projects.id],
  }),
}));

export const webhooksRelations = relations(webhooks, ({ one }) => ({
  project: one(projects, {
    fields: [webhooks.projectId],
    references: [projects.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
}));
