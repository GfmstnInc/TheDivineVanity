# The Divine Vanity - Complete Codebase Export
*Generated: July 06, 2025*

## 1. PACKAGE.JSON

```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@jridgewell/trace-mapping": "^0.3.25",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "@replit/vite-plugin-cartographer": "^1.0.1",
    "@replit/vite-plugin-runtime-error-modal": "^1.0.0",
    "@sendgrid/mail": "^8.1.3",
    "@stripe/react-stripe-js": "^3.7.0",
    "@stripe/stripe-js": "^7.4.0",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.0.0-alpha.33",
    "@tanstack/react-query": "^5.60.5",
    "@types/bcrypt": "^5.0.2",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/memoizee": "^0.4.11",
    "@types/node": "^22.9.0",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "bcrypt": "^5.1.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^4.1.0",
    "drizzle-kit": "^0.30.0",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.3.0",
    "esbuild": "^0.24.0",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "framer-motion": "^11.11.9",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.454.0",
    "memoizee": "^0.4.17",
    "memorystore": "^1.6.7",
    "next-themes": "^0.4.3",
    "openai": "^5.8.2",
    "openid-client": "^6.1.5",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "postcss": "^8.4.49",
    "react": "^18.3.1",
    "react-day-picker": "^9.2.0",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.2",
    "react-icons": "^5.3.0",
    "react-resizable-panels": "^2.1.4",
    "recharts": "^2.12.7",
    "stripe": "^18.3.0",
    "tailwind-merge": "^2.5.3",
    "tailwindcss": "^3.4.14",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.19.2",
    "tw-animate-css": "^0.3.4",
    "typescript": "^5.6.3",
    "vaul": "^1.0.0",
    "vite": "^6.0.1",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0"
  }
}
```

## 2. VITE.CONFIG.TS

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

## 3. DRIZZLE.CONFIG.TS

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## 4. TAILWIND.CONFIG.TS

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'cream': '#FFFEF7',
        'soft-gray': '#F8F8F8',
        'divine-gold': '#D4AF37',
        'gold': '#D4AF37',
        'warm-beige': '#F5F0E8',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

## 5. POSTCSS.CONFIG.JS

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 6. TSCONFIG.JSON

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client/src", "shared", "server"]
}
```

## 7. COMPONENTS.JSON

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "client/src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## 8. SHARED/SCHEMA.TS

```typescript
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username"),
  passwordHash: varchar("password_hash"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionStatus: varchar("subscription_status").default("free"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isOnboarded: boolean("is_onboarded").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyRituals = pgTable("daily_rituals", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  audioUrl: text("audio_url"),
  category: varchar("category").default("daily"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  prompt: text("prompt"),
  entry: text("entry").notNull(),
  mood: varchar("mood"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const premiumContent = pgTable("premium_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // 'pdf', 'audio', 'video'
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: varchar("category"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chakraQuizResults = pgTable("chakra_quiz_results", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  answers: jsonb("answers").notNull(),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalXP: integer("total_xp").default(0),
  level: integer("level").default(1),
  journalEntries: integer("journal_entries").default(0),
  ritualsCompleted: integer("rituals_completed").default(0),
  assessmentsCompleted: integer("assessments_completed").default(0),
  lastActiveDate: date("last_active_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementType: varchar("achievement_type").notNull(),
  achievementName: varchar("achievement_name").notNull(),
  description: text("description"),
  progress: integer("progress").default(0),
  maxProgress: integer("max_progress").default(1),
  isUnlocked: boolean("is_unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ritualCompletions = pgTable("ritual_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  ritualDate: date("ritual_date").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const prayers = pgTable("prayers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name"),
  request: text("request").notNull(),
  isPublic: boolean("is_public").default(true),
  candleCount: integer("candle_count").default(0),
  prayerCount: integer("prayer_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prayerInteractions = pgTable("prayer_interactions", {
  id: serial("id").primaryKey(),
  prayerRequestId: integer("prayer_request_id").notNull().references(() => prayerRequests.id),
  userId: varchar("user_id").references(() => users.id),
  type: varchar("type").notNull(), // 'candle' or 'prayer'
  createdAt: timestamp("created_at").defaultNow(),
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  color: varchar("color"),
  icon: varchar("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const meditations = pgTable("meditations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  audioUrl: text("audio_url"),
  duration: integer("duration"), // in minutes
  category: varchar("category"),
  moodId: integer("mood_id").references(() => moods.id),
  difficulty: varchar("difficulty").default("beginner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userMoodLogs = pgTable("user_mood_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  moodId: integer("mood_id").notNull().references(() => moods.id),
  intensity: integer("intensity"), // 1-10 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const meditationSessions = pgTable("meditation_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  meditationId: integer("meditation_id").notNull().references(() => meditations.id),
  durationCompleted: integer("duration_completed"), // in minutes
  completedAt: timestamp("completed_at").defaultNow(),
});

export const notificationSignups = pgTable("notification_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  name: varchar("name"),
  featureType: varchar("feature_type").notNull(),
  isNotified: boolean("is_notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bulkEmailImports = pgTable("bulk_email_imports", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  tag: varchar("tag"),
  source: varchar("source"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const divineFeedback = pgTable("divine_feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  email: varchar("email"),
  name: varchar("name"),
  feedback: text("feedback").notNull(),
  category: varchar("category"),
  focusGroupInterest: boolean("focus_group_interest").default(false),
  pricingPreference: varchar("pricing_preference"),
  featureRequests: text("feature_requests"),
  overallSatisfaction: integer("overall_satisfaction"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title"),
  summary: text("summary"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => chatConversations.id),
  role: varchar("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  journalEntries: many(journalEntries),
  chakraQuizResults: many(chakraQuizResults),
  userStats: many(userStats),
  userAchievements: many(userAchievements),
  ritualCompletions: many(ritualCompletions),
  prayerRequests: many(prayerRequests),
  prayerInteractions: many(prayerInteractions),
  userMoodLogs: many(userMoodLogs),
  meditationSessions: many(meditationSessions),
  divineFeedback: many(divineFeedback),
  chatConversations: many(chatConversations),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, { fields: [journalEntries.userId], references: [users.id] }),
}));

export const chakraQuizResultsRelations = relations(chakraQuizResults, ({ one }) => ({
  user: one(users, { fields: [chakraQuizResults.userId], references: [users.id] }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, { fields: [userStats.userId], references: [users.id] }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
}));

export const ritualCompletionsRelations = relations(ritualCompletions, ({ one }) => ({
  user: one(users, { fields: [ritualCompletions.userId], references: [users.id] }),
}));

export const prayerRequestsRelations = relations(prayerRequests, ({ one, many }) => ({
  user: one(users, { fields: [prayerRequests.userId], references: [users.id] }),
  interactions: many(prayerInteractions),
}));

export const prayerInteractionsRelations = relations(prayerInteractions, ({ one }) => ({
  prayerRequest: one(prayerRequests, { fields: [prayerInteractions.prayerRequestId], references: [prayerRequests.id] }),
  user: one(users, { fields: [prayerInteractions.userId], references: [users.id] }),
}));

export const meditationsRelations = relations(meditations, ({ one, many }) => ({
  mood: one(moods, { fields: [meditations.moodId], references: [moods.id] }),
  sessions: many(meditationSessions),
}));

export const moodsRelations = relations(moods, ({ many }) => ({
  meditations: many(meditations),
  userMoodLogs: many(userMoodLogs),
}));

export const userMoodLogsRelations = relations(userMoodLogs, ({ one }) => ({
  user: one(users, { fields: [userMoodLogs.userId], references: [users.id] }),
  mood: one(moods, { fields: [userMoodLogs.moodId], references: [moods.id] }),
}));

export const meditationSessionsRelations = relations(meditationSessions, ({ one }) => ({
  user: one(users, { fields: [meditationSessions.userId], references: [users.id] }),
  meditation: one(meditations, { fields: [meditationSessions.meditationId], references: [meditations.id] }),
}));

export const divineFeedbackRelations = relations(divineFeedback, ({ one }) => ({
  user: one(users, { fields: [divineFeedback.userId], references: [users.id] }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, { fields: [chatConversations.userId], references: [users.id] }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, { fields: [chatMessages.conversationId], references: [chatConversations.id] }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpsertUser = typeof users.$inferInsert;

export type DailyRitual = typeof dailyRituals.$inferSelect;
export type InsertDailyRitual = typeof dailyRituals.$inferInsert;

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

export type PremiumContent = typeof premiumContent.$inferSelect;
export type InsertPremiumContent = typeof premiumContent.$inferInsert;

export type ChakraQuizResult = typeof chakraQuizResults.$inferSelect;
export type InsertChakraQuizResult = typeof chakraQuizResults.$inferInsert;

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type InsertRitualCompletion = typeof ritualCompletions.$inferInsert;

export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = typeof prayers.$inferInsert;

export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertPrayerRequest = typeof prayerRequests.$inferInsert;

export type PrayerInteraction = typeof prayerInteractions.$inferSelect;
export type InsertPrayerInteraction = typeof prayerInteractions.$inferInsert;

export type Mood = typeof moods.$inferSelect;
export type InsertMood = typeof moods.$inferInsert;

export type Meditation = typeof meditations.$inferSelect;
export type InsertMeditation = typeof meditations.$inferInsert;

export type UserMoodLog = typeof userMoodLogs.$inferSelect;
export type InsertUserMoodLog = typeof userMoodLogs.$inferInsert;

export type MeditationSession = typeof meditationSessions.$inferSelect;
export type InsertMeditationSession = typeof meditationSessions.$inferInsert;

export type NotificationSignup = typeof notificationSignups.$inferSelect;
export type InsertNotificationSignup = typeof notificationSignups.$inferInsert;

export type BulkEmailImport = typeof bulkEmailImports.$inferSelect;
export type InsertBulkEmailImport = typeof bulkEmailImports.$inferInsert;

export type DivineFeedback = typeof divineFeedback.$inferSelect;
export type InsertDivineFeedback = typeof divineFeedback.$inferInsert;

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
```

## 9. SERVER/INDEX.TS

```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 100)}`;
        if (JSON.stringify(capturedJsonResponse).length > 100) {
          logLine += "...";
        }
      }
      log(logLine, "express");
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Important: Serve static files in development
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Error handling middleware should be last
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`, "express");
  });
})();
```

## 10. SERVER/DB.TS

```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

## 11. SERVER/STORAGE.TS

```typescript
import {
  users,
  dailyRituals,
  journalEntries,
  premiumContent,
  chakraQuizResults,
  userStats,
  userAchievements,
  ritualCompletions,
  prayers,
  prayerRequests,
  prayerInteractions,
  moods,
  meditations,
  userMoodLogs,
  meditationSessions,
  notificationSignups,
  bulkEmailImports,
  divineFeedback,
  chatConversations,
  chatMessages,
  type User,
  type InsertUser,
  type UpsertUser,
  type DailyRitual,
  type InsertDailyRitual,
  type JournalEntry,
  type InsertJournalEntry,
  type PremiumContent,
  type InsertPremiumContent,
  type ChakraQuizResult,
  type InsertChakraQuizResult,
  type UserStats,
  type InsertUserStats,
  type UserAchievement,
  type InsertUserAchievement,
  type RitualCompletion,
  type InsertRitualCompletion,
  type Prayer,
  type InsertPrayer,
  type PrayerRequest,
  type InsertPrayerRequest,
  type PrayerInteraction,
  type InsertPrayerInteraction,
  type Mood,
  type InsertMood,
  type Meditation,
  type InsertMeditation,
  type UserMoodLog,
  type InsertUserMoodLog,
  type MeditationSession,
  type InsertMeditationSession,
  type NotificationSignup,
  type InsertNotificationSignup,
  type BulkEmailImport,
  type InsertBulkEmailImport,
  type DivineFeedback,
  type InsertDivineFeedback,
  type ChatConversation,
  type InsertChatConversation,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername?(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  updateUserSubscriptionStatus(userId: string, status: string): Promise<User>;

  
  // Daily Rituals
  getDailyRitual(date: string): Promise<DailyRitual | undefined>;
  getAllDailyRituals(): Promise<DailyRitual[]>;
  createDailyRitual(ritual: InsertDailyRitual): Promise<DailyRitual>;
  
  // Journal Entries
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  
  // Premium Content
  getPremiumContent(): Promise<PremiumContent[]>;
  createPremiumContent(content: InsertPremiumContent): Promise<PremiumContent>;
  
  // Chakra Quiz Results
  getChakraQuizResults(userId: string): Promise<ChakraQuizResult[]>;
  createChakraQuizResult(result: InsertChakraQuizResult): Promise<ChakraQuizResult>;
  
  // User Stats & Achievements
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createOrUpdateUserStats(stats: Partial<InsertUserStats> & { userId: string }): Promise<UserStats>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
  updateAchievementProgress(userId: string, achievementType: string, progress: number): Promise<void>;
  unlockAchievement(userId: string, achievementType: string): Promise<void>;
  
  // Ritual Completions
  getRitualCompletion(userId: string, ritualDate: string): Promise<RitualCompletion | undefined>;
  createRitualCompletion(completion: InsertRitualCompletion): Promise<RitualCompletion>;
  
  // Prayer Room
  getPrayers(): Promise<Prayer[]>;
  getPrayersByCategory(category: string): Promise<Prayer[]>;
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  updatePrayer(id: number, prayer: Partial<InsertPrayer>): Promise<Prayer>;
  deletePrayer(id: number): Promise<void>;
  
  getPrayerRequests(): Promise<PrayerRequest[]>;
  getPublicPrayerRequests(): Promise<PrayerRequest[]>;
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  
  createPrayerInteraction(interaction: InsertPrayerInteraction): Promise<PrayerInteraction>;
  incrementPrayerRequestCounter(requestId: number, type: 'candles' | 'prayers'): Promise<void>;
  
  // Mood-Based Meditation System
  getMoods(): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  getMeditations(): Promise<Meditation[]>;
  getMeditationsByMood(moodId: number): Promise<Meditation[]>;
  createMeditation(meditation: InsertMeditation): Promise<Meditation>;
  getUserMoodLogs(userId: string): Promise<UserMoodLog[]>;
  createUserMoodLog(moodLog: InsertUserMoodLog): Promise<UserMoodLog>;
  getMeditationSessions(userId: string): Promise<MeditationSession[]>;
  createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession>;
  getMeditationRecommendations(userId: string): Promise<Meditation[]>;
  
  // Notification Signups
  createNotificationSignup(signup: InsertNotificationSignup): Promise<NotificationSignup>;
  getNotificationSignups(featureType?: string): Promise<NotificationSignup[]>;
  deleteNotificationSignup(id: number): Promise<void>;
  
  // Bulk Email Imports
  createBulkEmailImport(emailImport: InsertBulkEmailImport): Promise<BulkEmailImport>;
  getBulkEmailImports(tag?: string): Promise<BulkEmailImport[]>;
  getBulkEmailImportsByTag(tag: string): Promise<BulkEmailImport[]>;
  updateBulkEmailImport(id: number, updates: Partial<InsertBulkEmailImport>): Promise<BulkEmailImport>;
  deleteBulkEmailImport(id: number): Promise<void>;
  bulkCreateEmailImports(emailImports: InsertBulkEmailImport[]): Promise<BulkEmailImport[]>;
  
  // Divine Feedback
  createDivineFeedback(feedback: InsertDivineFeedback): Promise<DivineFeedback>;
  getDivineFeedback(): Promise<DivineFeedback[]>;
  getUserDivineFeedback(userId: string): Promise<DivineFeedback[]>;
  
  // Spiritual Chat
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversations(userId: string): Promise<ChatConversation[]>;
  getChatConversation(conversationId: number): Promise<ChatConversation | undefined>;
  updateChatConversation(conversationId: number, updates: Partial<InsertChatConversation>): Promise<ChatConversation>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(conversationId: number): Promise<ChatMessage[]>;
  getRecentUserContext(userId: string): Promise<{
    recentRituals: string[];
    journalEntries: string[];
    energyAssessment?: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  async seedDatabase() {
    try {
      // Seed daily rituals
      const existingRituals = await db.select().from(dailyRituals).limit(1);
      if (existingRituals.length === 0) {
        const ritualData = [
          {
            date: "2025-01-01",
            title: "Sunday Sacred Reset",
            content: {
              sacred_intention: "Release what no longer serves and welcome divine renewal",
              divine_affirmation: "I am cleansed by divine light and ready for my highest path",
              sacred_ritual: [
                "Light a white candle in sacred space",
                "Take three deep cleansing breaths",
                "Speak gratitude for lessons learned",
                "Set intention for divine guidance ahead"
              ]
            }
          }
        ];

        for (const ritual of ritualData) {
          await db.insert(dailyRituals).values(ritual);
        }
      }

      // Seed prayers
      const existingPrayers = await db.select().from(prayers).limit(1);
      if (existingPrayers.length === 0) {
        const prayerData = [
          {
            title: "Prayer for Inner Peace",
            content: "Divine Spirit, calm the storms within my heart and mind. Guide me to the stillness where your voice is clear and my soul finds rest. May your peace flow through me like a gentle river, washing away all anxiety and fear. I trust in your perfect plan for my life.",
            category: "Peace"
          },
          {
            title: "Prayer for Healing",
            content: "Sacred Healer, I place my body, mind, and spirit in your loving hands. Where there is pain, bring comfort. Where there is brokenness, bring wholeness. Where there is disease, bring health. May your healing light penetrate every cell of my being.",
            category: "Healing"
          },
          {
            title: "Prayer of Gratitude",
            content: "Blessed Creator, my heart overflows with thanksgiving for your countless gifts. For the breath in my lungs, the love in my life, and the opportunities before me, I am grateful. Help me to see your blessings even in challenges and to share this gratitude with others.",
            category: "Gratitude"
          },
          {
            title: "Prayer for Divine Guidance",
            content: "All-knowing Source, illuminate my path with your divine wisdom. When I am uncertain, be my compass. When I am lost, be my light. Help me to trust in your guidance and to walk confidently in the direction you lead me. May your will become my will.",
            category: "Guidance"
          },
          {
            title: "Prayer for Protection",
            content: "Divine Guardian, surround me and my loved ones with your protective light. Shield us from harm, negativity, and all that would disturb our peace. Create a sacred space around us where only love and goodness can enter. We are safe in your care.",
            category: "Protection"
          },
          {
            title: "Prayer for Love",
            content: "Source of All Love, open my heart to give and receive love freely. Help me to love myself with compassion, to love others without judgment, and to love you with devotion. May love be the foundation of all my thoughts, words, and actions.",
            category: "Love"
          },
          {
            title: "Prayer for Strength",
            content: "Mighty Creator, when I am weak, be my strength. When I am weary, renew my spirit. When I face challenges, be my fortress. Help me to draw upon your infinite power and to remember that with you, all things are possible. I am stronger than I know.",
            category: "Strength"
          },
          {
            title: "Prayer for Forgiveness",
            content: "Merciful Divine, help me to forgive as you forgive. Release me from the burden of resentment and anger. Heal the wounds caused by others and by my own mistakes. Fill the space where hurt once lived with compassion and understanding. Let forgiveness set me free.",
            category: "Forgiveness"
          }
        ];

        for (const prayer of prayerData) {
          await db.insert(prayers).values(prayer);
        }
      }

      // Seed premium content
      const existingContent = await db.select().from(premiumContent).limit(1);
      if (existingContent.length === 0) {
        const contentData = [
          {
            title: "Advanced Divine Energy Alignment",
            description: "Deep dive into chakra balancing and energy healing techniques",
            type: "pdf",
            url: "/premium/advanced-energy-alignment.pdf",
            category: "energy-work"
          },
          {
            title: "Sacred Meditation Collection",
            description: "Guided meditations for spiritual growth and enlightenment",
            type: "audio",
            url: "/premium/sacred-meditations.mp3",
            category: "meditation"
          }
        ];

        for (const content of contentData) {
          await db.insert(premiumContent).values(content);
        }
      }

      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const updateData: any = { stripeCustomerId: customerId };
    if (subscriptionId) {
      updateData.stripeSubscriptionId = subscriptionId;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscriptionStatus(userId: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getDailyRitual(date: string): Promise<DailyRitual | undefined> {
    const [ritual] = await db.select().from(dailyRituals).where(eq(dailyRituals.date, date));
    return ritual;
  }

  async getAllDailyRituals(): Promise<DailyRitual[]> {
    return await db.select().from(dailyRituals).orderBy(desc(dailyRituals.date));
  }

  async createDailyRitual(insertRitual: InsertDailyRitual): Promise<DailyRitual> {
    const [ritual] = await db
      .insert(dailyRituals)
      .values(insertRitual)
      .returning();
    return ritual;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const [entry] = await db
      .insert(journalEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async getPremiumContent(): Promise<PremiumContent[]> {
    return await db
      .select()
      .from(premiumContent)
      .where(eq(premiumContent.isActive, true))
      .orderBy(desc(premiumContent.createdAt));
  }

  async createPremiumContent(insertContent: InsertPremiumContent): Promise<PremiumContent> {
    const [content] = await db
      .insert(premiumContent)
      .values(insertContent)
      .returning();
    return content;
  }

  async getChakraQuizResults(userId: number): Promise<ChakraQuizResult[]> {
    return await db
      .select()
      .from(chakraQuizResults)
      .where(eq(chakraQuizResults.userId, userId.toString()))
      .orderBy(desc(chakraQuizResults.createdAt));
  }

  async createChakraQuizResult(insertResult: InsertChakraQuizResult): Promise<ChakraQuizResult> {
    const [result] = await db
      .insert(chakraQuizResults)
      .values(insertResult)
      .returning();
    return result;
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async createOrUpdateUserStats(statsData: Partial<InsertUserStats> & { userId: string }): Promise<UserStats> {
    const existingStats = await this.getUserStats(statsData.userId);
    
    if (existingStats) {
      // Update existing stats
      const [updatedStats] = await db
        .update(userStats)
        .set({
          ...statsData,
          updatedAt: new Date(),
        })
        .where(eq(userStats.userId, statsData.userId))
        .returning();
      return updatedStats;
    } else {
      // Create new stats
      const [newStats] = await db
        .insert(userStats)
        .values(statsData as InsertUserStats)
        .returning();
      return newStats;
    }
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.createdAt));
  }

  async createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newAchievement] = await db
      .insert(userAchievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async updateAchievementProgress(userId: number, achievementType: string, progress: number): Promise<void> {
    await db
      .update(userAchievements)
      .set({ progress })
      .where(
        and(
          eq(userAchievements.userId, userId.toString()),
          eq(userAchievements.achievementType, achievementType)
        )
      );
  }

  async unlockAchievement(userId: number, achievementType: string): Promise<void> {
    await db
      .update(userAchievements)
      .set({ 
        isUnlocked: true, 
        unlockedAt: new Date() 
      })
      .where(
        and(
          eq(userAchievements.userId, userId.toString()),
          eq(userAchievements.achievementType, achievementType)
        )
      );
  }

  async getPrayers(): Promise<Prayer[]> {
    return await db.select().from(prayers).orderBy(prayers.category, prayers.title);
  }

  async getPrayersByCategory(category: string): Promise<Prayer[]> {
    return await db
      .select()
      .from(prayers)
      .where(eq(prayers.category, category))
      .orderBy(prayers.title);
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const [prayer] = await db
      .insert(prayers)
      .values(insertPrayer)
      .returning();
    return prayer;
  }

  async updatePrayer(id: number, updateData: Partial<InsertPrayer>): Promise<Prayer> {
    const [prayer] = await db
      .update(prayers)
      .set(updateData)
      .where(eq(prayers.id, id))
      .returning();
    return prayer;
  }

  async deletePrayer(id: number): Promise<void> {
    await db.delete(prayers).where(eq(prayers.id, id));
  }

  async getPrayerRequests(): Promise<PrayerRequest[]> {
    return await db
      .select()
      .from(prayerRequests)
      .orderBy(desc(prayerRequests.createdAt));
  }

  async getPublicPrayerRequests(): Promise<PrayerRequest[]> {
    return await db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.isPublic, true))
      .orderBy(desc(prayerRequests.createdAt));
  }

  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db
      .insert(prayerRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async createPrayerInteraction(insertInteraction: InsertPrayerInteraction): Promise<PrayerInteraction> {
    const [interaction] = await db
      .insert(prayerInteractions)
      .values(insertInteraction)
      .returning();
    return interaction;
  }

  async incrementPrayerRequestCounter(requestId: number, type: 'candles' | 'prayers'): Promise<void> {
    if (type === 'candles') {
      await db
        .update(prayerRequests)
        .set({ candleCount: sql`${prayerRequests.candleCount} + 1` })
        .where(eq(prayerRequests.id, requestId));
    } else {
      await db
        .update(prayerRequests)
        .set({ prayerCount: sql`${prayerRequests.prayerCount} + 1` })
        .where(eq(prayerRequests.id, requestId));
    }
  }

  async getMoods(): Promise<Mood[]> {
    return await db.select().from(moods).orderBy(moods.name);
  }

  async createMood(mood: InsertMood): Promise<Mood> {
    const [newMood] = await db.insert(moods).values(mood).returning();
    return newMood;
  }

  async getMeditations(): Promise<Meditation[]> {
    return await db.select().from(meditations).orderBy(meditations.title);
  }

  async getMeditationsByMood(moodId: number): Promise<Meditation[]> {
    return await db
      .select()
      .from(meditations)
      .where(eq(meditations.moodId, moodId))
      .orderBy(meditations.title);
  }

  async createMeditation(meditation: InsertMeditation): Promise<Meditation> {
    const [newMeditation] = await db.insert(meditations).values(meditation).returning();
    return newMeditation;
  }

  async getUserMoodLogs(userId: string): Promise<UserMoodLog[]> {
    return await db
      .select()
      .from(userMoodLogs)
      .where(eq(userMoodLogs.userId, userId))
      .orderBy(desc(userMoodLogs.createdAt));
  }

  async createUserMoodLog(moodLog: InsertUserMoodLog): Promise<UserMoodLog> {
    const [newMoodLog] = await db.insert(userMoodLogs).values(moodLog).returning();
    return newMoodLog;
  }

  async getMeditationSessions(userId: string): Promise<MeditationSession[]> {
    return await db
      .select()
      .from(meditationSessions)
      .where(eq(meditationSessions.userId, userId))
      .orderBy(desc(meditationSessions.completedAt));
  }

  async createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession> {
    const [newSession] = await db.insert(meditationSessions).values(session).returning();
    return newSession;
  }

  async getMeditationRecommendations(userId: string): Promise<Meditation[]> {
    // Get user's recent mood logs
    const recentMoods = await db
      .select()
      .from(userMoodLogs)
      .where(eq(userMoodLogs.userId, userId))
      .orderBy(desc(userMoodLogs.createdAt))
      .limit(5);

    if (recentMoods.length === 0) {
      // Return general meditations if no mood data
      return await db.select().from(meditations).limit(3);
    }

    // Get meditations for the most recent mood
    const latestMoodId = recentMoods[0].moodId;
    return await db
      .select()
      .from(meditations)
      .where(eq(meditations.moodId, latestMoodId))
      .limit(3);
  }

  async createNotificationSignup(signupData: InsertNotificationSignup): Promise<NotificationSignup> {
    const [signup] = await db
      .insert(notificationSignups)
      .values(signupData)
      .returning();
    return signup;
  }

  async getNotificationSignups(featureType?: string): Promise<NotificationSignup[]> {
    if (featureType) {
      return await db
        .select()
        .from(notificationSignups)
        .where(eq(notificationSignups.featureType, featureType))
        .orderBy(desc(notificationSignups.createdAt));
    }
    return await db
      .select()
      .from(notificationSignups)
      .orderBy(desc(notificationSignups.createdAt));
  }

  async deleteNotificationSignup(id: number): Promise<void> {
    await db.delete(notificationSignups).where(eq(notificationSignups.id, id));
  }

  async createBulkEmailImport(emailImportData: InsertBulkEmailImport): Promise<BulkEmailImport> {
    const [emailImport] = await db
      .insert(bulkEmailImports)
      .values(emailImportData)
      .returning();
    return emailImport;
  }

  async getBulkEmailImports(tag?: string): Promise<BulkEmailImport[]> {
    if (tag) {
      return await db
        .select()
        .from(bulkEmailImports)
        .where(eq(bulkEmailImports.tag, tag))
        .orderBy(desc(bulkEmailImports.createdAt));
    }
    return await db
      .select()
      .from(bulkEmailImports)
      .orderBy(desc(bulkEmailImports.createdAt));
  }

  async getBulkEmailImportsByTag(tag: string): Promise<BulkEmailImport[]> {
    return await db
      .select()
      .from(bulkEmailImports)
      .where(eq(bulkEmailImports.tag, tag))
      .orderBy(desc(bulkEmailImports.createdAt));
  }

  async updateBulkEmailImport(id: number, updates: Partial<InsertBulkEmailImport>): Promise<BulkEmailImport> {
    const [emailImport] = await db
      .update(bulkEmailImports)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bulkEmailImports.id, id))
      .returning();
    return emailImport;
  }

  async deleteBulkEmailImport(id: number): Promise<void> {
    await db.delete(bulkEmailImports).where(eq(bulkEmailImports.id, id));
  }

  async bulkCreateEmailImports(emailImportsData: InsertBulkEmailImport[]): Promise<BulkEmailImport[]> {
    const emailImports = await db
      .insert(bulkEmailImports)
      .values(emailImportsData)
      .returning();
    return emailImports;
  }

  async createDivineFeedback(feedbackData: InsertDivineFeedback): Promise<DivineFeedback> {
    const [feedback] = await db
      .insert(divineFeedback)
      .values(feedbackData)
      .returning();
    return feedback;
  }

  async getDivineFeedback(): Promise<DivineFeedback[]> {
    return await db
      .select()
      .from(divineFeedback)
      .orderBy(desc(divineFeedback.createdAt));
  }

  async getUserDivineFeedback(userId: string): Promise<DivineFeedback[]> {
    return await db
      .select()
      .from(divineFeedback)
      .where(eq(divineFeedback.userId, userId))
      .orderBy(desc(divineFeedback.createdAt));
  }

  async createChatConversation(conversationData: InsertChatConversation): Promise<ChatConversation> {
    const [conversation] = await db
      .insert(chatConversations)
      .values(conversationData)
      .returning();
    return conversation;
  }

  async getChatConversations(userId: string): Promise<ChatConversation[]> {
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
  }

  async getChatConversation(conversationId: number): Promise<ChatConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.id, conversationId));
    return conversation;
  }

  async updateChatConversation(conversationId: number, updates: Partial<InsertChatConversation>): Promise<ChatConversation> {
    const [conversation] = await db
      .update(chatConversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chatConversations.id, conversationId))
      .returning();
    return conversation;
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async getChatMessages(conversationId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
  }

  async getRecentUserContext(userId: string): Promise<{
    recentRituals: string[];
    journalEntries: string[];
    energyAssessment?: string;
  }> {
    // Get recent ritual completions
    const recentRituals = await db
      .select()
      .from(ritualCompletions)
      .where(eq(ritualCompletions.userId, userId))
      .orderBy(desc(ritualCompletions.completedAt))
      .limit(3);

    // Get recent journal entries
    const journalEntries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(3);

    // Get most recent chakra quiz result
    const chakraResults = await db
      .select()
      .from(chakraQuizResults)
      .where(eq(chakraQuizResults.userId, userId))
      .orderBy(desc(chakraQuizResults.createdAt))
      .limit(1);

    return {
      recentRituals: recentRituals.map(r => r.ritualDate),
      journalEntries: journalEntries.map(j => j.entry),
      energyAssessment: chakraResults[0]?.results ? JSON.stringify(chakraResults[0].results) : undefined
    };
  }
}

export const storage = new DatabaseStorage();

// Initialize database seeding
storage.seedDatabase();
```

## 12. SERVER/ROUTES.TS

```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendEmail, sendWelcomeEmail, sendUserProfileNotification, sendMilestoneNotification } from "./sendgrid";
import { getSpiritualGuidance } from "./openai";
import { setUserPassword, checkUserPassword, requireUserPassword, initializeDefaultPassword } from "./security";
import { getChicagoDateString, getChicagoDayOfWeek } from "./timeUtils";
import express from "express";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

function getUserId(req: any): string | null {
  // Check for custom session first (username/password auth)
  if (req.session?.userId) {
    return req.session.userId;
  }
  
  // Check for Replit Auth session
  if (req.user?.claims?.sub) {
    return req.user.claims.sub;
  }
  
  return null;
}

// Universal auth middleware that works with both systems
const universalAuth = async (req: any, res: any, next: any) => {
  const userId = getUserId(req);
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Store user ID for easy access
  req.userId = userId;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default password protection
  await initializeDefaultPassword();
  
  // Auth middleware - only set up if not using custom auth
  await setupAuth(app);

  // Stripe webhook endpoint for handling subscription events
  app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error('Stripe webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          const customerId = invoice.customer as string;
          const subscriptionId = invoice.subscription as string;
          
          if (subscriptionId) {
            // Find user by Stripe customer ID and update subscription status
            const users = await storage.getAllUsers();
            const user = users.find(u => u.stripeCustomerId === customerId);
            
            if (user) {
              await storage.updateUserSubscriptionStatus(user.id, 'premium');
              console.log(`Updated user ${user.id} subscription to premium`);
            }
          }
          break;

        case 'invoice.payment_failed':
          const failedInvoice = event.data.object;
          const failedCustomerId = failedInvoice.customer as string;
          
          // Find user and update subscription status
          const allUsers = await storage.getAllUsers();
          const failedUser = allUsers.find(u => u.stripeCustomerId === failedCustomerId);
          
          if (failedUser) {
            await storage.updateUserSubscriptionStatus(failedUser.id, 'past_due');
            console.log(`Updated user ${failedUser.id} subscription to past_due`);
          }
          break;

        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          const canceledCustomerId = subscription.customer as string;
          
          // Find user and update subscription status
          const canceledUsers = await storage.getAllUsers();
          const canceledUser = canceledUsers.find(u => u.stripeCustomerId === canceledCustomerId);
          
          if (canceledUser) {
            await storage.updateUserSubscriptionStatus(canceledUser.id, 'free');
            console.log(`Updated user ${canceledUser.id} subscription to free`);
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Subscription status endpoint
  app.get('/api/subscription-status', universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let subscriptionInfo = {
        status: user.subscriptionStatus || 'free',
        isPremium: ['premium', 'active'].includes(user.subscriptionStatus || 'free')
      };

      // If user has Stripe subscription, get current status
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          subscriptionInfo = {
            status: subscription.status === 'active' ? 'premium' : 'free',
            isPremium: subscription.status === 'active'
          };
          
          // Update user status if it changed
          if (subscriptionInfo.status !== user.subscriptionStatus) {
            await storage.updateUserStripeInfo(userId, subscriptionInfo.status);
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
        }
      }

      res.json(subscriptionInfo);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  // Stripe subscription creation endpoint
  app.post('/api/create-subscription', universalAuth, async (req: any, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const userId = req.userId;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has a subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status === 'active') {
          return res.json({
            success: true,
            message: "Already subscribed",
            clientSecret: null
          });
        }
      }

      // Create or retrieve customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email || '',
          metadata: {
            userId: userId
          }
        });
        await storage.updateUserStripeInfo(userId, customer.id);
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Divine Vanity Premium',
              description: 'Premium access to all spiritual features'
            },
            unit_amount: 4900, // $49.00
            recurring: {
              interval: 'month'
            }
          }
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription ID
      await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

      res.json({
        success: true,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        subscriptionId: subscription.id
      });

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription: " + error.message });
    }
  });

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check for session-based auth first
      if (req.session?.userId) {
        console.log(`Session: ${req.session.userId}`);
        console.log(`Claims: undefined`);
        
        const user = await storage.getUser(req.session.userId);
        if (user) {
          console.log(`User data retrieved: ${JSON.stringify({
            id: user.id,
            email: user.email,
            isOnboarded: user.isOnboarded
          })}`);
          return res.json(user);
        }
      }
      
      // Fallback to Replit Auth
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        console.log(`Session: ${req.session?.id || 'undefined'}`);
        console.log(`Claims: ${req.user?.claims ? 'defined' : 'undefined'}`);
        
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        
        if (user) {
          console.log(`User data retrieved: ${JSON.stringify({
            id: user.id,
            email: user.email,
            isOnboarded: user.isOnboarded
          })}`);
          return res.json(user);
        }
      }
      
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User registration and onboarding
  app.post('/api/register', async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, phone } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Generate user ID
      const userId = Date.now().toString();
      
      // Create user
      const user = await storage.createUser({
        id: userId,
        username,
        email,
        firstName,
        lastName,
        phone,
        isOnboarded: true,
        subscriptionStatus: 'premium' // Set to premium for testing
      });
      
      // Set password
      await setUserPassword(userId, password);
      
      // Create session
      (req as any).session.userId = userId;
      
      // Send notification email
      try {
        await sendUserProfileNotification({
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          phone: phone || '',
          registrationDate: new Date().toLocaleDateString()
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail registration if email fails
      }
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isOnboarded: user.isOnboarded
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const isValidPassword = await checkUserPassword(user.id, password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Create session
      (req as any).session.userId = user.id;
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isOnboarded: user.isOnboarded
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/logout', (req, res) => {
    if ((req as any).session) {
      (req as any).session.destroy(() => {
        res.json({ success: true });
      });
    } else {
      res.json({ success: true });
    }
  });

  app.post('/api/onboard', universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const { firstName, lastName, email, phone } = req.body;
      
      // Update user with onboarding info
      const user = await storage.upsertUser({
        id: userId,
        firstName,
        lastName,
        email,
        phone,
        isOnboarded: true,
        updatedAt: new Date()
      });
      
      // Send notification email
      try {
        await sendUserProfileNotification({
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          phone: phone || '',
          registrationDate: new Date().toLocaleDateString()
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail onboarding if email fails
      }
      
      res.json({ success: true, user });
    } catch (error) {
      console.error("Onboarding error:", error);
      res.status(500).json({ message: "Onboarding failed" });
    }
  });

  // Protected route for accessing user data (fallback)
  app.get("/api/user", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Daily ritual endpoint with Chicago time support
  app.get("/api/daily-ritual", async (req, res) => {
    try {
      const chicagoDate = getChicagoDateString();
      console.log(`📅 Current date (Chicago): ${chicagoDate}, Day of week: ${getChicagoDayOfWeek()} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][getChicagoDayOfWeek()]})`);
      
      let ritual = await storage.getDailyRitual(chicagoDate);
      
      if (!ritual) {
        // Generate ritual based on day of week using Chicago time
        const dayOfWeek = getChicagoDayOfWeek();
        const ritualTitles = [
          "Sunday Sacred Reset",
          "Monday Manifestation",
          "Tuesday Transformation", 
          "Wednesday Wisdom",
          "Thursday Thanksgiving",
          "Friday Freedom",
          "Saturday Sanctuary"
        ];
        
        const ritualContents = [
          {
            sacred_intention: "Release what no longer serves and welcome divine renewal",
            divine_affirmation: "I am cleansed by divine light and ready for my highest path",
            sacred_ritual: [
              "Light a white candle in sacred space",
              "Take three deep cleansing breaths", 
              "Speak gratitude for lessons learned",
              "Set intention for divine guidance ahead"
            ]
          },
          {
            sacred_intention: "Manifest divine desires into physical reality",
            divine_affirmation: "I am a powerful co-creator with the Universe",
            sacred_ritual: [
              "Write three intentions on sacred paper",
              "Hold crystals while visualizing success",
              "Speak your desires to the Universe",
              "Trust in divine timing and release attachment"
            ]
          },
          {
            sacred_intention: "Transform challenges into opportunities for growth",
            divine_affirmation: "I embrace change as my pathway to evolution",
            sacred_ritual: [
              "Identify one area ready for transformation",
              "Light purple candle for spiritual strength",
              "Ask for guidance in releasing old patterns",
              "Welcome new possibilities with open heart"
            ]
          },
          {
            sacred_intention: "Access divine wisdom and inner knowing",
            divine_affirmation: "I trust the wisdom that flows through me",
            sacred_ritual: [
              "Sit in meditation for 10 minutes",
              "Ask your highest self for guidance", 
              "Journal any insights received",
              "Honor the wisdom within you"
            ]
          },
          {
            sacred_intention: "Express gratitude for divine blessings",
            divine_affirmation: "I am grateful for the abundance in my life",
            sacred_ritual: [
              "List ten things you're grateful for",
              "Thank the Universe for its support",
              "Send appreciation to someone special",
              "Feel gratitude radiating from your heart"
            ]
          },
          {
            sacred_intention: "Experience freedom from limiting beliefs",
            divine_affirmation: "I am free to be my authentic divine self",
            sacred_ritual: [
              "Identify one limiting belief to release",
              "Write it down and safely burn the paper",
              "Dance or move your body freely",
              "Celebrate your divine liberation"
            ]
          },
          {
            sacred_intention: "Create sacred sanctuary for spiritual renewal", 
            divine_affirmation: "I am worthy of peace, rest, and divine care",
            sacred_ritual: [
              "Create a beautiful sacred space",
              "Light candles and burn gentle incense",
              "Read inspiring spiritual text",
              "Rest in the sanctuary of divine love"
            ]
          }
        ];
        
        const generatedRitual = {
          date: chicagoDate,
          title: ritualTitles[dayOfWeek],
          content: ritualContents[dayOfWeek]
        };
        
        ritual = await storage.createDailyRitual(generatedRitual);
      }
      
      res.json({
        id: ritual.id,
        title: ritual.title,
        content: ritual.content,
        date: ritual.date
      });
    } catch (error) {
      console.error("Error fetching daily ritual:", error);
      res.status(500).json({ message: "Failed to fetch daily ritual" });
    }
  });

  // Ritual completion status
  app.get("/api/daily-ritual/status", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const today = getChicagoDateString();
      
      const completion = await storage.getRitualCompletion(userId, today);
      res.json({ isCompleted: !!completion });
    } catch (error) {
      console.error("Error checking ritual status:", error);
      res.status(500).json({ message: "Failed to check ritual status" });
    }
  });

  // Complete daily ritual
  app.post("/api/daily-ritual/complete", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const today = getChicagoDateString();
      
      // Check if already completed
      const existingCompletion = await storage.getRitualCompletion(userId, today);
      if (existingCompletion) {
        return res.json({ message: "Ritual already completed today" });
      }
      
      // Create completion record
      await storage.createRitualCompletion({
        userId,
        ritualDate: today
      });
      
      // Award XP and update stats
      const stats = await storage.getUserStats(userId);
      const currentXP = stats?.totalXP || 0;
      const currentRituals = stats?.ritualsCompleted || 0;
      const newXP = currentXP + 25;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      await storage.createOrUpdateUserStats({
        userId,
        totalXP: newXP,
        level: newLevel,
        ritualsCompleted: currentRituals + 1,
        lastActiveDate: today
      });
      
      // Check for achievements
      if (currentRituals + 1 === 1) {
        await storage.createUserAchievement({
          userId,
          achievementType: "first_ritual",
          achievementName: "Sacred Beginning",
          description: "Completed your first daily ritual",
          isUnlocked: true,
          unlockedAt: new Date()
        });
      }
      
      res.json({ 
        message: "Ritual completed successfully!",
        xpEarned: 25,
        totalXP: newXP,
        level: newLevel
      });
    } catch (error) {
      console.error("Error completing ritual:", error);
      res.status(500).json({ message: "Failed to complete ritual" });
    }
  });

  // Journal prompts endpoint
  app.get("/api/journal-prompts", async (req, res) => {
    const prompts = [
      "What am I most grateful for in this moment?",
      "How can I show myself more compassion today?",
      "What dreams are calling to my heart?",
      "Where am I avoiding intimacy in my relationships?",
      "What would I do if I knew I couldn't fail?",
      "How can I honor my authentic self today?",
      "What patterns am I ready to release?",
      "Where do I feel most connected to the divine?",
      "What does my soul need right now?",
      "How can I be of service to others today?",
      "What fears are keeping me from my purpose?",
      "How can I cultivate more joy in my life?",
      "What boundaries do I need to establish?",
      "Where am I seeking validation outside myself?",
      "What would unconditional self-love look like?",
      "How can I trust the divine timing of my life?",
      "What gifts am I not sharing with the world?",
      "Where do I need to forgive myself?",
      "How can I deepen my spiritual practice?",
      "What is my heart trying to tell me?",
      "Where am I playing small in my life?",
      "How can I honor both my needs and others'?",
      "What would I attempt if I had complete faith?",
      "Where do I need more balance in my life?",
      "How can I transform my challenges into wisdom?",
      "What aspects of myself am I hiding?",
      "Where do I feel most alive and authentic?",
      "How can I be more present in my relationships?",
      "What would I tell my younger self?",
      "Where do I need to practice more patience?",
      "How can I align my actions with my values?",
      "What brings me the deepest sense of peace?",
      "Where am I resisting growth or change?",
      "How can I better care for my emotional needs?",
      "What would complete self-acceptance feel like?",
      "Where do I give my power away to others?",
      "How can I cultivate more faith in uncertainty?",
      "What stories about myself need updating?",
      "Where do I judge myself most harshly?",
      "How can I create more sacred space in my life?",
      "What would I do if I loved myself completely?",
      "Where do I need to set healthier boundaries?",
      "How can I honor my intuition more fully?",
      "What aspects of my shadow need integration?",
      "Where do I seek external approval unnecessarily?",
      "How can I be more gentle with myself?",
      "What would radical self-care look like for me?",
      "Where am I not honoring my true desires?"
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    res.json({ prompt: randomPrompt });
  });

  // Journal entries
  app.get("/api/journal-entries", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal-entries", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const { prompt, entry, mood } = req.body;
      
      const journalEntry = await storage.createJournalEntry({
        userId,
        prompt,
        entry,
        mood
      });
      
      // Award XP and update stats
      const stats = await storage.getUserStats(userId);
      const currentXP = stats?.totalXP || 0;
      const currentEntries = stats?.journalEntries || 0;
      const newXP = currentXP + 25;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      await storage.createOrUpdateUserStats({
        userId,
        totalXP: newXP,
        level: newLevel,
        journalEntries: currentEntries + 1,
        lastActiveDate: getChicagoDateString()
      });
      
      // Check for achievements
      if (currentEntries + 1 === 1) {
        await storage.createUserAchievement({
          userId,
          achievementType: "first_journal",
          achievementName: "Sacred Scribe",
          description: "Wrote your first journal entry",
          isUnlocked: true,
          unlockedAt: new Date()
        });
      }
      
      res.json({
        ...journalEntry,
        xpEarned: 25,
        totalXP: newXP,
        level: newLevel
      });
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  // Premium content
  app.get("/api/premium-content", universalAuth, async (req: any, res) => {
    try {
      const content = await storage.getPremiumContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching premium content:", error);
      res.status(500).json({ message: "Failed to fetch premium content" });
    }
  });

  // Divine Energy Quiz (formerly Chakra Quiz)
  app.get("/api/divine-energy-quiz", async (req, res) => {
    const questions = [
      {
        id: 1,
        question: "How grounded and secure do you feel in your daily life?",
        chakra: "root",
        divine_name: "Divine Foundation"
      },
      {
        id: 2, 
        question: "How comfortable are you with expressing your creativity and sexuality?",
        chakra: "sacral",
        divine_name: "Divine Creativity"
      },
      {
        id: 3,
        question: "How confident do you feel in your personal power and ability to achieve goals?", 
        chakra: "solar_plexus",
        divine_name: "Divine Power"
      },
      {
        id: 4,
        question: "How open is your heart to giving and receiving love?",
        chakra: "heart", 
        divine_name: "Divine Heart"
      },
      {
        id: 5,
        question: "How clearly do you communicate your truth and authentic self?",
        chakra: "throat",
        divine_name: "Divine Voice"
      },
      {
        id: 6,
        question: "How connected are you to your intuition and inner wisdom?",
        chakra: "third_eye",
        divine_name: "Divine Wisdom"
      },
      {
        id: 7,
        question: "How connected do you feel to your spiritual purpose and the divine?",
        chakra: "crown",
        divine_name: "Divine Connection"
      }
    ];
    
    res.json({ questions });
  });

  function generateDivineRecommendations(imbalancedEnergy: string) {
    const recommendations = {
      root: {
        divine_name: "Divine Foundation",
        affirmation: "I am safe, secure, and deeply rooted in divine love",
        practice: "Ground yourself daily through nature walks, root vegetable nutrition, and red crystal meditation",
        oils: "Patchouli, Cedarwood, Vetiver",
        crystals: "Red Jasper, Hematite, Garnet"
      },
      sacral: {
        divine_name: "Divine Creativity", 
        affirmation: "I flow with creative passion and embrace my sacred sensuality",
        practice: "Dance freely, create art, enjoy orange foods, and work with water elements",
        oils: "Sweet Orange, Ylang Ylang, Sandalwood",
        crystals: "Carnelian, Orange Calcite, Moonstone"
      },
      solar_plexus: {
        divine_name: "Divine Power",
        affirmation: "I am confident, powerful, and worthy of all my dreams", 
        practice: "Practice breathwork, enjoy sunlight, eat yellow foods, and set strong boundaries",
        oils: "Lemon, Ginger, Bergamot",
        crystals: "Citrine, Yellow Jasper, Pyrite"
      },
      heart: {
        divine_name: "Divine Heart",
        affirmation: "My heart is open to give and receive infinite love",
        practice: "Practice heart-opening yoga, spend time in nature, eat green foods, practice forgiveness",
        oils: "Rose, Geranium, Eucalyptus", 
        crystals: "Rose Quartz, Green Aventurine, Malachite"
      },
      throat: {
        divine_name: "Divine Voice",
        affirmation: "I speak my truth with clarity, confidence, and divine love",
        practice: "Practice singing, chanting, blue light meditation, and authentic communication",
        oils: "Eucalyptus, Peppermint, Chamomile",
        crystals: "Sodalite, Blue Lace Agate, Aquamarine"
      },
      third_eye: {
        divine_name: "Divine Wisdom", 
        affirmation: "I trust my intuition and inner wisdom completely",
        practice: "Practice meditation, dream journaling, eat purple foods, and trust your gut feelings",
        oils: "Lavender, Frankincense, Clary Sage",
        crystals: "Amethyst, Lapis Lazuli, Fluorite"
      },
      crown: {
        divine_name: "Divine Connection",
        affirmation: "I am connected to infinite divine wisdom and universal love",
        practice: "Practice meditation, prayer, fasting, and spiritual study",
        oils: "Frankincense, Myrrh, Sandalwood", 
        crystals: "Clear Quartz, Amethyst, Selenite"
      }
    };
    
    return recommendations[imbalancedEnergy] || recommendations.heart;
  }

  app.post("/api/divine-energy-quiz-results", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const { answers } = req.body;
      
      // Calculate results
      const energyCenters = ['root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye', 'crown'];
      const scores = energyCenters.map((center, index) => ({
        center,
        divine_name: generateDivineRecommendations(center).divine_name,
        score: answers[index + 1] || 0
      }));
      
      // Find lowest scoring energy center
      const lowestScore = Math.min(...scores.map(s => s.score));
      const imbalancedEnergy = scores.find(s => s.score === lowestScore)?.center || 'heart';
      
      const recommendations = generateDivineRecommendations(imbalancedEnergy);
      
      const results = {
        scores,
        primary_imbalance: imbalancedEnergy,
        divine_name: recommendations.divine_name,
        recommendations
      };
      
      // Store results
      await storage.createChakraQuizResult({
        userId,
        answers,
        results
      });
      
      // Award XP and update stats  
      const stats = await storage.getUserStats(userId);
      const currentXP = stats?.totalXP || 0;
      const currentAssessments = stats?.assessmentsCompleted || 0;
      const newXP = currentXP + 50;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      await storage.createOrUpdateUserStats({
        userId,
        totalXP: newXP,
        level: newLevel,
        assessmentsCompleted: currentAssessments + 1,
        lastActiveDate: getChicagoDateString()
      });
      
      // Check for achievements
      if (currentAssessments + 1 === 1) {
        await storage.createUserAchievement({
          userId,
          achievementType: "divine_master",
          achievementName: "Divine Energy Master", 
          description: "Completed your first divine energy assessment",
          isUnlocked: true,
          unlockedAt: new Date()
        });
      }
      
      res.json({
        results,
        xpEarned: 50,
        totalXP: newXP,
        level: newLevel
      });
    } catch (error) {
      console.error("Error saving divine energy quiz results:", error);
      res.status(500).json({ message: "Failed to save quiz results" });
    }
  });

  app.get("/api/divine-energy-quiz-results", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const results = await storage.getChakraQuizResults(userId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching divine energy quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  // User achievements
  app.get("/api/achievements", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // User stats
  app.get("/api/user-stats", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const stats = await storage.getUserStats(userId);
      res.json(stats || {
        totalXP: 0,
        level: 1,
        journalEntries: 0,
        ritualsCompleted: 0,
        assessmentsCompleted: 0
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Prayer Room endpoints
  app.get("/api/prayers", async (req, res) => {
    try {
      const { category } = req.query;
      let prayers;
      
      if (category) {
        prayers = await storage.getPrayersByCategory(category as string);
      } else {
        prayers = await storage.getPrayers();
      }
      
      res.json(prayers);
    } catch (error) {
      console.error("Error fetching prayers:", error);
      res.status(500).json({ message: "Failed to fetch prayers" });
    }
  });

  app.get("/api/prayer-requests", async (req, res) => {
    try {
      const requests = await storage.getPublicPrayerRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
      res.status(500).json({ message: "Failed to fetch prayer requests" });
    }
  });

  app.post("/api/prayer-requests", async (req, res) => {
    try {
      const { name, request, isPublic, userId } = req.body;
      
      const prayerRequest = await storage.createPrayerRequest({
        userId: userId || null,
        name,
        request,
        isPublic: isPublic !== false // Default to true
      });
      
      res.json(prayerRequest);
    } catch (error) {
      console.error("Error creating prayer request:", error);
      res.status(500).json({ message: "Failed to create prayer request" });
    }
  });

  app.post("/api/prayer-interactions", async (req, res) => {
    try {
      const { prayerRequestId, type, userId } = req.body;
      
      // Create the interaction
      const interaction = await storage.createPrayerInteraction({
        prayerRequestId,
        userId: userId || null,
        type
      });
      
      // Increment the counter
      await storage.incrementPrayerRequestCounter(prayerRequestId, type as 'candles' | 'prayers');
      
      res.json(interaction);
    } catch (error) {
      console.error("Error creating prayer interaction:", error);
      res.status(500).json({ message: "Failed to create prayer interaction" });
    }
  });

  // Community email signup endpoint
  app.post("/api/community-signup", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const { email } = req.body;
      
      // Update user email if provided
      if (email) {
        await storage.upsertUser({
          id: userId,
          email,
          updatedAt: new Date()
        });
      }
      
      // Award XP and update stats
      const stats = await storage.getUserStats(userId);
      const currentXP = stats?.totalXP || 0;
      const newXP = currentXP + 25;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      await storage.createOrUpdateUserStats({
        userId,
        totalXP: newXP,
        level: newLevel,
        lastActiveDate: getChicagoDateString()
      });
      
      // Award community member achievement
      await storage.createUserAchievement({
        userId,
        achievementType: "community_member",
        achievementName: "Divine Community Member",
        description: "Joined the divine community",
        isUnlocked: true,
        unlockedAt: new Date()
      });
      
      // Send welcome email
      if (email) {
        try {
          await sendWelcomeEmail(email);
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail the signup if email fails
        }
      }
      
      res.json({
        success: true,
        xpEarned: 25,
        totalXP: newXP,
        level: newLevel,
        achievementUnlocked: "Divine Community Member"
      });
    } catch (error) {
      console.error("Error in community signup:", error);
      res.status(500).json({ message: "Failed to complete community signup" });
    }
  });

  // Divine Shop endpoint
  app.get("/api/divine-shop", (req, res) => {
    const shopItems = [
      {
        id: 1,
        title: "Sacred Crystal Collection",
        description: "Handpicked crystals for divine energy alignment and spiritual protection",
        price: 88,
        link: '/shop/crystals',
        image: '/shop/crystals.jpg'
      },
      {
        id: 2,
        title: "Divine Meditation Bundle", 
        description: "Everything you need for deep spiritual meditation and connection",
        price: 144,
        link: '/shop/meditation',
        image: '/shop/meditation.jpg'
      },
      {
        id: 3,
        title: "1:1 Divine Strategy Session",
        description: "Personal guidance session with Vanessa Rich for your spiritual journey",
        price: 333,
        link: 'sms:310-990-6264?body=Hi Vanessa, I would like to book a 1:1 Divine Strategy Session.',
        image: '/shop/session.jpg'
      },
      {
        id: 4,
        title: "Sacred Essential Oil Set",
        description: "Pure essential oils for chakra balancing and spiritual cleansing rituals",
        price: 77,
        link: '/shop/oils',
        image: '/shop/oils.jpg'
      }
    ];
    
    res.json(shopItems);
  });

  // Admin routes (protected with key)
  const adminAuth = (req: any, res: any, next: any) => {
    const { key } = req.query;
    if (key !== "divine-admin-2025") {
      return res.status(401).json({ message: "Unauthorized admin access" });
    }
    next();
  };

  app.get("/api/admin/users", adminAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users for admin:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Notification signup endpoints
  app.post("/api/notification-signup", async (req, res) => {
    try {
      const { email, name, featureType } = req.body;
      
      const signup = await storage.createNotificationSignup({
        email,
        name,
        featureType
      });
      
      res.json({ success: true, signup });
    } catch (error) {
      console.error("Error creating notification signup:", error);
      res.status(500).json({ message: "Failed to create notification signup" });
    }
  });

  app.get("/api/admin/notifications", adminAuth, async (req, res) => {
    try {
      const { featureType } = req.query;
      const signups = await storage.getNotificationSignups(featureType as string);
      res.json(signups);
    } catch (error) {
      console.error("Error fetching notification signups:", error);
      res.status(500).json({ message: "Failed to fetch notification signups" });
    }
  });

  app.delete("/api/admin/notifications/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNotificationSignup(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting notification signup:", error);
      res.status(500).json({ message: "Failed to delete notification signup" });
    }
  });

  // Bulk email import endpoints
  app.post("/api/admin/bulk-emails", adminAuth, async (req, res) => {
    try {
      const emailData = req.body;
      
      if (Array.isArray(emailData)) {
        // Bulk import
        const emailImports = await storage.bulkCreateEmailImports(emailData);
        res.json({ success: true, count: emailImports.length, emailImports });
      } else {
        // Single import
        const emailImport = await storage.createBulkEmailImport(emailData);
        res.json({ success: true, emailImport });
      }
    } catch (error) {
      console.error("Error creating bulk email import:", error);
      res.status(500).json({ message: "Failed to create bulk email import" });
    }
  });

  app.get("/api/admin/bulk-emails", adminAuth, async (req, res) => {
    try {
      const { tag } = req.query;
      const emailImports = await storage.getBulkEmailImports(tag as string);
      res.json(emailImports);
    } catch (error) {
      console.error("Error fetching bulk email imports:", error);
      res.status(500).json({ message: "Failed to fetch bulk email imports" });
    }
  });

  app.put("/api/admin/bulk-emails/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const emailImport = await storage.updateBulkEmailImport(parseInt(id), updates);
      res.json({ success: true, emailImport });
    } catch (error) {
      console.error("Error updating bulk email import:", error);
      res.status(500).json({ message: "Failed to update bulk email import" });
    }
  });

  app.delete("/api/admin/bulk-emails/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBulkEmailImport(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting bulk email import:", error);
      res.status(500).json({ message: "Failed to delete bulk email import" });
    }
  });

  // Email campaign endpoint
  app.post("/api/admin/email-campaign", adminAuth, async (req, res) => {
    try {
      const { tag, subject, content, fromEmail } = req.body;
      
      const emailImports = await storage.getBulkEmailImportsByTag(tag);
      
      if (emailImports.length === 0) {
        return res.status(400).json({ message: "No emails found for the specified tag" });
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const emailImport of emailImports) {
        try {
          const personalizedContent = content
            .replace(/\{firstName\}/g, emailImport.firstName || 'Divine Soul')
            .replace(/\{lastName\}/g, emailImport.lastName || '')
            .replace(/\{email\}/g, emailImport.email);
          
          await sendEmail({
            to: emailImport.email,
            from: fromEmail || 'vanessa.rich@aol.com',
            subject,
            html: personalizedContent
          });
          
          successCount++;
        } catch (emailError) {
          console.error(`Failed to send email to ${emailImport.email}:`, emailError);
          errorCount++;
        }
      }
      
      res.json({
        success: true,
        totalEmails: emailImports.length,
        successCount,
        errorCount,
        message: `Campaign sent: ${successCount} successful, ${errorCount} failed`
      });
    } catch (error) {
      console.error("Error sending email campaign:", error);
      res.status(500).json({ message: "Failed to send email campaign" });
    }
  });

  // Divine feedback endpoints
  app.post("/api/divine-feedback", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const user = await storage.getUser(userId);
      
      const feedbackData = {
        userId,
        email: user?.email || null,
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null,
        ...req.body
      };
      
      const feedback = await storage.createDivineFeedback(feedbackData);
      res.json({ success: true, feedback });
    } catch (error) {
      console.error("Error creating divine feedback:", error);
      res.status(500).json({ message: "Failed to create divine feedback" });
    }
  });

  app.get("/api/admin/divine-feedback", adminAuth, async (req, res) => {
    try {
      const feedback = await storage.getDivineFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching divine feedback:", error);
      res.status(500).json({ message: "Failed to fetch divine feedback" });
    }
  });

  // Spiritual Chat endpoints
  app.get("/api/chat/conversations", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const conversations = await storage.getChatConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post("/api/chat/conversations", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const { title } = req.body;
      
      const conversation = await storage.createChatConversation({
        userId,
        title: title || "New Spiritual Conversation"
      });
      
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/chat/conversations/:id/messages", universalAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getChatMessages(parseInt(id));
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  function determineSupport(feeling: string) {
    const feelingKeywords = feeling.toLowerCase();
    
    // Anxious/Overwhelmed → Clarity & Calm ($222)
    if (feelingKeywords.includes('anxious') || feelingKeywords.includes('overwhelmed') || 
        feelingKeywords.includes('stressed') || feelingKeywords.includes('worry') ||
        feelingKeywords.includes('panic') || feelingKeywords.includes('fear')) {
      return 'anxious';
    }
    
    // Abundance/Money → Abundance Frequency Upgrade ($333)
    if (feelingKeywords.includes('abundance') || feelingKeywords.includes('money') || 
        feelingKeywords.includes('wealth') || feelingKeywords.includes('financial') ||
        feelingKeywords.includes('prosperity') || feelingKeywords.includes('rich')) {
      return 'abundance';
    }
    
    // Work/Career → Career Clarity Session ($311)
    if (feelingKeywords.includes('work') || feelingKeywords.includes('career') || 
        feelingKeywords.includes('job') || feelingKeywords.includes('professional') ||
        feelingKeywords.includes('business') || feelingKeywords.includes('promotion')) {
      return 'work';
    }
    
    // Relationship/Love → Sacred Union Reading ($288)
    if (feelingKeywords.includes('relationship') || feelingKeywords.includes('love') || 
        feelingKeywords.includes('partner') || feelingKeywords.includes('dating') ||
        feelingKeywords.includes('marriage') || feelingKeywords.includes('romance')) {
      return 'love';
    }
    
    // Family/Generational → Family Harmony Healing ($266)
    if (feelingKeywords.includes('family') || feelingKeywords.includes('generational') || 
        feelingKeywords.includes('parents') || feelingKeywords.includes('children') ||
        feelingKeywords.includes('siblings') || feelingKeywords.includes('heritage')) {
      return 'family';
    }
    
    // Purpose/Soul → Soul Purpose Activation ($355)
    if (feelingKeywords.includes('purpose') || feelingKeywords.includes('soul') || 
        feelingKeywords.includes('calling') || feelingKeywords.includes('destiny') ||
        feelingKeywords.includes('mission') || feelingKeywords.includes('path')) {
      return 'purpose';
    }
    
    // Health/Healing → Divine Healing Session ($244)
    if (feelingKeywords.includes('health') || feelingKeywords.includes('healing') || 
        feelingKeywords.includes('wellness') || feelingKeywords.includes('illness') ||
        feelingKeywords.includes('recovery') || feelingKeywords.includes('pain')) {
      return 'health';
    }
    
    // Power/Confidence → Empress Empowerment ($322)
    if (feelingKeywords.includes('power') || feelingKeywords.includes('confidence') || 
        feelingKeywords.includes('strength') || feelingKeywords.includes('leadership') ||
        feelingKeywords.includes('authority') || feelingKeywords.includes('control')) {
      return 'power';
    }
    
    // Default to Divine Reset Ritual ($444) for general spiritual needs
    return 'reset';
  }

  function getSeraphineSupport(feelingKeyword: string) {
    const sacredSessions = {
      anxious: {
        title: "Clarity & Calm Sacred Session",
        price: "$222",
        ritual: "Sacred Reset Ritual",
        crystal: "Amethyst for peace and tranquility",
        prayer: "May divine peace flow through every cell of my being, releasing all anxiety and fear",
        description: "Channel divine tranquility and release overwhelming energy"
      },
      abundance: {
        title: "Abundance Frequency Upgrade", 
        price: "$333",
        ritual: "Abundance Awakening Ritual",
        crystal: "Citrine for prosperity consciousness",
        prayer: "I am a magnet for divine abundance and all good flows to me effortlessly",
        description: "Align with infinite prosperity and wealth consciousness"
      },
      work: {
        title: "Career Clarity Sacred Session",
        price: "$311", 
        ritual: "Purpose Alignment Practice",
        crystal: "Pyrite for professional success",
        prayer: "Guide me to my highest professional calling and divine work purpose",
        description: "Receive divine guidance for your professional path"
      },
      love: {
        title: "Sacred Union Reading",
        price: "$288",
        ritual: "Lovers Restoration Ritual", 
        crystal: "Rose Quartz for heart opening",
        prayer: "Prepare my heart for sacred love and divine partnership",
        description: "Open your heart to divine love and sacred partnership"
      },
      family: {
        title: "Family Harmony Healing",
        price: "$266",
        ritual: "Family Harmony Ritual",
        crystal: "Green Aventurine for family healing",
        prayer: "Heal all generational wounds and restore divine harmony to my lineage",
        description: "Heal family wounds and restore generational harmony"
      },
      purpose: {
        title: "Soul Purpose Activation", 
        price: "$355",
        ritual: "Divine Purpose Discovery",
        crystal: "Clear Quartz for soul clarity",
        prayer: "Reveal my sacred purpose and align me with my soul's mission",
        description: "Activate your divine purpose and soul mission"
      },
      health: {
        title: "Divine Healing Session",
        price: "$244",
        ritual: "Sacred Healing Practice",
        crystal: "Fluorite for healing energy", 
        prayer: "Channel divine healing light through every aspect of my being",
        description: "Receive divine healing energy for body, mind, and spirit"
      },
      power: {
        title: "Empress Empowerment",
        price: "$322",
        ritual: "Divine Power Activation",
        crystal: "Garnet for personal power",
        prayer: "I step into my divine power and lead with sacred authority",
        description: "Embody your divine feminine power and leadership"
      },
      reset: {
        title: "Divine Reset Ritual Session",
        price: "$444", 
        ritual: "Sacred Reset Ritual",
        crystal: "Selenite for spiritual cleansing",
        prayer: "Release all that no longer serves and welcome divine renewal",
        description: "Complete spiritual reset and divine realignment"
      }
    };
    
    return sacredSessions[feelingKeyword] || sacredSessions.reset;
  }

  function handleSeraphineChoice(choice: string, sessionData: any) {
    const responses = {
      ritual: `✨ Beautiful! The ${sessionData.ritual} is perfect for your energy right now.\n\n🔮 Here's your sacred practice:\n• Light a white candle\n• Hold ${sessionData.crystal}\n• Speak this prayer: "${sessionData.prayer}"\n• Trust in divine timing\n\nWould you like me to send you the complete ritual guide, or would you prefer to schedule your ${sessionData.title}?`,
      
      session: `🌟 Perfect timing, divine soul! Your ${sessionData.title} (${sessionData.price}) is exactly what your spirit needs.\n\n📱 Text Vanessa now to book:\n"Hi Vanessa, I'm ready to book my ${sessionData.title} after speaking with Seraphine"\n\n✨ This sacred session will transform your energy and align you with divine guidance. Are you ready to take this beautiful step?`,
      
      journal: `📝 Sacred journaling is such powerful medicine! Here's a divine prompt for your current energy:\n\n"What would I choose if I knew I was completely supported by the Universe?"\n\n💫 Write for 10 minutes without stopping. Let your soul speak freely. Often our deepest wisdom emerges when we give ourselves permission to dream beyond our current circumstances.\n\nWhat insights are coming through as you consider this question?`,
      
      continue: `🕊️ I'm honored to hold space for whatever you'd like to share. Your spiritual journey is sacred, and every feeling you're experiencing has divine purpose.\n\nWhat else is on your heart right now? I'm here to listen with complete love and understanding.`
    };
    
    return responses[choice] || responses.continue;
  }

  function generateSeraphineCheckIn(feeling: string) {
    return `💜 Sweet soul, I can feel the energy around "${feeling}" - thank you for sharing so authentically.\n\nLet's dive deeper into your divine guidance with these sacred questions:\n\n🌙 **1. Energy Check:** On a scale of 1-10, how is this affecting your spiritual well-being?\n\n✨ **2. Divine Timing:** What feels most urgent to shift in this area of your life?\n\n🔮 **3. Sacred Support:** What kind of divine intervention would feel most supportive right now?\n\nTake a moment to breathe and let your soul answer. I'm here to channel the perfect guidance for your highest good. 💫`;
  }

  function getSuggestion(feeling: string, focus: string, support: string) {
    const feelingKeyword = determineSupport(feeling);
    const sessionData = getSeraphineSupport(feelingKeyword);
    
    return `🌟 **Divine Guidance Received** 🌟\n\nBased on your beautiful sharing about "${feeling}", your energy is calling for ${sessionData.description}.\n\n✨ **Your Sacred Recommendations:**\n🔮 **Session:** ${sessionData.title} (${sessionData.price})\n🌿 **Ritual:** ${sessionData.ritual}\n💎 **Crystal:** ${sessionData.crystal}\n🙏 **Prayer:** "${sessionData.prayer}"\n\n💫 **Choose your next divine step:**\n1. 🕊️ Learn the ritual practice\n2. 📱 Schedule sacred session\n3. 📝 Receive journal prompt\n4. 💜 Continue sharing\n\nWhat feels most aligned for your soul right now?`;
  }

  // Sacred Energy Check-In endpoints
  app.get("/api/sacred-check-in/questions", (req, res) => {
    const questions = [
      {
        id: 1,
        question: "What's the primary feeling or energy you're experiencing right now?",
        type: "text",
        placeholder: "I'm feeling..."
      },
      {
        id: 2,
        question: "On a scale of 1-10, how is this affecting your spiritual well-being?",
        type: "scale",
        min: 1,
        max: 10
      },
      {
        id: 3,
        question: "What kind of divine intervention would feel most supportive right now?",
        type: "text", 
        placeholder: "I need support with..."
      }
    ];
    
    res.json({ questions });
  });

  app.post("/api/sacred-check-in/complete", universalAuth, async (req: any, res) => {
    try {
      const { answers } = req.body;
      const feeling = answers[0] || "seeking guidance";
      const wellbeingScore = answers[1] || 5;
      const support = answers[2] || "general guidance";
      
      const suggestion = getSuggestion(feeling, wellbeingScore.toString(), support);
      
      res.json({
        success: true,
        suggestion,
        supportType: determineSupport(feeling)
      });
    } catch (error) {
      console.error("Error completing sacred check-in:", error);
      res.status(500).json({ message: "Failed to complete check-in" });
    }
  });

  // Test endpoint for Seraphine support
  app.get("/api/seraphine-support/:feeling", (req, res) => {
    const { feeling } = req.params;
    const supportType = determineSupport(feeling);
    const sessionData = getSeraphineSupport(supportType);
    
    res.json({
      feeling,
      supportType,
      sessionData,
      checkIn: generateSeraphineCheckIn(feeling)
    });
  });

  app.post("/api/chat/message", universalAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const { conversationId, message, isCheckIn, checkInAnswers } = req.body;
      
      // Get or create conversation
      let conversation;
      if (conversationId) {
        conversation = await storage.getChatConversation(conversationId);
      } else {
        conversation = await storage.createChatConversation({
          userId,
          title: "Spiritual Guidance Session"
        });
      }
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // Save user message
      await storage.createChatMessage({
        conversationId: conversation.id,
        role: "user",
        content: message
      });
      
      // Handle Sacred Energy Check-In
      if (isCheckIn && checkInAnswers) {
        const feeling = checkInAnswers[0] || "seeking guidance";
        const suggestion = getSuggestion(feeling, checkInAnswers[1], checkInAnswers[2]);
        
        // Save Seraphine's response
        const responseMessage = await storage.createChatMessage({
          conversationId: conversation.id,
          role: "assistant",
          content: suggestion
        });
        
        return res.json({
          message: responseMessage,
          conversationId: conversation.id
        });
      }
      
      // Get user context for personalized guidance
      const userContext = await storage.getRecentUserContext(userId);
      
      // Get spiritual guidance from OpenAI
      const guidance = await getSpiritualGuidance(message, userContext);
      
      // Save Seraphine's response
      const responseMessage = await storage.createChatMessage({
        conversationId: conversation.id,
        role: "assistant", 
        content: guidance.response,
        metadata: {
          energyInsight: guidance.energyInsight,
          sacredAction: guidance.sacredAction
        }
      });
      
      // Update conversation with latest activity
      await storage.updateChatConversation(conversation.id, {
        updatedAt: new Date()
      });
      
      res.json({
        message: responseMessage,
        conversationId: conversation.id,
        energyInsight: guidance.energyInsight,
        sacredAction: guidance.sacredAction
      });
      
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ 
        message: "I'm temporarily unable to channel divine guidance. Please try again in a moment, beautiful soul." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

## 13. CLIENT/INDEX.HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/generated-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="The Divine Vanity - A luxury spiritual empowerment platform for high-achieving women seeking divine connection and spiritual growth through daily rituals, sacred journaling, and divine energy assessments." />
    <meta property="og:title" content="The Divine Vanity - Luxury Spiritual Empowerment" />
    <meta property="og:description" content="Transform your spiritual journey with daily divine rituals, sacred journaling, and personalized energy assessments designed for high-achieving women." />
    <meta property="og:image" content="/attached_assets/75FABDA2-2B78-415E-AFCF-6E53D9ED849B_1751746284915.png" />
    <meta property="og:type" content="website" />
    <title>The Divine Vanity - Luxury Spiritual Empowerment</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 14. CLIENT/SRC/MAIN.TSX

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

## 15. CLIENT/SRC/INDEX.CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 48 100% 97%;
    --foreground: 240 10% 3.9%;
    --card: 48 100% 97%;
    --card-foreground: 240 10% 3.9%;
    --popover: 48 100% 97%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 45 93% 47%;
    --primary-foreground: 355 25% 95%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 45 93% 47%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 10.6% 64.9%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 45 93% 47%;
    --primary-foreground: 355 25% 95%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 45 93% 47%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 94.1%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 10.6% 64.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Montserrat', sans-serif;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
  }
}

.font-playfair {
  font-family: 'Playfair Display', serif;
}

.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}

/* Custom spiritual gradient backgrounds */
.divine-gradient {
  background: linear-gradient(135deg, #FFFEF7 0%, #F5F0E8 50%, #FFFBF5 100%);
}

.golden-gradient {
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%);
}

/* Sacred shimmer animation */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  animation: shimmer 3s infinite;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
  background-size: 1000px 100%;
}

/* Divine glow effect */
.divine-glow {
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

/* Sacred pulse animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.sacred-pulse {
  animation: pulse 2s infinite;
}

/* Floating animation for spiritual elements */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.float {
  animation: float 3s ease-in-out infinite;
}
```

## 16. CLIENT/SRC/APP.TSX

```typescript
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/BottomNavigation";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import DailyRitual from "@/pages/DailyRitual";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import DivineEnergyQuiz from "@/pages/DivineEnergyQuiz";
import PrayerRoom from "@/pages/PrayerRoom";
import DivineVault from "@/pages/DivineVault";
import SpiritualChat from "@/pages/SpiritualChat";
import Login from "@/pages/Login";
import UserSetup from "@/pages/UserSetup";
import Onboarding from "@/pages/Onboarding";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminNotifications from "@/pages/AdminNotifications";
import AdminBulkEmails from "@/pages/AdminBulkEmails";
import AdminFeedback from "@/pages/AdminFeedback";
import WelcomeGift from "@/pages/WelcomeGift";
import Subscribe from "@/pages/Subscribe";
import SoundDemo from "@/pages/SoundDemo";
import DivineFeedback from "@/pages/DivineFeedback";
import FeedbackBanner from "@/components/FeedbackBanner";
import RitualIndex from "@/pages/Rituals/index";
import SacredReset from "@/pages/Rituals/SacredReset";
import AbundanceAwakening from "@/pages/Rituals/AbundanceAwakening";
import LoversRestore from "@/pages/Rituals/LoversRestore";
import FamilyHarmonyRitual from "@/pages/Rituals/FamilyHarmonyRitual";
import LoveAlignmentRitual from "@/pages/Rituals/LoveAlignmentRitual";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Show login page for unauthenticated users (except for admin and feedback pages)
  if (!isLoading && !isAuthenticated && !location.startsWith("/admin") && location !== "/divine-feedback") {
    return (
      <div className="min-h-screen bg-cream">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/setup" component={UserSetup} />
          <Route path="/" component={Landing} />
          <Route component={Login} />
        </Switch>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <FeedbackBanner />
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/ritual" component={DailyRitual} />
            <Route path="/journal" component={Journal} />
            <Route path="/chat" component={SpiritualChat} />
            <Route path="/profile" component={Profile} />
            <Route path="/divine-energy-assessment" component={DivineEnergyQuiz} />
            <Route path="/prayer-room" component={PrayerRoom} />
            <Route path="/vault" component={DivineVault} />
            <Route path="/subscribe" component={Subscribe} />
            <Route path="/rituals" component={RitualIndex} />
            <Route path="/rituals/sacred-reset" component={SacredReset} />
            <Route path="/rituals/abundance-awakening" component={AbundanceAwakening} />
            <Route path="/rituals/lovers-restore" component={LoversRestore} />
            <Route path="/rituals/family-harmony" component={FamilyHarmonyRitual} />
            <Route path="/rituals/love-alignment" component={LoveAlignmentRitual} />
          </>
        )}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/notifications" component={AdminNotifications} />
        <Route path="/admin/bulk-emails" component={AdminBulkEmails} />
        <Route path="/admin/feedback" component={AdminFeedback} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/welcome-gift" component={WelcomeGift} />
        <Route path="/sounds" component={SoundDemo} />
        <Route path="/divine-feedback" component={DivineFeedback} />
      </Switch>
      
      {/* Only show bottom navigation for authenticated users */}
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
}
```

Let me continue with the complete client-side codebase by adding all the essential components, pages, and utilities.