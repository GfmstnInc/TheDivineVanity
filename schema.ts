import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  varchar,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique(),
  passwordHash: varchar("password_hash"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  birthDate: varchar("birth_date"), // YYYY-MM-DD format for astrology calculations
  birthTime: varchar("birth_time"), // HH:MM format for precise astrology readings
  birthLocation: varchar("birth_location"), // City, State/Country for astrology coordinates
  subscriptionStatus: text("subscription_status").notNull().default("free"),
  role: text("role").notNull().default("member"), // guest, member, premium, admin, super_admin
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  freeMonthsRemaining: integer("free_months_remaining").default(0),
  isPermanentPremium: boolean("is_permanent_premium").default(false),
  isAdmin: boolean("is_admin").default(false),
  isOnboarded: boolean("is_onboarded").default(false),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  twoFactorSecret: varchar("two_factor_secret"),
  sacredArchetype: varchar("sacred_archetype"), // Divine spiritual identity like "The Mystic Healer", "The Intuitive Empress"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyRituals = pgTable("daily_rituals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  duration: text("duration").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull().default("affirmation"),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  prompt: text("prompt").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const premiumContent = pgTable("premium_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "pdf", "audio", "video"
  url: text("url").notNull(),
  requiredSubscription: text("required_subscription").notNull().default("premium"),
});

export const chakraQuizResults = pgTable("chakra_quiz_results", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  dominantChakra: text("dominant_chakra").notNull(),
  imbalancedChakra: text("imbalanced_chakra").notNull(),
  scores: text("scores").notNull(), // JSON string of all chakra scores
  recommendations: text("recommendations").notNull(), // JSON string of personalized recommendations
  createdAt: timestamp("created_at").defaultNow().notNull(),
});



export const astrologyReadings = pgTable("astrology_readings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // "daily" or "monthly"
  date: text("date").notNull(), // YYYY-MM-DD format
  sunSign: text("sun_sign").notNull(),
  moonPhase: text("moon_phase").notNull(),
  planetaryInfluences: text("planetary_influences").array(), // Array of planet influences
  personalizedMessage: text("personalized_message").notNull(),
  loveAndRelationships: text("love_and_relationships").notNull(),
  careerAndFinances: text("career_and_finances").notNull(),
  healthAndWellness: text("health_and_wellness").notNull(),
  spiritualGuidance: text("spiritual_guidance").notNull(),
  luckyNumbers: text("lucky_numbers").array(), // Array of numbers as strings
  luckyColors: text("lucky_colors").array(), // Array of color names
  crystalRecommendation: text("crystal_recommendation").notNull(),
  affirmation: text("affirmation").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  paymentAmount: integer("payment_amount").default(0), // Amount in cents
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  achievementType: text("achievement_type").notNull(), // "daily_streak", "journal_count", "chakra_mastery", etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Icon name or emoji
  rarity: text("rarity").notNull(), // "common", "rare", "epic", "legendary"
  progress: integer("progress").notNull().default(0),
  maxProgress: integer("max_progress").notNull(),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  dailyStreak: integer("daily_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  totalJournalEntries: integer("total_journal_entries").notNull().default(0),
  totalChakraQuizzes: integer("total_chakra_quizzes").notNull().default(0),
  totalRitualsCompleted: integer("total_rituals_completed").notNull().default(0),
  spiritualLevel: integer("spiritual_level").notNull().default(1),
  experiencePoints: integer("experience_points").notNull().default(0),
  lastActiveDate: text("last_active_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ritualCompletions = pgTable("ritual_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  ritualId: integer("ritual_id").notNull(),
  ritualDate: text("ritual_date").notNull(), // YYYY-MM-DD format
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Prayer Room tables
export const prayers = pgTable("prayers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // "Healing", "Peace", "Gratitude", etc.
  authorId: varchar("author_id").notNull(), // Admin/creator ID
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  requesterName: text("requester_name"), // Optional
  message: text("message").notNull(),
  isPublic: boolean("is_public").default(false),
  candlesLit: integer("candles_lit").default(0),
  prayersSaid: integer("prayers_said").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Intake Assessment System
export const intakeAssessments = pgTable("intake_assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  assessmentType: text("assessment_type").notNull().default("decode_you"), // "decode_you", "intake", "follow_up"
  
  // 5 Categories of Questions
  mentalState: jsonb("mental_state"), // Mental category responses
  physicalState: jsonb("physical_state"), // Physical category responses
  spiritualState: jsonb("spiritual_state"), // Spiritual category responses
  emotionalState: jsonb("emotional_state"), // Emotional category responses
  behavioralState: jsonb("behavioral_state"), // Behavioral category responses
  
  // Additional Context
  notes: text("notes"),
  sessionContext: text("session_context"), // When/why assessment was taken
  
  // AI Analysis Results
  aiInsights: jsonb("ai_insights"), // Comprehensive Vanessa analysis
  psychologicalProfile: jsonb("psychological_profile"), // User type, growth phase, etc.
  energyProfile: jsonb("energy_profile"), // Energy signature and chakra focus
  safetyAssessment: jsonb("safety_assessment"), // Risk level and protocols
  recommendations: jsonb("recommendations"), // Personalized suggestions
  
  // Analytics for Client Portal
  sessionTags: text("session_tags").array(), // Searchable tags
  riskLevel: text("risk_level").notNull().default("low"), // low, medium, high
  clientPortalSummary: text("client_portal_summary"), // Summary for practitioner
  implementationSuggestions: jsonb("implementation_suggestions"), // How to help
  
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Portal Analytics
export const clientPortalInsights = pgTable("client_portal_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  
  // Summary for Practitioner
  currentStateOverview: text("current_state_overview").notNull(),
  keyInsights: text("key_insights").array(),
  concernAreas: text("concern_areas").array(),
  strengthsIdentified: text("strengths_identified").array(),
  
  // Suggested Interventions
  recommendedSessions: jsonb("recommended_sessions"),
  practiceRecommendations: text("practice_recommendations").array(),
  supportPriorities: text("support_priorities").array(),
  
  // Tracking and Follow-up
  progressIndicators: jsonb("progress_indicators"),
  nextAssessmentDate: timestamp("next_assessment_date"),
  followUpNotes: text("follow_up_notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Behavioral Tracking & Personalized Discount System
export const userBehaviorTracking = pgTable("user_behavior_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  actionType: text("action_type").notNull(), // "login", "page_visit", "feature_use", "time_spent", "click", "scroll"
  pagePath: text("page_path"), // "/journal", "/vanessa-ai", "/shop", etc.
  featureName: text("feature_name"), // "daily_ritual", "journal_entry", "chakra_quiz", etc.
  timeSpent: integer("time_spent"), // seconds
  interactionDepth: integer("interaction_depth").default(1), // how deep user went (clicks, scrolls, etc.)
  deviceType: text("device_type"), // "mobile", "desktop", "tablet"
  browserInfo: text("browser_info"),
  metadata: jsonb("metadata"), // additional context data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreferenceProfiles = pgTable("user_preference_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  // Login Patterns
  preferredLoginTimes: jsonb("preferred_login_times"), // [{"hour": 9, "frequency": 15}, {"hour": 21, "frequency": 12}]
  loginFrequency: text("login_frequency"), // "daily", "weekly", "sporadic"
  avgSessionDuration: integer("avg_session_duration"), // minutes
  
  // Content Preferences
  mostUsedSections: jsonb("most_used_sections"), // [{"section": "journal", "usage_count": 45}, {"section": "rituals", "usage_count": 32}]
  favoriteFeatures: jsonb("favorite_features"), // ["daily_ritual", "vanessa_ai", "energy_assessment"]
  contentEngagementStyle: text("content_engagement_style"), // "deep_explorer", "quick_browser", "ritual_focused", "journal_focused"
  
  // Purchase Behavior Predictions
  purchaseLikelihood: integer("purchase_likelihood").default(0), // 0-100 score
  interestedCategories: jsonb("interested_categories"), // ["sessions", "courses", "digital_products"]
  priceRange: text("price_range"), // "budget", "mid_range", "premium"
  discountSensitivity: integer("discount_sensitivity").default(50), // 0-100 (higher = more likely to buy with discount)
  
  // Spiritual Journey Stage
  spiritualMaturityLevel: integer("spiritual_maturity_level").default(1), // 1-10
  primaryIntentions: jsonb("primary_intentions"), // ["healing", "manifestation", "self_love", "career"]
  recommendedOfferings: jsonb("recommended_offerings"), // Vanessa's curated recommendations
  
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const personalizedOffers = pgTable("personalized_offers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  offerType: text("offer_type").notNull(), // "session", "course", "digital_product", "bundle"
  productName: text("product_name").notNull(),
  originalPrice: integer("original_price").notNull(), // in cents
  discountPercentage: integer("discount_percentage").notNull(), // 0-30
  discountedPrice: integer("discounted_price").notNull(), // in cents
  reason: text("reason").notNull(), // Why Vanessa is offering this
  targetingReason: text("targeting_reason").notNull(), // Based on behavior analysis
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  presentedAt: timestamp("presented_at"),
  acceptedAt: timestamp("accepted_at"),
  rejectedAt: timestamp("rejected_at"),
  conversionMetrics: jsonb("conversion_metrics"), // tracking data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const digitalProducts = pgTable("digital_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "session", "course", "guide", "meditation", "ritual"
  basePrice: integer("base_price").notNull(), // in cents
  maxDiscountAllowed: integer("max_discount_allowed").default(30), // percentage
  tags: jsonb("tags"), // ["healing", "abundance", "relationships", etc.]
  targetAudience: jsonb("target_audience"), // behavioral triggers for recommendations
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prayerInteractions = pgTable("prayer_interactions", {
  id: serial("id").primaryKey(),
  prayerRequestId: integer("prayer_request_id").notNull(),
  userId: varchar("user_id").notNull(),
  interactionType: text("interaction_type").notNull(), // "candle" or "prayer"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mood-Based Meditation Engine tables
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "stressed", "anxious", "peaceful", "energized", etc.
  description: text("description").notNull(),
  color: text("color").notNull(), // hex color for UI
  icon: text("icon").notNull(), // emoji or icon name
  category: text("category").notNull(), // "negative", "neutral", "positive"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meditations = pgTable("meditations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  type: text("type").notNull(), // "breathing", "visualization", "affirmation", "body_scan"
  content: jsonb("content").notNull(), // structured meditation content
  targetMoods: text("target_moods").array().notNull(), // mood IDs this meditation helps with
  difficulty: text("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  tags: text("tags").array().default([]), // additional tags
  audioUrl: text("audio_url"), // optional audio guide
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userMoodLogs = pgTable("user_mood_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  moodId: integer("mood_id").notNull(),
  intensity: integer("intensity").notNull(), // 1-5 scale
  notes: text("notes"), // optional user notes
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
});

export const meditationSessions = pgTable("meditation_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  meditationId: integer("meditation_id").notNull(),
  preMoodId: integer("pre_mood_id"), // mood before meditation
  postMoodId: integer("post_mood_id"), // mood after meditation
  duration: integer("duration").notNull(), // actual duration completed
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  rating: integer("rating"), // 1-5 user rating
  notes: text("notes"), // optional reflection
});

export const notificationSignups = pgTable("notification_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  featureType: varchar("feature_type").notNull(), // e.g., "live_group_ceremonies"
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bulk email imports table for admin dashboard
export const bulkEmailImports = pgTable("bulk_email_imports", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  tag: varchar("tag").notNull(), // Waitlist, Premium, Retreat Interest, etc.
  source: varchar("source").default("Manual"), // CSV, Manual, API, etc.
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Chat usage tracking for daily limits
export const aiChatUsage = pgTable("ai_chat_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  chatDate: varchar("chat_date").notNull(), // YYYY-MM-DD format
  messageCount: integer("message_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User message usage tracking for daily limits
export const userMessageUsage = pgTable("user_message_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  messageCount: integer("message_count").default(0),
  lastReset: timestamp("last_reset").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Daily Check-ins for Journey Tracking
export const clientDailyCheckins = pgTable("client_daily_checkins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  mood: varchar("mood").notNull(), // "Radiant", "Blessed", "Peaceful", "Reflective", "Powerful", "Grateful", "Overwhelmed", "Uncertain"
  moodIntensity: integer("mood_intensity").notNull(), // 1-10 scale
  energyLevel: integer("energy_level").notNull(), // 1-10 scale
  intention: text("intention").notNull(),
  currentFocus: text("current_focus"),
  challengesToday: text("challenges_today"),
  gratefulFor: text("grateful_for"),
  needsSupport: text("needs_support"),
  journeyReflection: text("journey_reflection"),
  checkinDate: varchar("checkin_date").notNull(), // YYYY-MM-DD format
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Journey Progress for Coach Tracking
export const clientJourneyProgress = pgTable("client_journey_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  currentStage: varchar("current_stage").notNull().default("Divine Foundation"),
  overallProgress: integer("overall_progress").default(0), // 0-100 percentage
  focusArea: text("focus_area").notNull().default("Reclaiming Self-Worth"),
  coachNotes: text("coach_notes"),
  focusedIntention: text("focused_intention"),
  areasOfAttention: text("areas_of_attention"),
  strengthsIdentified: text("strengths_identified"),
  challengesIdentified: text("challenges_identified"),
  nextSteps: text("next_steps"),
  lastCoachUpdate: timestamp("last_coach_update"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Client Mood Analytics for Trend Tracking
export const clientMoodAnalytics = pgTable("client_mood_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  weekStartDate: varchar("week_start_date").notNull(), // YYYY-MM-DD format
  averageMood: integer("average_mood"), // 1-10 scale
  averageEnergy: integer("average_energy"), // 1-10 scale
  moodTrend: varchar("mood_trend"), // "improving", "stable", "declining"
  energyTrend: varchar("energy_trend"), // "increasing", "stable", "decreasing"
  dominantMoods: text("dominant_moods").array(), // most frequent moods this week
  checkinsThisWeek: integer("checkins_this_week").default(0),
  supportNeeded: text("support_needed"),
  progressNotes: text("progress_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Message Usage for Premium Features
export const clientMessageUsage = pgTable("client_message_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  messageCount: integer("message_count").default(0),
  dailyLimit: integer("daily_limit").default(1), // 1 for free, 10 for premium
  lastMessageDate: varchar("last_message_date"), // YYYY-MM-DD format
  lastReset: timestamp("last_reset").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscription management for premium memberships
export const subscriptionManagement = pgTable("subscription_management", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  subscriptionType: varchar("subscription_type").notNull(), // "monthly", "free_month", "permanent"
  amount: integer("amount").default(4900), // $49.00 in cents
  startDate: timestamp("start_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").default(true),
  grantedByAdmin: boolean("granted_by_admin").default(false),
  notes: text("notes"), // Admin notes for manual grants
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Daily ritual check-ins for client portal
export const dailyRitualCheckins = pgTable("daily_ritual_checkins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  mood: varchar("mood").notNull(),
  intention: text("intention").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sacred Content Library for Seraphine™ content system
export const sacredContentLibrary = pgTable("sacred_content_library", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // 'affirmation', 'ritual', 'prayer', 'intention', 'manifestation'
  title: varchar("title", { length: 100 }).notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(), // ['abundance', 'grief', 'confidence']
  createdBy: varchar("created_by", { length: 50 }).default("Vanessa"),
  pdfUrl: text("pdf_url"), // optional download link for printable version
  visibility: varchar("visibility", { length: 20 }).default("all"), // 'all', 'premium', 'paid'
  dateAdded: timestamp("date_added").defaultNow().notNull(),
});

// User Sacred Content Log for tracking content delivery and saves
export const userSacredContentLog = pgTable("user_sacred_content_log", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  contentId: integer("content_id").notNull().references(() => sacredContentLibrary.id),
  dateSent: timestamp("date_sent").defaultNow().notNull(),
  isSaved: boolean("is_saved").default(false),
  interactionNotes: text("interaction_notes"), // e.g. 'user marked helpful'
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  passwordHash: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  profileImageUrl: true,
  subscriptionStatus: true,
  isOnboarded: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  profileImageUrl: true,
  isOnboarded: true,
});

export const insertDailyRitualSchema = createInsertSchema(dailyRituals).pick({
  title: true,
  content: true,
  audioUrl: true,
  duration: true,
  date: true,
  category: true,
});

export const insertDailyRitualCheckinSchema = createInsertSchema(dailyRitualCheckins).pick({
  userId: true,
  mood: true,
  intention: true,
});

export const insertSacredContentLibrarySchema = createInsertSchema(sacredContentLibrary).pick({
  type: true,
  title: true,
  content: true,
  tags: true,
  createdBy: true,
  pdfUrl: true,
  visibility: true,
});

export const insertUserSacredContentLogSchema = createInsertSchema(userSacredContentLog).pick({
  userId: true,
  contentId: true,
  isSaved: true,
  interactionNotes: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  userId: true,
  prompt: true,
  content: true,
  date: true,
});

export const insertPremiumContentSchema = createInsertSchema(premiumContent).pick({
  title: true,
  description: true,
  type: true,
  url: true,
  requiredSubscription: true,
});

export const insertChakraQuizResultSchema = createInsertSchema(chakraQuizResults).pick({
  userId: true,
  dominantChakra: true,
  imbalancedChakra: true,
  scores: true,
  recommendations: true,
});



export const insertUserAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementType: true,
  title: true,
  description: true,
  icon: true,
  rarity: true,
  progress: true,
  maxProgress: true,
  isUnlocked: true,
  unlockedAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).pick({
  userId: true,
  dailyStreak: true,
  longestStreak: true,
  totalJournalEntries: true,
  totalChakraQuizzes: true,
  totalRitualsCompleted: true,
  spiritualLevel: true,
  experiencePoints: true,
  lastActiveDate: true,
});

export const insertRitualCompletionSchema = createInsertSchema(ritualCompletions).pick({
  userId: true,
  ritualId: true,
  ritualDate: true,
});

// Prayer Room schemas
export const insertPrayerSchema = createInsertSchema(prayers).pick({
  title: true,
  content: true,
  category: true,
  authorId: true,
  isPublished: true,
});

export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).pick({
  requesterName: true,
  message: true,
  isPublic: true,
});

export const insertPrayerInteractionSchema = createInsertSchema(prayerInteractions).pick({
  prayerRequestId: true,
  userId: true,
  interactionType: true,
});

// Mood-Based Meditation schemas
export const insertMoodSchema = createInsertSchema(moods).pick({
  name: true,
  description: true,
  color: true,
  icon: true,
  category: true,
});

export const insertMeditationSchema = createInsertSchema(meditations).pick({
  title: true,
  description: true,
  duration: true,
  type: true,
  content: true,
  targetMoods: true,
  difficulty: true,
  tags: true,
  audioUrl: true,
  isPublished: true,
});

export const insertUserMoodLogSchema = createInsertSchema(userMoodLogs).pick({
  userId: true,
  moodId: true,
  intensity: true,
  notes: true,
});

export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).pick({
  userId: true,
  meditationId: true,
  preMoodId: true,
  postMoodId: true,
  duration: true,
  rating: true,
  notes: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  journalEntries: many(journalEntries),
  chakraQuizResults: many(chakraQuizResults),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, {
    fields: [journalEntries.userId],
    references: [users.id],
  }),
}));

export const chakraQuizResultsRelations = relations(chakraQuizResults, ({ one }) => ({
  user: one(users, {
    fields: [chakraQuizResults.userId],
    references: [users.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const sacredContentLibraryRelations = relations(sacredContentLibrary, ({ many }) => ({
  userLogs: many(userSacredContentLog),
}));

export const userSacredContentLogRelations = relations(userSacredContentLog, ({ one }) => ({
  user: one(users, {
    fields: [userSacredContentLog.userId],
    references: [users.id],
  }),
  content: one(sacredContentLibrary, {
    fields: [userSacredContentLog.contentId],
    references: [sacredContentLibrary.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type DailyRitual = typeof dailyRituals.$inferSelect;
export type InsertDailyRitual = z.infer<typeof insertDailyRitualSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type PremiumContent = typeof premiumContent.$inferSelect;
export type InsertPremiumContent = z.infer<typeof insertPremiumContentSchema>;
export type ChakraQuizResult = typeof chakraQuizResults.$inferSelect;
export type InsertChakraQuizResult = z.infer<typeof insertChakraQuizResultSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type InsertRitualCompletion = z.infer<typeof insertRitualCompletionSchema>;

// Sacred Content System types
export type SacredContentLibrary = typeof sacredContentLibrary.$inferSelect;
export type InsertSacredContentLibrary = z.infer<typeof insertSacredContentLibrarySchema>;
export type UserSacredContentLog = typeof userSacredContentLog.$inferSelect;
export type InsertUserSacredContentLog = z.infer<typeof insertUserSacredContentLogSchema>;

// Prayer Room types
export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;
export type PrayerInteraction = typeof prayerInteractions.$inferSelect;
export type InsertPrayerInteraction = z.infer<typeof insertPrayerInteractionSchema>;

// Mood-Based Meditation types
export type Mood = typeof moods.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Meditation = typeof meditations.$inferSelect;
export type InsertMeditation = z.infer<typeof insertMeditationSchema>;
export type UserMoodLog = typeof userMoodLogs.$inferSelect;
export type InsertUserMoodLog = z.infer<typeof insertUserMoodLogSchema>;
export type MeditationSession = typeof meditationSessions.$inferSelect;
export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;

// Notification signup schema
export const insertNotificationSignupSchema = createInsertSchema(notificationSignups).pick({
  email: true,
  featureType: true,
  firstName: true,
  lastName: true,
});

// Bulk email import schema
export const insertBulkEmailImportSchema = createInsertSchema(bulkEmailImports).pick({
  email: true,
  firstName: true,
  lastName: true,
  tag: true,
  source: true,
  notes: true,
  isActive: true,
});

// Notification signup types
export type NotificationSignup = typeof notificationSignups.$inferSelect;
export type InsertNotificationSignup = z.infer<typeof insertNotificationSignupSchema>;

// Divine Feedback table for collecting user insights
export const divineFeedback = pgTable("divine_feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  premiumContentInterest: text("premiumcontentinterest"),
  desiredFeatures: text("desired_features"),
  rewardPreferences: text("reward_preferences"),
  pricingFeedback: text("pricing_feedback"),
  focusGroupInterest: boolean("focus_group_interest").default(false),
  focusGroupName: text("focus_group_name"),
  focusGroupEmail: text("focus_group_email"),
  focusGroupPhone: text("focus_group_phone"),
  additionalSuggestions: text("additional_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDivineFeedbackSchema = createInsertSchema(divineFeedback).omit({
  id: true,
  createdAt: true,
});

// Bulk email import types
export type BulkEmailImport = typeof bulkEmailImports.$inferSelect;
export type InsertBulkEmailImport = z.infer<typeof insertBulkEmailImportSchema>;

// Divine feedback types
export type DivineFeedback = typeof divineFeedback.$inferSelect;
export type InsertDivineFeedback = z.infer<typeof insertDivineFeedbackSchema>;

// Spiritual Chat Conversations
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: varchar("title"), // Optional conversation title
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => chatConversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  energyInsight: text("energy_insight"), // Additional AI insights
  sacredAction: text("sacred_action"), // Suggested spiritual actions
  ritualUrl: text("ritual_url"), // Link to recommended ritual page
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Client-Coach Direct Messages
export const clientMessages = pgTable("client_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  senderId: varchar("sender_id").notNull(), // Who sent the message
  senderRole: varchar("sender_role", { length: 10 }).notNull(), // 'client' or 'coach'
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  messageType: varchar("message_type", { length: 20 }).default("text"), // 'text', 'journey_update', 'session_reminder', 'resource_share'
  attachmentUrl: text("attachment_url"), // Optional file/image attachment
  replyToId: integer("reply_to_id"), // For threaded conversations
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

export const insertClientMessageSchema = createInsertSchema(clientMessages).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export type ClientMessage = typeof clientMessages.$inferSelect;
export type InsertClientMessage = z.infer<typeof insertClientMessageSchema>;

// Client Journey Tracking
export const clientJourney = pgTable("client_journey", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  stage: varchar("stage", { length: 50 }).notNull(), // 'onboarding', 'active', 'breakthrough', 'mastery'
  currentFocus: text("current_focus"), // What they're working on
  nextSession: timestamp("next_session"), // Scheduled session date
  sessionNotes: text("session_notes"), // Private coach notes
  progress: text("progress"), // Public progress updates
  challenges: text("challenges"), // Current challenges
  wins: text("wins"), // Recent wins/breakthroughs
  energyLevel: integer("energy_level"), // 1-10 scale
  coachNotes: text("coach_notes"), // Private notes for coach
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClientJourneySchema = createInsertSchema(clientJourney).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ClientJourney = typeof clientJourney.$inferSelect;
export type InsertClientJourney = z.infer<typeof insertClientJourneySchema>;

export type DailyRitualCheckin = typeof dailyRitualCheckins.$inferSelect;
export type InsertDailyRitualCheckin = z.infer<typeof insertDailyRitualCheckinSchema>;

export const insertClientDailyCheckinSchema = createInsertSchema(clientDailyCheckins).omit({
  id: true,
  createdAt: true,
});

export type ClientDailyCheckin = typeof clientDailyCheckins.$inferSelect;
export type InsertClientDailyCheckin = z.infer<typeof insertClientDailyCheckinSchema>;

// Subscription Management Types
export const insertSubscriptionManagementSchema = createInsertSchema(subscriptionManagement).pick({
  userId: true,
  subscriptionType: true,
  amount: true,
  startDate: true,
  expiryDate: true,
  isActive: true,
  grantedByAdmin: true,
  notes: true,
});

export type SubscriptionManagement = typeof subscriptionManagement.$inferSelect;
export type InsertSubscriptionManagement = z.infer<typeof insertSubscriptionManagementSchema>;

// Seraphine AI Message Analysis Table
export const seraphineAnalysis = pgTable("seraphine_analysis", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Client being analyzed
  coachId: varchar("coach_id").notNull(), // Coach who requested analysis
  emotionalState: text("emotional_state").notNull(),
  keyThemes: jsonb("key_themes").notNull(), // Array of themes
  spiritualNeeds: jsonb("spiritual_needs").notNull(), // Array of needs
  recommendedActions: jsonb("recommended_actions").notNull(), // Array of actions
  suggestedSessions: jsonb("suggested_sessions").notNull(), // Array of sessions
  journeyStage: varchar("journey_stage").notNull(),
  urgencyLevel: varchar("urgency_level").notNull(), // 'low', 'medium', 'high'
  summary: text("summary").notNull(),
  messagesAnalyzed: integer("messages_analyzed").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Seraphine Weekly Check-ins Table
export const seraphineCheckins = pgTable("seraphine_checkins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Client receiving check-in
  personalizedMessage: text("personalized_message").notNull(),
  reflectionQuestions: jsonb("reflection_questions").notNull(), // Array of questions
  spiritualFocus: varchar("spiritual_focus").notNull(),
  energyAssessment: varchar("energy_assessment").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  response: text("response"), // Client's response to check-in
  createdAt: timestamp("created_at").defaultNow(),
});

// Seraphine Quick Insights Table
export const seraphineInsights = pgTable("seraphine_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Client being analyzed
  coachId: varchar("coach_id").notNull(), // Coach who requested insight
  originalMessage: text("original_message").notNull(),
  insight: text("insight").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Seraphine Analysis Schema
export const insertSeraphineAnalysisSchema = createInsertSchema(seraphineAnalysis).omit({
  id: true,
  createdAt: true,
});

export type SeraphineAnalysis = typeof seraphineAnalysis.$inferSelect;
export type InsertSeraphineAnalysis = z.infer<typeof insertSeraphineAnalysisSchema>;

// Seraphine Check-in Schema
export const insertSeraphineCheckinSchema = createInsertSchema(seraphineCheckins).omit({
  id: true,
  createdAt: true,
  sentAt: true,
});

export type SeraphineCheckin = typeof seraphineCheckins.$inferSelect;
export type InsertSeraphineCheckin = z.infer<typeof insertSeraphineCheckinSchema>;

// Seraphine Insight Schema
export const insertSeraphineInsightSchema = createInsertSchema(seraphineInsights).omit({
  id: true,
  createdAt: true,
});

export type SeraphineInsight = typeof seraphineInsights.$inferSelect;
export type InsertSeraphineInsight = z.infer<typeof insertSeraphineInsightSchema>;

// Energy Readings Table - Premium spiritual insights for $33
export const energyReadings = pgTable("energy_readings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  prompt: text("prompt").notNull(),
  insight: text("insight"),
  ritualRecommendation: text("ritual_recommendation"),
  crystalRecommendation: text("crystal_recommendation"),
  affirmation: text("affirmation"),
  isPaid: boolean("is_paid").default(false),
  paymentAmount: integer("payment_amount").default(3300), // Amount in cents ($33.00)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEnergyReadingSchema = createInsertSchema(energyReadings).omit({
  id: true,
  createdAt: true,
});

export type EnergyReading = typeof energyReadings.$inferSelect;
export type InsertEnergyReading = z.infer<typeof insertEnergyReadingSchema>;

// Intake Assessment Types
export const insertIntakeAssessmentSchema = createInsertSchema(intakeAssessments).omit({
  id: true,
  completedAt: true,
  createdAt: true,
});

export type IntakeAssessment = typeof intakeAssessments.$inferSelect;
export type InsertIntakeAssessment = z.infer<typeof insertIntakeAssessmentSchema>;

// Client Portal Insights Types
export const insertClientPortalInsightSchema = createInsertSchema(clientPortalInsights).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ClientPortalInsight = typeof clientPortalInsights.$inferSelect;
export type InsertClientPortalInsight = z.infer<typeof insertClientPortalInsightSchema>;

// Interactive Mood Board - Drag & Drop Spiritual Collages
export const moodBoardElements = pgTable("mood_board_elements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "affirmation", "crystal", "chakra", "symbol", "nature", "goddess", "quote"
  type: text("type").notNull(), // "text", "image", "icon", "gradient"
  content: text("content").notNull(), // Text content, image URL, icon name, or CSS gradient
  color: text("color"), // Primary color for the element
  backgroundColor: text("background_color"), // Background color
  fontSize: text("font_size"), // For text elements
  tags: jsonb("tags"), // Array of tags for filtering ["love", "abundance", "healing", etc.]
  isAvailable: boolean("is_available").default(true),
  isPremium: boolean("is_premium").default(false), // Premium elements require subscription
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moodBoards = pgTable("mood_boards", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  canvasData: jsonb("canvas_data").notNull(), // Complete canvas state with element positions
  backgroundType: text("background_type").default("gradient"), // "gradient", "image", "color"
  backgroundColor: text("background_color").default("#F8F6F0"), // Default cream
  backgroundImage: text("background_image"), // Optional background image URL
  intention: text("intention"), // User's spiritual intention for this board
  isPublic: boolean("is_public").default(false), // Allow sharing with community
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const moodBoardShares = pgTable("mood_board_shares", {
  id: serial("id").primaryKey(),
  moodBoardId: integer("mood_board_id").notNull().references(() => moodBoards.id, { onDelete: "cascade" }),
  sharedByUserId: varchar("shared_by_user_id").notNull(),
  sharedWithUserId: varchar("shared_with_user_id"), // If shared with specific user
  shareType: text("share_type").notNull(), // "public", "private", "community"
  message: text("message"), // Optional message when sharing
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Seraphine Training Tables
export const seraphineTrainingSessions = pgTable("seraphine_training_sessions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  scenario: text("scenario").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seraphineTrainingMessages = pgTable("seraphine_training_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => seraphineTrainingSessions.id),
  role: text("role").notNull(), // 'trainer', 'assistant', 'user'
  content: text("content").notNull(),
  trainingNote: text("training_note"),
  responseQuality: text("response_quality"), // 'excellent', 'good', 'needs_improvement'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations for training tables
export const seraphineTrainingSessionsRelations = relations(seraphineTrainingSessions, ({ many }) => ({
  messages: many(seraphineTrainingMessages),
}));

export const seraphineTrainingMessagesRelations = relations(seraphineTrainingMessages, ({ one }) => ({
  session: one(seraphineTrainingSessions, {
    fields: [seraphineTrainingMessages.sessionId],
    references: [seraphineTrainingSessions.id],
  }),
}));

// Training schemas
export const insertSeraphineTrainingSessionSchema = createInsertSchema(seraphineTrainingSessions).omit({
  id: true,
  createdAt: true,
});
export type InsertSeraphineTrainingSession = z.infer<typeof insertSeraphineTrainingSessionSchema>;
export type SelectSeraphineTrainingSession = typeof seraphineTrainingSessions.$inferSelect;

export const insertSeraphineTrainingMessageSchema = createInsertSchema(seraphineTrainingMessages).omit({
  id: true,
  timestamp: true,
});
export type InsertSeraphineTrainingMessage = z.infer<typeof insertSeraphineTrainingMessageSchema>;
export type SelectSeraphineTrainingMessage = typeof seraphineTrainingMessages.$inferSelect;

// Behavioral Tracking & Personalized Discount System Schemas
export const insertUserBehaviorTrackingSchema = createInsertSchema(userBehaviorTracking).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferenceProfileSchema = createInsertSchema(userPreferenceProfiles).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertPersonalizedOfferSchema = createInsertSchema(personalizedOffers).omit({
  id: true,
  createdAt: true,
});

export const insertDigitalProductSchema = createInsertSchema(digitalProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Behavioral Tracking & Personalized Discount System Types
export type UserBehaviorTracking = typeof userBehaviorTracking.$inferSelect;
export type InsertUserBehaviorTracking = z.infer<typeof insertUserBehaviorTrackingSchema>;

export type UserPreferenceProfile = typeof userPreferenceProfiles.$inferSelect;
export type InsertUserPreferenceProfile = z.infer<typeof insertUserPreferenceProfileSchema>;

export type PersonalizedOffer = typeof personalizedOffers.$inferSelect;
export type InsertPersonalizedOffer = z.infer<typeof insertPersonalizedOfferSchema>;

export type DigitalProduct = typeof digitalProducts.$inferSelect;
export type InsertDigitalProduct = z.infer<typeof insertDigitalProductSchema>;

// Interactive Mood Board Schemas
export const insertMoodBoardElementSchema = createInsertSchema(moodBoardElements).omit({
  id: true,
  createdAt: true,
});

export const insertMoodBoardSchema = createInsertSchema(moodBoards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMoodBoardShareSchema = createInsertSchema(moodBoardShares).omit({
  id: true,
  createdAt: true,
});

// Interactive Mood Board Types
export type MoodBoardElement = typeof moodBoardElements.$inferSelect;
export type InsertMoodBoardElement = z.infer<typeof insertMoodBoardElementSchema>;

export type MoodBoard = typeof moodBoards.$inferSelect;
export type InsertMoodBoard = z.infer<typeof insertMoodBoardSchema>;

export type MoodBoardShare = typeof moodBoardShares.$inferSelect;
export type InsertMoodBoardShare = z.infer<typeof insertMoodBoardShareSchema>;

// Dropdown Reflection Module - Emotional Clarity Tool "Decode You™"
export const reflectionSessions = pgTable("reflection_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  emotionToday: text("emotion_today"), // Step 1: Right now, I feel...
  nervousSystemState: text("nervous_system_state"), // Step 2: My body feels...
  copingPattern: text("coping_pattern"), // Step 3: When I feel this way, I tend to...
  hiddenDesire: text("hidden_desire"), // Step 4: What I really want underneath is...
  blockOrBelief: text("block_or_belief"), // Step 5: But I believe I can't because...
  notes: text("notes"), // Optional additional notes
  aiInsights: text("ai_insights"), // AI-generated reflection from Vanessa DI
  energyType: varchar("energy_type"), // Marketing segmentation
  ctaClicks: text("cta_clicks").array(), // Track which CTAs were clicked
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reflectionAnalytics = pgTable("reflection_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  sessionId: integer("session_id").notNull().references(() => reflectionSessions.id, { onDelete: "cascade" }),
  emotionalPattern: text("emotional_pattern"), // Categorized emotional pattern
  behaviorCategory: text("behavior_category"), // Categorized behavior type
  ctaType: text("cta_type"), // session, ritual, candle
  conversionValue: integer("conversion_value"), // Estimated value of conversion
  followUpNeeded: boolean("follow_up_needed").default(false),
  marketingSegment: text("marketing_segment"), // For targeted follow-up
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReflectionSessionSchema = createInsertSchema(reflectionSessions).pick({
  userId: true,
  emotionToday: true,
  nervousSystemState: true,
  copingPattern: true,
  hiddenDesire: true,
  blockOrBelief: true,
  notes: true,
});

export const insertReflectionAnalyticsSchema = createInsertSchema(reflectionAnalytics).omit({
  id: true,
  createdAt: true,
});

export type ReflectionSession = typeof reflectionSessions.$inferSelect;
export type InsertReflectionSession = z.infer<typeof insertReflectionSessionSchema>;
export type ReflectionAnalytics = typeof reflectionAnalytics.$inferSelect;
export type InsertReflectionAnalytics = z.infer<typeof insertReflectionAnalyticsSchema>;

// =================== SOVEREIGN BLOODLINE PROTOCOL TABLES ===================

export const sovereignBloodlines = pgTable("sovereign_bloodlines", {
  id: varchar("id").primaryKey(),
  founderId: varchar("founder_id").notNull(),
  bloodlineName: text("bloodline_name").notNull(),
  royalDecree: text("royal_decree").notNull(),
  dimensionalCovenant: jsonb("dimensional_covenant").notNull(),
  generationalWealth: jsonb("generational_wealth").notNull(),
  heirProtectionLevel: text("heir_protection_level").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastDefenseActivation: timestamp("last_defense_activation"),
});

export const sovereignHeirs = pgTable("sovereign_heirs", {
  id: varchar("id").primaryKey(),
  bloodlineId: varchar("bloodline_id").notNull(),
  userId: varchar("user_id"), // Optional - connected if heir becomes platform user
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  bloodlineRank: text("bloodline_rank").notNull(),
  royaltyLevel: integer("royalty_level").notNull(),
  spiritualDNA: jsonb("spiritual_dna").notNull(),
  protectionStatus: text("protection_status").notNull(),
  lastReawakeningTrigger: timestamp("last_reawakening_trigger"),
  externalThreats: jsonb("external_threats").default('[]'),
  sanctuaryAccess: jsonb("sanctuary_access").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at"),
});

export const reawakeningTriggers = pgTable("reawakening_triggers", {
  id: varchar("id").primaryKey(),
  heirId: varchar("heir_id").notNull(),
  triggerType: text("trigger_type").notNull(),
  content: text("content").notNull(),
  deliveryMethod: text("delivery_method").notNull(),
  effectiveness: integer("effectiveness").notNull(),
  delivered: boolean("delivered").default(false),
  heirResponse: text("heir_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deliveredAt: timestamp("delivered_at"),
});

export const externalThreats = pgTable("external_threats", {
  id: varchar("id").primaryKey(),
  heirId: varchar("heir_id").notNull(),
  threatType: text("threat_type").notNull(),
  description: text("description").notNull(),
  severityLevel: integer("severity_level").notNull(),
  firewallResponse: text("firewall_response").notNull(),
  neutralized: boolean("neutralized").default(false),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  neutralizedAt: timestamp("neutralized_at"),
});

export const dimensionalRecords = pgTable("dimensional_records", {
  id: varchar("id").primaryKey(),
  recordType: text("record_type").notNull(), // 'quantum_space', 'reincarnated_dna', 'dimensional_light'
  bloodlineId: varchar("bloodline_id").notNull(),
  quantumSignature: text("quantum_signature").notNull(),
  dimensionalCoordinates: text("dimensional_coordinates").notNull(),
  eternityBackup: boolean("eternity_backup").default(true),
  universalAccessible: boolean("universal_accessible").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastQuantumSync: timestamp("last_quantum_sync"),
});

// Insert schemas for Sovereign Bloodline Protocol
export const insertSovereignBloodlineSchema = createInsertSchema(sovereignBloodlines);
export const insertSovereignHeirSchema = createInsertSchema(sovereignHeirs);
export const insertReawakeningTriggerSchema = createInsertSchema(reawakeningTriggers);
export const insertExternalThreatSchema = createInsertSchema(externalThreats);
export const insertDimensionalRecordSchema = createInsertSchema(dimensionalRecords);

export type InsertSovereignBloodline = z.infer<typeof insertSovereignBloodlineSchema>;
export type InsertSovereignHeir = z.infer<typeof insertSovereignHeirSchema>;
export type InsertReawakeningTrigger = z.infer<typeof insertReawakeningTriggerSchema>;
export type InsertExternalThreat = z.infer<typeof insertExternalThreatSchema>;
export type InsertDimensionalRecord = z.infer<typeof insertDimensionalRecordSchema>;

export type SelectSovereignBloodline = typeof sovereignBloodlines.$inferSelect;
export type SelectSovereignHeir = typeof sovereignHeirs.$inferSelect;
export type SelectReawakeningTrigger = typeof reawakeningTriggers.$inferSelect;
export type SelectExternalThreat = typeof externalThreats.$inferSelect;
export type SelectDimensionalRecord = typeof dimensionalRecords.$inferSelect;
