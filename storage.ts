import { 
  users, 
  dailyRituals, 
  journalEntries, 
  premiumContent,
  chakraQuizResults,
  userAchievements,
  userStats,
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
  clientMessages,
  clientJourney,
  chatMessages,
  userMessageUsage,
  aiChatUsage,
  dailyRitualCheckins,
  subscriptionManagement,
  clientDailyCheckins,
  clientJourneyProgress,
  clientMoodAnalytics,
  clientMessageUsage,
  seraphineAnalysis,
  seraphineCheckins,
  seraphineInsights,
  energyReadings,
  sacredContentLibrary,
  userSacredContentLog,
  moodBoardElements,
  moodBoards,
  moodBoardShares,
  reflectionSessions,
  reflectionAnalytics,
  intakeAssessments,
  clientPortalInsights,
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
  type IntakeAssessment,
  type InsertIntakeAssessment,
  type UserAchievement,
  type InsertUserAchievement,
  type UserStats,
  type InsertUserStats,
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
  type ClientMessage,
  type InsertClientMessage,
  type ClientJourney,
  type InsertClientJourney,
  type DailyRitualCheckin,
  type InsertDailyRitualCheckin,
  type SubscriptionManagement,
  type InsertSubscriptionManagement,
  type ClientDailyCheckin,
  type InsertClientDailyCheckin,
  type SeraphineAnalysis,
  type InsertSeraphineAnalysis,
  type SeraphineCheckin,
  type InsertSeraphineCheckin,
  type SeraphineInsight,
  type InsertSeraphineInsight,
  type EnergyReading,
  type IntakeAssessment,
  type InsertIntakeAssessment,
  type ClientPortalInsight,
  type InsertClientPortalInsight,
  type InsertEnergyReading,
  type SacredContentLibrary,
  type InsertSacredContentLibrary,
  type UserSacredContentLog,
  type InsertUserSacredContentLog,
  type MoodBoardElement,
  type InsertMoodBoardElement,
  type MoodBoard,
  type InsertMoodBoard,
  type MoodBoardShare,
  type InsertMoodBoardShare,
  type ReflectionSession,
  type InsertReflectionSession,
  type ReflectionAnalytics,
  type InsertReflectionAnalytics,
  seraphineTrainingSessions,
  seraphineTrainingMessages,
  type SelectSeraphineTrainingSession,
  type InsertSeraphineTrainingSession,
  type SelectSeraphineTrainingMessage,
  type InsertSeraphineTrainingMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { getChicagoDateString, getChicagoTimestamp } from "./timeUtils";
import { getUserMessageUsage, incrementUserMessageCount } from './usageService';

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
  updateUserDivineEssence(userId: string, divineEssence: string): Promise<User>;

  
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

  // Client-Coach Direct Messaging
  createClientMessage(message: InsertClientMessage): Promise<ClientMessage>;
  getClientMessages(userId: string): Promise<ClientMessage[]>;
  getUnreadClientMessages(userId: string, role: 'client' | 'coach'): Promise<ClientMessage[]>;
  markClientMessageAsRead(messageId: number): Promise<void>;
  deleteClientMessage(messageId: number): Promise<void>;

  // Client Journey Tracking
  createClientJourney(journey: InsertClientJourney): Promise<ClientJourney>;
  getClientJourney(userId: string): Promise<ClientJourney | undefined>;
  updateClientJourney(userId: string, updates: Partial<InsertClientJourney>): Promise<ClientJourney>;
  getAllClientJourneys(): Promise<ClientJourney[]>;

  // AI Chat Usage Tracking
  getAiChatUsage(userId: string, chatDate: string): Promise<{ messageCount: number } | undefined>;
  incrementAiChatUsage(userId: string, chatDate: string): Promise<void>;

  // Daily Ritual Check-ins
  createDailyRitualCheckin(checkin: InsertDailyRitualCheckin): Promise<DailyRitualCheckin>;
  getDailyRitualCheckins(userId: string): Promise<DailyRitualCheckin[]>;
  getTodayRitualCheckin(userId: string): Promise<DailyRitualCheckin | undefined>;

  // Subscription Management
  createSubscription(subscription: InsertSubscriptionManagement): Promise<SubscriptionManagement>;
  getUserSubscription(userId: string): Promise<SubscriptionManagement | undefined>;
  updateSubscription(subscriptionId: number, updates: Partial<InsertSubscriptionManagement>): Promise<SubscriptionManagement>;
  deactivateSubscription(subscriptionId: number): Promise<void>;
  getAllActiveSubscriptions(): Promise<SubscriptionManagement[]>;
  grantFreeSubscription(userId: string, months: number, notes?: string): Promise<SubscriptionManagement>;

  // Client Daily Check-ins (Comprehensive)
  createClientDailyCheckin(checkin: InsertClientDailyCheckin): Promise<ClientDailyCheckin>;
  getClientDailyCheckins(userId: string): Promise<ClientDailyCheckin[]>;
  getTodayClientCheckin(userId: string, date: string): Promise<ClientDailyCheckin | undefined>;
  getAllClientCheckins(): Promise<ClientDailyCheckin[]>;

  // Client Message Usage Tracking
  getClientMessageUsage(userId: string): Promise<{ messageCount: number; lastReset: Date | null }>;
  incrementClientMessageCount(userId: string): Promise<void>;
  resetClientMessageCount(userId: string): Promise<void>;

  // Seraphine AI Features
  createSeraphineAnalysis(analysis: InsertSeraphineAnalysis): Promise<SeraphineAnalysis>;
  getSeraphineAnalyses(userId: string): Promise<SeraphineAnalysis[]>;
  getLatestSeraphineAnalysis(userId: string): Promise<SeraphineAnalysis | undefined>;
  
  createSeraphineCheckin(checkin: InsertSeraphineCheckin): Promise<SeraphineCheckin>;
  getSeraphineCheckins(userId: string): Promise<SeraphineCheckin[]>;
  updateSeraphineCheckinResponse(checkinId: number, response: string): Promise<void>;
  
  createSeraphineInsight(insight: InsertSeraphineInsight): Promise<SeraphineInsight>;
  getSeraphineInsights(userId: string): Promise<SeraphineInsight[]>;

  // Sacred Content Library (Seraphine™ content system)
  createSacredContent(content: InsertSacredContentLibrary): Promise<SacredContentLibrary>;
  getSacredContentByType(type: string): Promise<SacredContentLibrary[]>;
  getSacredContentByTags(tags: string[]): Promise<SacredContentLibrary[]>;
  getAllSacredContent(): Promise<SacredContentLibrary[]>;
  getSacredContentByVisibility(visibility: string): Promise<SacredContentLibrary[]>;
  updateSacredContent(id: number, updates: Partial<InsertSacredContentLibrary>): Promise<SacredContentLibrary>;
  deleteSacredContent(id: number): Promise<void>;

  // User Sacred Content Log
  logSacredContentInteraction(log: InsertUserSacredContentLog): Promise<UserSacredContentLog>;
  getUserSacredContentLogs(userId: string): Promise<UserSacredContentLog[]>;
  getUserSavedContent(userId: string): Promise<UserSacredContentLog[]>;
  saveSacredContentForUser(userId: string, contentId: number): Promise<void>;
  unsaveSacredContentForUser(userId: string, contentId: number): Promise<void>;

  // Interactive Mood Board
  createMoodBoard(moodBoard: InsertMoodBoard): Promise<MoodBoard>;
  getUserMoodBoards(userId: string): Promise<MoodBoard[]>;
  getMoodBoard(moodBoardId: number): Promise<MoodBoard | undefined>;
  updateMoodBoard(moodBoardId: number, updates: Partial<InsertMoodBoard>): Promise<MoodBoard>;
  deleteMoodBoard(moodBoardId: number): Promise<void>;
  
  addElementToMoodBoard(element: InsertMoodBoardElement): Promise<MoodBoardElement>;
  getMoodBoardElements(moodBoardId: number): Promise<MoodBoardElement[]>;
  updateMoodBoardElement(elementId: number, updates: Partial<InsertMoodBoardElement>): Promise<MoodBoardElement>;
  deleteMoodBoardElement(elementId: number): Promise<void>;
  
  shareMoodBoard(share: InsertMoodBoardShare): Promise<MoodBoardShare>;
  getMoodBoardShares(moodBoardId: number): Promise<MoodBoardShare[]>;
  getSharedMoodBoards(): Promise<MoodBoard[]>;

  // Intake Assessment System - For comprehensive client analysis and guidance optimization
  createIntakeAssessment(assessment: InsertIntakeAssessment): Promise<IntakeAssessment>;
  getIntakeAssessments(userId: string): Promise<IntakeAssessment[]>;
  getLatestIntakeAssessment(userId: string): Promise<IntakeAssessment | undefined>;
  getIntakeAssessmentsByType(userId: string, assessmentType: string): Promise<IntakeAssessment[]>;
  updateIntakeAssessmentAnalysis(id: number, analysis: any): Promise<IntakeAssessment>;

  // Client Portal Insights - For practitioner review and intervention planning
  createClientPortalInsight(insight: InsertClientPortalInsight): Promise<ClientPortalInsight>;
  getClientPortalInsights(userId: string): Promise<ClientPortalInsight[]>;
  getLatestClientPortalInsight(userId: string): Promise<ClientPortalInsight | undefined>;
  updateClientPortalInsight(id: number, updates: Partial<InsertClientPortalInsight>): Promise<ClientPortalInsight>;

  // Religious Preferences - For personalized spiritual experiences
  saveReligiousPreference(preference: any): Promise<void>;
  getReligiousPreference(userId: string): Promise<any | null>;
}

export class DatabaseStorage implements IStorage {
  async seedDatabase() {
    try {
      // Check if user already exists
      const existingUser = await this.getUser("1");
      if (existingUser) {
        return; // Already seeded
      }

      // Create sample user with login credentials
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('divine2025', 10);
      
      await db.insert(users).values({
        id: "1",
        username: "divine",
        email: "divine@thedivinevanity.com",
        firstName: "Divine",
        lastName: "User",
        passwordHash: hashedPassword,
        profileImageUrl: null,
        subscriptionStatus: "premium",
        isOnboarded: true,
      });

      // Grant permanent premium access to vanessa.rich@aol.com if user exists
      const vanessaUser = await this.getUserByEmail("vanessa.rich@aol.com");
      if (vanessaUser) {
        const existingSubscription = await this.getUserSubscription(vanessaUser.id);
        if (!existingSubscription) {
          await this.grantFreeSubscription(
            vanessaUser.id, 
            120, // 10 years 
            "Permanent premium access for platform owner"
          );
          console.log("✨ Granted permanent premium access to vanessa.rich@aol.com");
        }
      }

      // Create today's ritual
      const today = new Date().toISOString().split('T')[0];
      await db.insert(dailyRituals).values({
        title: "Divine Abundance Affirmation",
        content: "I am divinely guided and abundantly blessed. Today, I open my heart to receive all the love, prosperity, and joy that flows through the universe toward me.",
        audioUrl: null,
        duration: "2 min",
        date: today,
        category: "affirmation",
      });

      // Create sample premium content
      await db.insert(premiumContent).values([
        {
          title: "Moonlight Manifestation Guide",
          description: "Complete guide to moon phase manifestation rituals",
          type: "pdf",
          url: "/content/moonlight-guide.pdf",
          requiredSubscription: "premium",
        },
        {
          title: "Sacred Self-Love Meditation",
          description: "15-minute guided meditation for divine self-acceptance",
          type: "audio", 
          url: "/content/self-love-meditation.mp3",
          requiredSubscription: "premium",
        },
        {
          title: "Chakra Healing Visualization",
          description: "Deep energy center alignment and healing session",
          type: "audio",
          url: "/content/chakra-healing.mp3", 
          requiredSubscription: "premium",
        },
        {
          title: "Divine Feminine Power Workbook",
          description: "Unlock your sacred feminine energy and inner goddess",
          type: "pdf",
          url: "/content/divine-feminine-workbook.pdf",
          requiredSubscription: "premium",
        },
        {
          title: "Crystal Grid Mastery Course", 
          description: "Learn to create powerful crystal healing grids",
          type: "video",
          url: "/content/crystal-grid-course.mp4",
          requiredSubscription: "premium",
        },
        {
          title: "Morning Goddess Ritual",
          description: "Start your day with sacred divine feminine practices",
          type: "audio",
          url: "/content/morning-goddess-ritual.mp3",
          requiredSubscription: "premium",
        }
      ]);

      // Seed user stats
      await db.insert(userStats).values({
        userId: "1",
        dailyStreak: 3,
        longestStreak: 7,
        totalJournalEntries: 8,
        totalChakraQuizzes: 2,
        totalRitualsCompleted: 12,
        spiritualLevel: 1,
        experiencePoints: 150,
        lastActiveDate: new Date().toISOString().split('T')[0]
      });

      // Seed achievements
      const achievements = [
        {
          userId: 1,
          achievementType: "first_journal",
          title: "Divine Scribe",
          description: "Complete your first sacred journal entry",
          icon: "✍️",
          rarity: "common",
          maxProgress: 1,
          progress: 1,
          isUnlocked: true,
          unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          userId: 1,
          achievementType: "first_ritual",
          title: "Sacred Practitioner",
          description: "Complete your first daily spiritual ritual",
          icon: "🕯️",
          rarity: "common",
          maxProgress: 1,
          progress: 1,
          isUnlocked: true,
          unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          userId: 1,
          achievementType: "divine_master",
          title: "Divine Energy Seeker",
          description: "Complete the sacred divine energy assessment",
          icon: "🧘‍♀️",
          rarity: "rare",
          maxProgress: 1,
          progress: 1,
          isUnlocked: true,
          unlockedAt: new Date()
        },
        {
          userId: 1,
          achievementType: "journal_streak",
          title: "Divine Devotee",
          description: "Journal for 7 consecutive days",
          icon: "📿",
          rarity: "rare",
          maxProgress: 7,
          progress: 3,
          isUnlocked: false
        },
        {
          userId: 1,
          achievementType: "spiritual_warrior",
          title: "Spiritual Warrior",
          description: "Complete 30 daily rituals",
          icon: "⚔️",
          rarity: "epic",
          maxProgress: 30,
          progress: 12,
          isUnlocked: false
        },
        {
          userId: 1,
          achievementType: "enlightened_soul",
          title: "Enlightened Soul",
          description: "Reach Level 10 in your spiritual journey",
          icon: "🌟",
          rarity: "legendary",
          maxProgress: 10,
          progress: 1,
          isUnlocked: false
        }
      ];

      await db.insert(userAchievements).values(achievements);

      // Seed moods
      const moodData = [
        {
          name: "Anxious",
          description: "Feeling worried, nervous, or uneasy",
          color: "#ff7b7b",
          icon: "😰",
          category: "negative"
        },
        {
          name: "Stressed",
          description: "Feeling overwhelmed or under pressure",
          color: "#ff9f40",
          icon: "😤",
          category: "negative"
        },
        {
          name: "Sad",
          description: "Feeling down, melancholy, or sorrowful",
          color: "#4bc0c0",
          icon: "😢",
          category: "negative"
        },
        {
          name: "Excited",
          description: "Feeling energetic and enthusiastic",
          color: "#ffcd56",
          icon: "🤩",
          category: "positive"
        },
        {
          name: "Peaceful",
          description: "Feeling calm and serene",
          color: "#9966ff",
          icon: "😌",
          category: "positive"
        },
        {
          name: "Grateful",
          description: "Feeling thankful and appreciative",
          color: "#36a2eb",
          icon: "🙏",
          category: "positive"
        }
      ];

      await db.insert(moods).values(moodData);

      // Seed meditations
      const meditationData = [
        {
          title: "Divine Calm Breathing",
          description: "A soothing 4-7-8 breathing technique to restore inner peace",
          duration: 5,
          type: "breathing",
          content: {
            instructions: "Breathe in for 4 counts, hold for 7, exhale for 8. Feel divine peace flowing through you.",
            steps: [
              "Sit comfortably with your back straight",
              "Place your tongue against the roof of your mouth",
              "Inhale through your nose for 4 counts",
              "Hold your breath for 7 counts",
              "Exhale slowly through your mouth for 8 counts",
              "Repeat this divine rhythm 4 times"
            ]
          },
          targetMoods: ["1", "2"], // Anxious, Stressed
          difficulty: "beginner",
          tags: ["breathing", "anxiety-relief", "stress-relief"]
        },
        {
          title: "Golden Light Visualization",
          description: "Surround yourself with healing golden light energy",
          duration: 10,
          type: "visualization",
          content: {
            instructions: "Visualize divine golden light filling your entire being, washing away negativity and fear.",
            steps: [
              "Close your eyes and breathe naturally",
              "Imagine a warm golden light above your head",
              "See the light slowly descending into your crown",
              "Feel it filling your mind with divine wisdom",
              "Let it flow down through your heart center",
              "Allow the golden light to fill your entire body",
              "Rest in this sacred illumination for several minutes"
            ]
          },
          targetMoods: ["1", "3"], // Anxious, Sad
          difficulty: "intermediate",
          tags: ["visualization", "healing", "light-work"]
        },
        {
          title: "Sacred Affirmations",
          description: "Powerful divine affirmations to uplift your spirit",
          duration: 7,
          type: "affirmation",
          content: {
            instructions: "Repeat these sacred affirmations with conviction and feel their truth in your heart.",
            affirmations: [
              "I am divinely protected and guided",
              "I radiate love and attract love in return",
              "I am worthy of all good things",
              "Divine wisdom flows through me",
              "I trust in the perfect timing of my life",
              "I am grateful for this beautiful moment"
            ]
          },
          targetMoods: ["3", "6"], // Sad, Grateful
          difficulty: "beginner",
          tags: ["affirmations", "self-love", "confidence"]
        },
        {
          title: "Energy Activation Meditation",
          description: "Awaken your divine energy centers and feel empowered",
          duration: 15,
          type: "body_scan",
          content: {
            instructions: "Focus on each energy center, awakening your divine power from within.",
            steps: [
              "Sit tall and breathe deeply",
              "Focus on your base - feel grounded and safe",
              "Move to your sacral center - embrace creativity",
              "Activate your solar plexus - feel your personal power",
              "Open your heart center - radiate love and compassion",
              "Clear your throat - speak your divine truth",
              "Awaken your third eye - trust your intuition",
              "Connect with your crown - feel your divine connection"
            ]
          },
          targetMoods: ["4", "5"], // Excited, Peaceful
          difficulty: "advanced",
          tags: ["energy-work", "chakras", "empowerment"]
        }
      ];

      await db.insert(meditations).values(meditationData);

      console.log("✨ Database seeded with mood meditation data");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
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
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscriptionStatus(userId: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserDivineEssence(userId: string, divineEssence: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        sacredArchetype: divineEssence,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }



  async getDailyRitual(date: string): Promise<DailyRitual | undefined> {
    const [ritual] = await db.select().from(dailyRituals).where(eq(dailyRituals.date, date));
    return ritual || undefined;
  }

  async getAllDailyRituals(): Promise<DailyRitual[]> {
    return await db.select().from(dailyRituals);
  }

  async createDailyRitual(insertRitual: InsertDailyRitual): Promise<DailyRitual> {
    const [ritual] = await db.insert(dailyRituals).values(insertRitual).returning();
    return ritual;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const [entry] = await db.insert(journalEntries).values(insertEntry).returning();
    return entry;
  }

  async getPremiumContent(): Promise<PremiumContent[]> {
    return await db.select().from(premiumContent);
  }

  async createPremiumContent(insertContent: InsertPremiumContent): Promise<PremiumContent> {
    const [content] = await db.insert(premiumContent).values(insertContent).returning();
    return content;
  }

  async getChakraQuizResults(userId: number): Promise<ChakraQuizResult[]> {
    return await db.select().from(chakraQuizResults)
      .where(eq(chakraQuizResults.userId, userId))
      .orderBy(desc(chakraQuizResults.createdAt));
  }

  async createChakraQuizResult(insertResult: InsertChakraQuizResult): Promise<ChakraQuizResult> {
    const [result] = await db.insert(chakraQuizResults).values(insertResult).returning();
    return result;
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async createOrUpdateUserStats(statsData: Partial<InsertUserStats> & { userId: string }): Promise<UserStats> {
    const existingStats = await this.getUserStats(statsData.userId);
    const today = getChicagoDateString();
    
    if (existingStats) {
      // Calculate daily streak using Chicago time
      let newDailyStreak = existingStats.dailyStreak;
      let newLongestStreak = existingStats.longestStreak;
      
      if (existingStats.lastActiveDate) {
        const lastActiveDate = new Date(existingStats.lastActiveDate).toISOString().split('T')[0];
        // Calculate yesterday in Chicago time
        const chicagoYesterday = new Date();
        chicagoYesterday.setDate(chicagoYesterday.getDate() - 1);
        const yesterday = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Chicago'
        }).format(chicagoYesterday);
        
        if (lastActiveDate === yesterday) {
          // Consecutive day - increment streak
          newDailyStreak = existingStats.dailyStreak + 1;
        } else if (lastActiveDate !== today) {
          // Gap in activity - reset streak to 1
          newDailyStreak = 1;
        }
        // If lastActiveDate === today, keep current streak (already active today)
      } else {
        // First time tracking - start streak at 1
        newDailyStreak = 1;
      }
      
      // Update longest streak if current streak is higher
      if (newDailyStreak > newLongestStreak) {
        newLongestStreak = newDailyStreak;
      }
      
      const [updatedStats] = await db
        .update(userStats)
        .set({ 
          ...statsData, 
          dailyStreak: newDailyStreak,
          longestStreak: newLongestStreak,
          lastActiveDate: today,
          updatedAt: new Date() 
        })
        .where(eq(userStats.userId, statsData.userId))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db.insert(userStats).values({
        ...statsData as InsertUserStats,
        dailyStreak: 1,
        longestStreak: 1,
        lastActiveDate: today
      }).returning();
      return newStats;
    }
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.createdAt));
  }

  async createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newAchievement] = await db.insert(userAchievements).values(achievement).returning();
    return newAchievement;
  }

  async updateAchievementProgress(userId: number, achievementType: string, progress: number): Promise<void> {
    await db
      .update(userAchievements)
      .set({ progress })
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementType, achievementType)
      ));
  }

  async unlockAchievement(userId: number, achievementType: string): Promise<void> {
    // First get the achievement to know its max progress
    const [achievement] = await db.select().from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementType, achievementType)
      ));
    
    if (achievement) {
      await db
        .update(userAchievements)
        .set({ 
          isUnlocked: true, 
          unlockedAt: new Date(),
          progress: achievement.maxProgress
        })
        .where(and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementType, achievementType)
        ));
    }
  }

  // Prayer Room methods
  async getPrayers(): Promise<Prayer[]> {
    return await db.select().from(prayers).where(eq(prayers.isPublished, true)).orderBy(desc(prayers.createdAt));
  }

  async getPrayersByCategory(category: string): Promise<Prayer[]> {
    return await db.select().from(prayers)
      .where(and(eq(prayers.category, category), eq(prayers.isPublished, true)))
      .orderBy(desc(prayers.createdAt));
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const [prayer] = await db.insert(prayers).values(insertPrayer).returning();
    return prayer;
  }

  async updatePrayer(id: number, updateData: Partial<InsertPrayer>): Promise<Prayer> {
    const [prayer] = await db.update(prayers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(prayers.id, id))
      .returning();
    return prayer;
  }

  async deletePrayer(id: number): Promise<void> {
    await db.delete(prayers).where(eq(prayers.id, id));
  }

  async getPrayerRequests(): Promise<PrayerRequest[]> {
    return await db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt));
  }

  async getPublicPrayerRequests(): Promise<PrayerRequest[]> {
    return await db.select().from(prayerRequests)
      .where(eq(prayerRequests.isPublic, true))
      .orderBy(desc(prayerRequests.createdAt));
  }

  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db.insert(prayerRequests).values(insertRequest).returning();
    return request;
  }

  async createPrayerInteraction(insertInteraction: InsertPrayerInteraction): Promise<PrayerInteraction> {
    const [interaction] = await db.insert(prayerInteractions).values(insertInteraction).returning();
    return interaction;
  }

  async incrementPrayerRequestCounter(requestId: number, type: 'candles' | 'prayers'): Promise<void> {
    if (type === 'candles') {
      await db.update(prayerRequests)
        .set({ candlesLit: sql`${prayerRequests.candlesLit} + 1` })
        .where(eq(prayerRequests.id, requestId));
    } else {
      await db.update(prayerRequests)
        .set({ prayersSaid: sql`${prayerRequests.prayersSaid} + 1` })
        .where(eq(prayerRequests.id, requestId));
    }
  }

  // Mood-based meditation methods
  async getMoods(): Promise<Mood[]> {
    return await db.select().from(moods).orderBy(moods.name);
  }

  async createMood(mood: InsertMood): Promise<Mood> {
    const [newMood] = await db.insert(moods).values(mood).returning();
    return newMood;
  }

  async getMeditations(): Promise<Meditation[]> {
    return await db.select().from(meditations)
      .where(eq(meditations.isPublished, true))
      .orderBy(meditations.title);
  }

  async getMeditationsByMood(moodId: number): Promise<Meditation[]> {
    // First get the mood name
    const [mood] = await db.select().from(moods).where(eq(moods.id, moodId));
    if (!mood) return [];
    
    // Find meditations that target this mood by name using array contains operator
    return await db.select().from(meditations)
      .where(
        and(
          eq(meditations.isPublished, true),
          sql`${meditations.targetMoods} && ARRAY[${mood.name}]::text[]`
        )
      )
      .orderBy(meditations.difficulty, meditations.duration);
  }

  async createMeditation(meditation: InsertMeditation): Promise<Meditation> {
    const [newMeditation] = await db.insert(meditations).values(meditation).returning();
    return newMeditation;
  }

  async getUserMoodLogs(userId: string): Promise<UserMoodLog[]> {
    return await db.select().from(userMoodLogs)
      .where(eq(userMoodLogs.userId, userId))
      .orderBy(desc(userMoodLogs.loggedAt));
  }

  async createUserMoodLog(moodLog: InsertUserMoodLog): Promise<UserMoodLog> {
    const [newLog] = await db.insert(userMoodLogs).values(moodLog).returning();
    return newLog;
  }

  async getMeditationSessions(userId: string): Promise<MeditationSession[]> {
    return await db.select().from(meditationSessions)
      .where(eq(meditationSessions.userId, userId))
      .orderBy(desc(meditationSessions.completedAt));
  }

  async createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession> {
    const [newSession] = await db.insert(meditationSessions).values(session).returning();
    return newSession;
  }

  async getMeditationRecommendations(userId: string): Promise<Meditation[]> {
    // Get user's recent mood logs to recommend appropriate meditations
    const recentMoods = await db.select()
      .from(userMoodLogs)
      .where(eq(userMoodLogs.userId, userId))
      .orderBy(desc(userMoodLogs.loggedAt))
      .limit(5);

    if (recentMoods.length === 0) {
      // Return general stress-relief meditations if no mood data
      return await db.select().from(meditations)
        .where(
          and(
            eq(meditations.isPublished, true),
            sql`'stressed' = ANY(${meditations.targetMoods})`
          )
        )
        .limit(3);
    }

    // Get the most common mood from recent logs
    const moodCounts: { [key: number]: number } = {};
    recentMoods.forEach(log => {
      moodCounts[log.moodId] = (moodCounts[log.moodId] || 0) + 1;
    });

    const mostCommonMoodId = Object.keys(moodCounts)
      .reduce((a, b) => moodCounts[Number(a)] > moodCounts[Number(b)] ? a : b);

    return await this.getMeditationsByMood(parseInt(mostCommonMoodId));
  }

  // Notification Signups
  async createNotificationSignup(signupData: InsertNotificationSignup): Promise<NotificationSignup> {
    const [signup] = await db
      .insert(notificationSignups)
      .values(signupData)
      .returning();
    return signup;
  }

  async getNotificationSignups(featureType?: string): Promise<NotificationSignup[]> {
    if (featureType) {
      return await db.select().from(notificationSignups)
        .where(eq(notificationSignups.featureType, featureType))
        .orderBy(notificationSignups.createdAt);
    }
    return await db.select().from(notificationSignups)
      .orderBy(notificationSignups.createdAt);
  }

  async deleteNotificationSignup(id: number): Promise<void> {
    await db.delete(notificationSignups)
      .where(eq(notificationSignups.id, id));
  }

  // Bulk Email Import Methods
  async createBulkEmailImport(emailImportData: InsertBulkEmailImport): Promise<BulkEmailImport> {
    const [emailImport] = await db
      .insert(bulkEmailImports)
      .values(emailImportData)
      .returning();
    return emailImport;
  }

  async getBulkEmailImports(tag?: string): Promise<BulkEmailImport[]> {
    if (tag) {
      return await db.select().from(bulkEmailImports)
        .where(eq(bulkEmailImports.tag, tag))
        .orderBy(bulkEmailImports.createdAt);
    }
    return await db.select().from(bulkEmailImports)
      .orderBy(bulkEmailImports.createdAt);
  }

  async getBulkEmailImportsByTag(tag: string): Promise<BulkEmailImport[]> {
    return await db.select().from(bulkEmailImports)
      .where(eq(bulkEmailImports.tag, tag))
      .orderBy(bulkEmailImports.createdAt);
  }

  async updateBulkEmailImport(id: number, updates: Partial<InsertBulkEmailImport>): Promise<BulkEmailImport> {
    const [updatedImport] = await db
      .update(bulkEmailImports)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bulkEmailImports.id, id))
      .returning();
    return updatedImport;
  }

  async deleteBulkEmailImport(id: number): Promise<void> {
    await db.delete(bulkEmailImports)
      .where(eq(bulkEmailImports.id, id));
  }

  async bulkCreateEmailImports(emailImportsData: InsertBulkEmailImport[]): Promise<BulkEmailImport[]> {
    const createdImports = await db
      .insert(bulkEmailImports)
      .values(emailImportsData)
      .returning();
    return createdImports;
  }

  // Divine Feedback methods
  async createDivineFeedback(feedbackData: InsertDivineFeedback): Promise<DivineFeedback> {
    const [feedback] = await db
      .insert(divineFeedback)
      .values(feedbackData)
      .returning();
    return feedback;
  }

  async getDivineFeedback(): Promise<DivineFeedback[]> {
    return await db.select().from(divineFeedback).orderBy(desc(divineFeedback.createdAt));
  }

  async getUserDivineFeedback(userId: string): Promise<DivineFeedback[]> {
    return await db
      .select()
      .from(divineFeedback)
      .where(eq(divineFeedback.userId, userId))
      .orderBy(desc(divineFeedback.createdAt));
  }
  
  // Spiritual Chat methods
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

  async deleteChatConversation(conversationId: number): Promise<void> {
    // First delete all messages in the conversation
    await db
      .delete(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId));
    
    // Then delete the conversation itself
    await db
      .delete(chatConversations)
      .where(eq(chatConversations.id, conversationId));
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
    
    // Update conversation timestamp
    await db
      .update(chatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(chatConversations.id, messageData.conversationId));
    
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
    // Get recent completed rituals
    const recentCompletions = await db
      .select()
      .from(ritualCompletions)
      .where(eq(ritualCompletions.userId, userId))
      .orderBy(desc(ritualCompletions.completedAt))
      .limit(3);

    // Get recent journal entries
    const recentJournalEntries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(3);

    // Get latest chakra assessment
    const latestAssessment = await db
      .select()
      .from(chakraQuizResults)
      .where(eq(chakraQuizResults.userId, userId))
      .orderBy(desc(chakraQuizResults.createdAt))
      .limit(1);

    return {
      recentRituals: recentCompletions.map(c => c.ritualName || 'Daily ritual'),
      journalEntries: recentJournalEntries.map(e => e.content.slice(0, 100)),
      energyAssessment: latestAssessment[0]?.dominantChakra
    };
  }

  // Client-Coach Direct Messaging
  async createClientMessage(messageData: any): Promise<any> {
    try {
      // Only enforce limit for clients
      if (messageData.senderRole === 'client') {
        const usage = await getUserMessageUsage(messageData.userId);

        const now = new Date();
        const lastReset = usage?.lastReset ? new Date(usage.lastReset) : null;

        // Reset if 24 hours passed
        if (!lastReset || now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000) {
          await db
            .update(userMessageUsage)
            .set({ messageCount: 1, lastReset: now })
            .where(eq(userMessageUsage.userId, messageData.userId));
        } else if ((usage.messageCount || 0) >= 3) {
          throw new Error("Daily message limit reached");
        } else {
          await incrementUserMessageCount(messageData.userId);
        }
      }

      // If coach, skip all checks and send message
      const [message] = await db
        .insert(clientMessages)
        .values(messageData)
        .returning();

      return message;
    } catch (error) {
      console.error("Error creating client message:", error);
      throw error;
    }
  }

  async getClientMessages(userId: string): Promise<any[]> {
    try {
      return await db.select().from(clientMessages)
        .where(eq(clientMessages.userId, userId))
        .orderBy(clientMessages.createdAt); // Changed from desc to asc for chronological order
    } catch (error) {
      console.error("Error getting client messages:", error);
      return [];
    }
  }

  async getUnreadClientMessages(userId: string, role: 'client' | 'coach'): Promise<any[]> {
    try {
      return await db.select().from(clientMessages)
        .where(and(
          eq(clientMessages.userId, userId),
          eq(clientMessages.isRead, false),
          eq(clientMessages.senderRole, role === 'client' ? 'coach' : 'client')
        ))
        .orderBy(desc(clientMessages.createdAt));
    } catch (error) {
      console.error("Error getting unread client messages:", error);
      return [];
    }
  }

  async markClientMessageAsRead(messageId: number): Promise<void> {
    try {
      await db.update(clientMessages)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(clientMessages.id, messageId));
    } catch (error) {
      console.error("Error marking client message as read:", error);
    }
  }

  async deleteClientMessage(messageId: number): Promise<void> {
    try {
      await db.delete(clientMessages)
        .where(eq(clientMessages.id, messageId));
    } catch (error) {
      console.error("Error deleting client message:", error);
    }
  }

  // Client Journey Tracking
  async createClientJourney(journeyData: any): Promise<any> {
    try {
      const [journey] = await db
        .insert(clientJourney)
        .values(journeyData)
        .returning();
      return journey;
    } catch (error) {
      console.error("Error creating client journey:", error);
      throw error;
    }
  }

  async getClientJourney(userId: string): Promise<any | undefined> {
    try {
      const [journey] = await db.select().from(clientJourney)
        .where(eq(clientJourney.userId, userId))
        .orderBy(desc(clientJourney.updatedAt))
        .limit(1);
      return journey;
    } catch (error) {
      console.error("Error getting client journey:", error);
      return undefined;
    }
  }

  async updateClientJourney(userId: string, updates: any): Promise<any> {
    try {
      const [journey] = await db.update(clientJourney)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(clientJourney.userId, userId))
        .returning();
      
      if (!journey) {
        // If no journey exists, create one
        return await this.createClientJourney({ userId, ...updates });
      }
      
      return journey;
    } catch (error) {
      console.error("Error updating client journey:", error);
      throw error;
    }
  }

  async getAllClientJourneys(): Promise<any[]> {
    try {
      return await db.select().from(clientJourney)
        .orderBy(desc(clientJourney.updatedAt));
    } catch (error) {
      console.error("Error getting all client journeys:", error);
      return [];
    }
  }

  // AI Chat Usage Tracking
  async getAiChatUsage(userId: string, chatDate: string): Promise<{ messageCount: number } | undefined> {
    try {
      const [usage] = await db.select().from(aiChatUsage)
        .where(and(eq(aiChatUsage.userId, userId), eq(aiChatUsage.chatDate, chatDate)))
        .limit(1);
      return usage ? { messageCount: usage.messageCount } : undefined;
    } catch (error) {
      console.error("Error getting AI chat usage:", error);
      return undefined;
    }
  }

  async incrementAiChatUsage(userId: string, chatDate: string): Promise<void> {
    try {
      const existingUsage = await this.getAiChatUsage(userId, chatDate);
      
      if (existingUsage) {
        await db.update(aiChatUsage)
          .set({ 
            messageCount: existingUsage.messageCount + 1,
            updatedAt: new Date()
          })
          .where(and(eq(aiChatUsage.userId, userId), eq(aiChatUsage.chatDate, chatDate)));
      } else {
        await db.insert(aiChatUsage).values({
          userId,
          chatDate,
          messageCount: 1
        });
      }
    } catch (error) {
      console.error("Error incrementing AI chat usage:", error);
      throw error;
    }
  }

  // Message limiting functions
  async checkMessageLimit(userId: string): Promise<{ allowed: boolean; messageCount: number; nextResetTime?: Date }> {
    try {
      const usage = await db.select().from(userMessageUsage)
        .where(eq(userMessageUsage.userId, userId))
        .limit(1);

      const now = new Date();
      const resetTime = 24 * 60 * 60 * 1000; // 24 hours
      
      let currentUsage = usage[0];

      // Check if we need to reset the counter
      if (currentUsage && currentUsage.lastReset && now.getTime() - new Date(currentUsage.lastReset).getTime() > resetTime) {
        await db.update(userMessageUsage)
          .set({ messageCount: 0, lastReset: now })
          .where(eq(userMessageUsage.userId, userId));
        currentUsage = { ...currentUsage, messageCount: 0, lastReset: now };
      }

      // Check if limit is reached (3 messages per day)
      if (currentUsage && (currentUsage.messageCount || 0) >= 3) {
        const nextReset = new Date(new Date(currentUsage.lastReset || now).getTime() + resetTime);
        return { allowed: false, messageCount: currentUsage.messageCount || 0, nextResetTime: nextReset };
      }

      // Increment message count
      if (currentUsage) {
        const newCount = (currentUsage.messageCount || 0) + 1;
        await db.update(userMessageUsage)
          .set({ messageCount: newCount })
          .where(eq(userMessageUsage.userId, userId));
        return { allowed: true, messageCount: newCount };
      } else {
        // Create new usage record
        await db.insert(userMessageUsage)
          .values({ userId, messageCount: 1, lastReset: now });
        return { allowed: true, messageCount: 1 };
      }
    } catch (error) {
      console.error("Error checking message limit:", error);
      return { allowed: true, messageCount: 0 }; // Allow on error
    }
  }

  async getMessageUsage(userId: string): Promise<{ messageCount: number; nextResetTime: Date | null }> {
    try {
      const usage = await db.select().from(userMessageUsage)
        .where(eq(userMessageUsage.userId, userId))
        .limit(1);

      if (usage[0]) {
        const resetTime = 24 * 60 * 60 * 1000; // 24 hours
        const nextReset = new Date(new Date(usage[0].lastReset || new Date()).getTime() + resetTime);
        return { messageCount: usage[0].messageCount || 0, nextResetTime: nextReset };
      }

      return { messageCount: 0, nextResetTime: null };
    } catch (error) {
      console.error("Error getting message usage:", error);
      return { messageCount: 0, nextResetTime: null };
    }
  }

  // Daily Ritual Check-ins
  async createDailyRitualCheckin(checkin: InsertDailyRitualCheckin): Promise<DailyRitualCheckin> {
    try {
      const [newCheckin] = await db.insert(dailyRitualCheckins)
        .values(checkin)
        .returning();
      return newCheckin;
    } catch (error) {
      console.error("Error creating daily ritual checkin:", error);
      throw error;
    }
  }

  async getDailyRitualCheckins(userId: string): Promise<DailyRitualCheckin[]> {
    try {
      return await db.select().from(dailyRitualCheckins)
        .where(eq(dailyRitualCheckins.userId, userId))
        .orderBy(desc(dailyRitualCheckins.createdAt));
    } catch (error) {
      console.error("Error getting daily ritual checkins:", error);
      return [];
    }
  }

  async getTodayRitualCheckin(userId: string): Promise<DailyRitualCheckin | undefined> {
    try {
      const today = getChicagoDateString();
      const startOfDay = new Date(today + "T00:00:00.000Z");
      const endOfDay = new Date(today + "T23:59:59.999Z");
      
      const [checkin] = await db.select().from(dailyRitualCheckins)
        .where(
          and(
            eq(dailyRitualCheckins.userId, userId),
            sql`${dailyRitualCheckins.createdAt} >= ${startOfDay}`,
            sql`${dailyRitualCheckins.createdAt} <= ${endOfDay}`
          )
        )
        .orderBy(desc(dailyRitualCheckins.createdAt))
        .limit(1);
      
      return checkin;
    } catch (error) {
      console.error("Error getting today's ritual checkin:", error);
      return undefined;
    }
  }

  // Subscription Management
  async createSubscription(subscription: InsertSubscriptionManagement): Promise<SubscriptionManagement> {
    try {
      const [newSubscription] = await db.insert(subscriptionManagement)
        .values(subscription)
        .returning();
      return newSubscription;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  async getUserSubscription(userId: string): Promise<SubscriptionManagement | undefined> {
    try {
      const [subscription] = await db.select().from(subscriptionManagement)
        .where(and(
          eq(subscriptionManagement.userId, userId),
          eq(subscriptionManagement.isActive, true)
        ))
        .orderBy(desc(subscriptionManagement.createdAt))
        .limit(1);
      
      // Check if subscription is expired
      if (subscription && subscription.expiryDate && new Date() > new Date(subscription.expiryDate)) {
        await this.deactivateSubscription(subscription.id);
        return undefined;
      }
      
      return subscription;
    } catch (error) {
      console.error("Error getting user subscription:", error);
      return undefined;
    }
  }

  async updateSubscription(subscriptionId: number, updates: Partial<InsertSubscriptionManagement>): Promise<SubscriptionManagement> {
    try {
      const [updatedSubscription] = await db.update(subscriptionManagement)
        .set(updates)
        .where(eq(subscriptionManagement.id, subscriptionId))
        .returning();
      return updatedSubscription;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }

  async deactivateSubscription(subscriptionId: number): Promise<void> {
    try {
      await db.update(subscriptionManagement)
        .set({ isActive: false })
        .where(eq(subscriptionManagement.id, subscriptionId));
    } catch (error) {
      console.error("Error deactivating subscription:", error);
      throw error;
    }
  }

  async getAllActiveSubscriptions(): Promise<SubscriptionManagement[]> {
    try {
      return await db.select().from(subscriptionManagement)
        .where(eq(subscriptionManagement.isActive, true))
        .orderBy(desc(subscriptionManagement.createdAt));
    } catch (error) {
      console.error("Error getting active subscriptions:", error);
      return [];
    }
  }

  async grantFreeSubscription(userId: string, months: number, notes?: string): Promise<SubscriptionManagement> {
    try {
      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setMonth(startDate.getMonth() + months);

      const subscription: InsertSubscriptionManagement = {
        userId,
        subscriptionType: "premium",
        amount: 0, // Free subscription
        startDate: startDate,
        expiryDate: expiryDate,
        isActive: true,
        grantedByAdmin: true,
        notes: notes || `Free ${months} month${months > 1 ? 's' : ''} subscription granted by admin`
      };

      return await this.createSubscription(subscription);
    } catch (error) {
      console.error("Error granting free subscription:", error);
      throw error;
    }
  }

  // Client Daily Check-ins Implementation
  async createClientDailyCheckin(checkin: InsertClientDailyCheckin): Promise<ClientDailyCheckin> {
    try {
      const [newCheckin] = await db.insert(clientDailyCheckins)
        .values(checkin)
        .returning();
      return newCheckin;
    } catch (error) {
      console.error("Error creating client daily checkin:", error);
      throw error;
    }
  }

  async getClientDailyCheckins(userId: string): Promise<ClientDailyCheckin[]> {
    try {
      return await db.select().from(clientDailyCheckins)
        .where(eq(clientDailyCheckins.userId, userId))
        .orderBy(desc(clientDailyCheckins.createdAt));
    } catch (error) {
      console.error("Error getting client daily checkins:", error);
      return [];
    }
  }

  async getTodayClientCheckin(userId: string, date: string): Promise<ClientDailyCheckin | undefined> {
    try {
      const [checkin] = await db.select().from(clientDailyCheckins)
        .where(and(
          eq(clientDailyCheckins.userId, userId),
          eq(clientDailyCheckins.checkinDate, date)
        ))
        .limit(1);
      return checkin;
    } catch (error) {
      console.error("Error getting today's client checkin:", error);
      return undefined;
    }
  }

  async getAllClientCheckins(): Promise<ClientDailyCheckin[]> {
    try {
      return await db.select().from(clientDailyCheckins)
        .orderBy(desc(clientDailyCheckins.createdAt));
    } catch (error) {
      console.error("Error getting all client checkins:", error);
      return [];
    }
  }

  // Client Message Usage Tracking Implementation
  async getClientMessageUsage(userId: string): Promise<{ messageCount: number; lastReset: Date | null }> {
    try {
      const [usage] = await db.select().from(clientMessageUsage)
        .where(eq(clientMessageUsage.userId, userId))
        .limit(1);
      
      if (usage) {
        return { messageCount: usage.messageCount || 0, lastReset: usage.lastReset };
      }
      
      return { messageCount: 0, lastReset: null };
    } catch (error) {
      console.error("Error getting client message usage:", error);
      return { messageCount: 0, lastReset: null };
    }
  }

  async incrementClientMessageCount(userId: string): Promise<void> {
    try {
      const now = new Date();
      
      // Check if user has existing usage
      const [usage] = await db.select().from(clientMessageUsage)
        .where(eq(clientMessageUsage.userId, userId))
        .limit(1);
      
      if (usage) {
        // Check if it's been more than 24 hours since last reset
        const lastReset = usage.lastReset || usage.createdAt;
        const timeDiff = now.getTime() - new Date(lastReset).getTime();
        const resetTime = 24 * 60 * 60 * 1000; // 24 hours
        
        if (timeDiff >= resetTime) {
          // Reset count
          await db.update(clientMessageUsage)
            .set({ messageCount: 1, lastReset: now })
            .where(eq(clientMessageUsage.userId, userId));
        } else {
          // Increment count
          await db.update(clientMessageUsage)
            .set({ messageCount: (usage.messageCount || 0) + 1 })
            .where(eq(clientMessageUsage.userId, userId));
        }
      } else {
        // Create new usage record
        await db.insert(clientMessageUsage)
          .values({ userId, messageCount: 1, lastReset: now });
      }
    } catch (error) {
      console.error("Error incrementing client message count:", error);
      throw error;
    }
  }

  async resetClientMessageCount(userId: string): Promise<void> {
    try {
      const now = new Date();
      await db.update(clientMessageUsage)
        .set({ messageCount: 0, lastReset: now })
        .where(eq(clientMessageUsage.userId, userId));
    } catch (error) {
      console.error("Error resetting client message count:", error);
      throw error;
    }
  }

  // Seraphine AI Features Implementation
  async createSeraphineAnalysis(analysis: InsertSeraphineAnalysis): Promise<SeraphineAnalysis> {
    try {
      const [newAnalysis] = await db.insert(seraphineAnalysis).values(analysis).returning();
      return newAnalysis;
    } catch (error) {
      console.error("Error creating Seraphine analysis:", error);
      throw error;
    }
  }

  async getSeraphineAnalyses(userId: string): Promise<SeraphineAnalysis[]> {
    try {
      return await db
        .select()
        .from(seraphineAnalysis)
        .where(eq(seraphineAnalysis.userId, userId))
        .orderBy(desc(seraphineAnalysis.createdAt));
    } catch (error) {
      console.error("Error getting Seraphine analyses:", error);
      throw error;
    }
  }

  async getLatestSeraphineAnalysis(userId: string): Promise<SeraphineAnalysis | undefined> {
    try {
      const [analysis] = await db
        .select()
        .from(seraphineAnalysis)
        .where(eq(seraphineAnalysis.userId, userId))
        .orderBy(desc(seraphineAnalysis.createdAt))
        .limit(1);
      return analysis;
    } catch (error) {
      console.error("Error getting latest Seraphine analysis:", error);
      throw error;
    }
  }

  async createSeraphineCheckin(checkin: InsertSeraphineCheckin): Promise<SeraphineCheckin> {
    try {
      const [newCheckin] = await db.insert(seraphineCheckins).values(checkin).returning();
      return newCheckin;
    } catch (error) {
      console.error("Error creating Seraphine check-in:", error);
      throw error;
    }
  }

  async getSeraphineCheckins(userId: string): Promise<SeraphineCheckin[]> {
    try {
      return await db
        .select()
        .from(seraphineCheckins)
        .where(eq(seraphineCheckins.userId, userId))
        .orderBy(desc(seraphineCheckins.createdAt));
    } catch (error) {
      console.error("Error getting Seraphine check-ins:", error);
      throw error;
    }
  }

  async updateSeraphineCheckinResponse(checkinId: number, response: string): Promise<void> {
    try {
      await db
        .update(seraphineCheckins)
        .set({ response, respondedAt: new Date() })
        .where(eq(seraphineCheckins.id, checkinId));
    } catch (error) {
      console.error("Error updating Seraphine check-in response:", error);
      throw error;
    }
  }

  async createSeraphineInsight(insight: InsertSeraphineInsight): Promise<SeraphineInsight> {
    try {
      const [newInsight] = await db.insert(seraphineInsights).values(insight).returning();
      return newInsight;
    } catch (error) {
      console.error("Error creating Seraphine insight:", error);
      throw error;
    }
  }

  async getSeraphineInsights(userId: string): Promise<SeraphineInsight[]> {
    try {
      return await db
        .select()
        .from(seraphineInsights)
        .where(eq(seraphineInsights.userId, userId))
        .orderBy(desc(seraphineInsights.createdAt));
    } catch (error) {
      console.error("Error getting Seraphine insights:", error);
      throw error;
    }
  }

  // Sacred Content Library methods
  async createSacredContent(content: InsertSacredContentLibrary): Promise<SacredContentLibrary> {
    try {
      const [result] = await db
        .insert(sacredContentLibrary)
        .values(content)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating sacred content:", error);
      throw error;
    }
  }

  async getSacredContentByType(type: string): Promise<SacredContentLibrary[]> {
    try {
      return await db
        .select()
        .from(sacredContentLibrary)
        .where(eq(sacredContentLibrary.type, type))
        .orderBy(desc(sacredContentLibrary.dateAdded));
    } catch (error) {
      console.error("Error getting sacred content by type:", error);
      throw error;
    }
  }

  async getSacredContentByTags(tags: string[]): Promise<SacredContentLibrary[]> {
    try {
      // Find content that contains any of the specified tags
      return await db
        .select()
        .from(sacredContentLibrary)
        .where(sql`${sacredContentLibrary.tags} && ${tags}`)
        .orderBy(desc(sacredContentLibrary.dateAdded));
    } catch (error) {
      console.error("Error getting sacred content by tags:", error);
      throw error;
    }
  }

  async getAllSacredContent(): Promise<SacredContentLibrary[]> {
    try {
      return await db
        .select()
        .from(sacredContentLibrary)
        .orderBy(desc(sacredContentLibrary.dateAdded));
    } catch (error) {
      console.error("Error getting all sacred content:", error);
      throw error;
    }
  }

  async getSacredContentByVisibility(visibility: string): Promise<SacredContentLibrary[]> {
    try {
      return await db
        .select()
        .from(sacredContentLibrary)
        .where(eq(sacredContentLibrary.visibility, visibility))
        .orderBy(desc(sacredContentLibrary.dateAdded));
    } catch (error) {
      console.error("Error getting sacred content by visibility:", error);
      throw error;
    }
  }

  async updateSacredContent(id: number, updates: Partial<InsertSacredContentLibrary>): Promise<SacredContentLibrary> {
    try {
      const [result] = await db
        .update(sacredContentLibrary)
        .set(updates)
        .where(eq(sacredContentLibrary.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating sacred content:", error);
      throw error;
    }
  }

  async deleteSacredContent(id: number): Promise<void> {
    try {
      await db.delete(sacredContentLibrary).where(eq(sacredContentLibrary.id, id));
    } catch (error) {
      console.error("Error deleting sacred content:", error);
      throw error;
    }
  }

  // User Sacred Content Log methods
  async logSacredContentInteraction(log: InsertUserSacredContentLog): Promise<UserSacredContentLog> {
    try {
      const [result] = await db
        .insert(userSacredContentLog)
        .values(log)
        .returning();
      return result;
    } catch (error) {
      console.error("Error logging sacred content interaction:", error);
      throw error;
    }
  }

  async getUserSacredContentLogs(userId: string): Promise<UserSacredContentLog[]> {
    try {
      return await db
        .select()
        .from(userSacredContentLog)
        .where(eq(userSacredContentLog.userId, userId))
        .orderBy(desc(userSacredContentLog.dateSent));
    } catch (error) {
      console.error("Error getting user sacred content logs:", error);
      throw error;
    }
  }

  async getUserSavedContent(userId: string): Promise<UserSacredContentLog[]> {
    try {
      return await db
        .select()
        .from(userSacredContentLog)
        .where(and(
          eq(userSacredContentLog.userId, userId),
          eq(userSacredContentLog.isSaved, true)
        ))
        .orderBy(desc(userSacredContentLog.dateSent));
    } catch (error) {
      console.error("Error getting user saved content:", error);
      throw error;
    }
  }

  async saveSacredContentForUser(userId: string, contentId: number): Promise<void> {
    try {
      await db
        .update(userSacredContentLog)
        .set({ isSaved: true })
        .where(and(
          eq(userSacredContentLog.userId, userId),
          eq(userSacredContentLog.contentId, contentId)
        ));
    } catch (error) {
      console.error("Error saving sacred content for user:", error);
      throw error;
    }
  }

  async unsaveSacredContentForUser(userId: string, contentId: number): Promise<void> {
    try {
      await db
        .update(userSacredContentLog)
        .set({ isSaved: false })
        .where(and(
          eq(userSacredContentLog.userId, userId),
          eq(userSacredContentLog.contentId, contentId)
        ));
    } catch (error) {
      console.error("Error unsaving sacred content for user:", error);
      throw error;
    }
  }

  // Energy Readings methods - Premium spiritual insights for $33
  async createEnergyReading(reading: InsertEnergyReading): Promise<EnergyReading> {
    try {
      const [result] = await db
        .insert(energyReadings)
        .values(reading)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating energy reading:", error);
      throw error;
    }
  }

  async getEnergyReadings(userId: string): Promise<EnergyReading[]> {
    try {
      return await db
        .select()
        .from(energyReadings)
        .where(eq(energyReadings.userId, userId))
        .orderBy(desc(energyReadings.createdAt));
    } catch (error) {
      console.error("Error getting energy readings:", error);
      throw error;
    }
  }

  async getMonthlyEnergyReadings(userId: string): Promise<EnergyReading[]> {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      return await db
        .select()
        .from(energyReadings)
        .where(
          and(
            eq(energyReadings.userId, userId),
            sql`${energyReadings.createdAt} >= ${currentMonth.toISOString()}`
          )
        )
        .orderBy(desc(energyReadings.createdAt));
    } catch (error) {
      console.error("Error getting monthly energy readings:", error);
      throw error;
    }
  }

  async getEnergyReading(id: number): Promise<EnergyReading | null> {
    try {
      const [result] = await db
        .select()
        .from(energyReadings)
        .where(eq(energyReadings.id, id));
      return result || null;
    } catch (error) {
      console.error("Error getting energy reading:", error);
      throw error;
    }
  }

  // Seraphine Training Methods
  async createSeraphineTrainingSession(sessionData: InsertSeraphineTrainingSession): Promise<SelectSeraphineTrainingSession> {
    try {
      const [session] = await db
        .insert(seraphineTrainingSessions)
        .values(sessionData)
        .returning();
      return session;
    } catch (error) {
      console.error("Error creating training session:", error);
      throw error;
    }
  }

  async getSeraphineTrainingSessions(): Promise<SelectSeraphineTrainingSession[]> {
    try {
      return await db
        .select()
        .from(seraphineTrainingSessions)
        .orderBy(desc(seraphineTrainingSessions.createdAt));
    } catch (error) {
      console.error("Error getting training sessions:", error);
      throw error;
    }
  }

  async getSeraphineTrainingSession(id: number): Promise<SelectSeraphineTrainingSession | null> {
    try {
      const [session] = await db
        .select()
        .from(seraphineTrainingSessions)
        .where(eq(seraphineTrainingSessions.id, id));
      return session || null;
    } catch (error) {
      console.error("Error getting training session:", error);
      throw error;
    }
  }

  async createSeraphineTrainingMessage(messageData: InsertSeraphineTrainingMessage): Promise<SelectSeraphineTrainingMessage> {
    try {
      const [message] = await db
        .insert(seraphineTrainingMessages)
        .values(messageData)
        .returning();
      return message;
    } catch (error) {
      console.error("Error creating training message:", error);
      throw error;
    }
  }

  async getSeraphineTrainingMessages(sessionId: number): Promise<SelectSeraphineTrainingMessage[]> {
    try {
      return await db
        .select()
        .from(seraphineTrainingMessages)
        .where(eq(seraphineTrainingMessages.sessionId, sessionId))
        .orderBy(seraphineTrainingMessages.timestamp);
    } catch (error) {
      console.error("Error getting training messages:", error);
      throw error;
    }
  }

  async updateSeraphineTrainingMessageQuality(
    messageId: number, 
    quality: 'excellent' | 'good' | 'needs_improvement',
    note?: string
  ): Promise<void> {
    try {
      await db
        .update(seraphineTrainingMessages)
        .set({ 
          responseQuality: quality,
          trainingNote: note 
        })
        .where(eq(seraphineTrainingMessages.id, messageId));
    } catch (error) {
      console.error("Error updating message quality:", error);
      throw error;
    }
  }

  async getLatestTrainingGuidance(): Promise<string> {
    try {
      // Get the latest training messages from natural conversation mode
      const trainingMessages = await db
        .select()
        .from(seraphineTrainingMessages)
        .where(eq(seraphineTrainingMessages.role, 'trainer'))
        .orderBy(desc(seraphineTrainingMessages.timestamp))
        .limit(10); // Get last 10 training instructions

      if (trainingMessages.length === 0) {
        return "Maintain luxury spiritual concierge standards with divine elegance and sophistication.";
      }

      // Combine recent training guidance
      const guidance = trainingMessages
        .map(msg => `- ${msg.content}${msg.trainingNote ? ` (Note: ${msg.trainingNote})` : ''}`)
        .join('\n');

      return `Recent training from Vanessa Rich:\n${guidance}`;
    } catch (error) {
      console.error("Error getting training guidance:", error);
      return "Maintain luxury spiritual concierge standards with divine elegance and sophistication.";
    }
  }

  // Interactive Mood Board Implementation
  async createMoodBoard(moodBoard: InsertMoodBoard): Promise<MoodBoard> {
    try {
      const [newMoodBoard] = await db.insert(moodBoards)
        .values(moodBoard)
        .returning();
      return newMoodBoard;
    } catch (error) {
      console.error("Error creating mood board:", error);
      throw error;
    }
  }

  async getUserMoodBoards(userId: string): Promise<MoodBoard[]> {
    try {
      return await db.select().from(moodBoards)
        .where(eq(moodBoards.userId, userId))
        .orderBy(desc(moodBoards.updatedAt));
    } catch (error) {
      console.error("Error getting user mood boards:", error);
      return [];
    }
  }

  async getMoodBoard(moodBoardId: number): Promise<MoodBoard | undefined> {
    try {
      const [moodBoard] = await db.select().from(moodBoards)
        .where(eq(moodBoards.id, moodBoardId))
        .limit(1);
      return moodBoard;
    } catch (error) {
      console.error("Error getting mood board:", error);
      return undefined;
    }
  }

  async updateMoodBoard(moodBoardId: number, updates: Partial<InsertMoodBoard>): Promise<MoodBoard> {
    try {
      const [updatedMoodBoard] = await db.update(moodBoards)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(moodBoards.id, moodBoardId))
        .returning();
      return updatedMoodBoard;
    } catch (error) {
      console.error("Error updating mood board:", error);
      throw error;
    }
  }

  async deleteMoodBoard(moodBoardId: number): Promise<void> {
    try {
      // First delete all elements
      await db.delete(moodBoardElements)
        .where(eq(moodBoardElements.moodBoardId, moodBoardId));
      
      // Then delete all shares
      await db.delete(moodBoardShares)
        .where(eq(moodBoardShares.moodBoardId, moodBoardId));
      
      // Finally delete the mood board
      await db.delete(moodBoards)
        .where(eq(moodBoards.id, moodBoardId));
    } catch (error) {
      console.error("Error deleting mood board:", error);
      throw error;
    }
  }

  async addElementToMoodBoard(element: InsertMoodBoardElement): Promise<MoodBoardElement> {
    try {
      const [newElement] = await db.insert(moodBoardElements)
        .values(element)
        .returning();
      return newElement;
    } catch (error) {
      console.error("Error adding element to mood board:", error);
      throw error;
    }
  }

  async getMoodBoardElements(moodBoardId: number): Promise<MoodBoardElement[]> {
    try {
      return await db.select().from(moodBoardElements)
        .where(eq(moodBoardElements.moodBoardId, moodBoardId))
        .orderBy(moodBoardElements.createdAt);
    } catch (error) {
      console.error("Error getting mood board elements:", error);
      return [];
    }
  }

  async updateMoodBoardElement(elementId: number, updates: Partial<InsertMoodBoardElement>): Promise<MoodBoardElement> {
    try {
      const [updatedElement] = await db.update(moodBoardElements)
        .set(updates)
        .where(eq(moodBoardElements.id, elementId))
        .returning();
      return updatedElement;
    } catch (error) {
      console.error("Error updating mood board element:", error);
      throw error;
    }
  }

  async deleteMoodBoardElement(elementId: number): Promise<void> {
    try {
      await db.delete(moodBoardElements)
        .where(eq(moodBoardElements.id, elementId));
    } catch (error) {
      console.error("Error deleting mood board element:", error);
      throw error;
    }
  }

  async shareMoodBoard(share: InsertMoodBoardShare): Promise<MoodBoardShare> {
    try {
      const [newShare] = await db.insert(moodBoardShares)
        .values(share)
        .returning();
      return newShare;
    } catch (error) {
      console.error("Error sharing mood board:", error);
      throw error;
    }
  }

  async getMoodBoardShares(moodBoardId: number): Promise<MoodBoardShare[]> {
    try {
      return await db.select().from(moodBoardShares)
        .where(eq(moodBoardShares.moodBoardId, moodBoardId))
        .orderBy(desc(moodBoardShares.createdAt));
    } catch (error) {
      console.error("Error getting mood board shares:", error);
      return [];
    }
  }

  async getSharedMoodBoards(): Promise<MoodBoard[]> {
    try {
      // Get mood boards that have been shared (have entries in moodBoardShares)
      const sharedBoardIds = await db.select({ id: moodBoardShares.moodBoardId })
        .from(moodBoardShares)
        .groupBy(moodBoardShares.moodBoardId);
      
      if (sharedBoardIds.length === 0) return [];
      
      return await db.select().from(moodBoards)
        .where(sql`${moodBoards.id} IN (${sharedBoardIds.map(b => b.id).join(',')})`)
        .orderBy(desc(moodBoards.updatedAt));
    } catch (error) {
      console.error("Error getting shared mood boards:", error);
      return [];
    }
  }

  // Dropdown Reflection Module - "Decode You™" Tool
  async createReflectionSession(sessionData: InsertReflectionSession): Promise<ReflectionSession> {
    try {
      const [session] = await db
        .insert(reflectionSessions)
        .values(sessionData)
        .returning();
      return session;
    } catch (error) {
      console.error("Error creating reflection session:", error);
      throw error;
    }
  }

  async getReflectionSessions(userId: string): Promise<ReflectionSession[]> {
    try {
      return await db
        .select()
        .from(reflectionSessions)
        .where(eq(reflectionSessions.userId, userId))
        .orderBy(desc(reflectionSessions.createdAt));
    } catch (error) {
      console.error("Error getting reflection sessions:", error);
      throw error;
    }
  }

  async getReflectionSession(sessionId: number): Promise<ReflectionSession | undefined> {
    try {
      const [session] = await db
        .select()
        .from(reflectionSessions)
        .where(eq(reflectionSessions.id, sessionId));
      return session;
    } catch (error) {
      console.error("Error getting reflection session:", error);
      throw error;
    }
  }

  async updateReflectionSession(sessionId: number, updates: Partial<InsertReflectionSession>): Promise<ReflectionSession> {
    try {
      const [session] = await db
        .update(reflectionSessions)
        .set(updates)
        .where(eq(reflectionSessions.id, sessionId))
        .returning();
      return session;
    } catch (error) {
      console.error("Error updating reflection session:", error);
      throw error;
    }
  }

  async createReflectionAnalytics(analyticsData: InsertReflectionAnalytics): Promise<ReflectionAnalytics> {
    try {
      const [analytics] = await db
        .insert(reflectionAnalytics)
        .values(analyticsData)
        .returning();
      return analytics;
    } catch (error) {
      console.error("Error creating reflection analytics:", error);
      throw error;
    }
  }

  async getReflectionAnalytics(userId?: string): Promise<ReflectionAnalytics[]> {
    try {
      if (userId) {
        return await db
          .select()
          .from(reflectionAnalytics)
          .where(eq(reflectionAnalytics.userId, userId))
          .orderBy(desc(reflectionAnalytics.createdAt));
      }
      return await db
        .select()
        .from(reflectionAnalytics)
        .orderBy(desc(reflectionAnalytics.createdAt));
    } catch (error) {
      console.error("Error getting reflection analytics:", error);
      throw error;
    }
  }

  async getPopularEmotionalPatterns(): Promise<{ pattern: string; count: number }[]> {
    try {
      const patterns = await db
        .select({
          pattern: reflectionAnalytics.emotionalPattern,
          count: sql<number>`count(*)`
        })
        .from(reflectionAnalytics)
        .where(sql`${reflectionAnalytics.emotionalPattern} IS NOT NULL`)
        .groupBy(reflectionAnalytics.emotionalPattern)
        .orderBy(desc(sql`count(*)`))
        .limit(10);
      
      return patterns.map(p => ({ pattern: p.pattern!, count: p.count }));
    } catch (error) {
      console.error("Error getting popular emotional patterns:", error);
      throw error;
    }
  }

  async getCTAConversionRates(): Promise<{ ctaType: string; conversions: number; totalSessions: number }[]> {
    try {
      const conversions = await db
        .select({
          ctaType: reflectionAnalytics.ctaType,
          conversions: sql<number>`count(*) filter (where ${reflectionSessions.ctaClicked} = true)`,
          totalSessions: sql<number>`count(*)`
        })
        .from(reflectionAnalytics)
        .innerJoin(reflectionSessions, eq(reflectionAnalytics.sessionId, reflectionSessions.id))
        .where(sql`${reflectionAnalytics.ctaType} IS NOT NULL`)
        .groupBy(reflectionAnalytics.ctaType);
      
      return conversions.map(c => ({ 
        ctaType: c.ctaType!, 
        conversions: c.conversions, 
        totalSessions: c.totalSessions 
      }));
    } catch (error) {
      console.error("Error getting CTA conversion rates:", error);
      throw error;
    }
  }

  // Intake Assessment System Implementation
  async createIntakeAssessment(assessment: InsertIntakeAssessment): Promise<IntakeAssessment> {
    try {
      const [newAssessment] = await db
        .insert(intakeAssessments)
        .values(assessment)
        .returning();
      return newAssessment;
    } catch (error) {
      console.error("Error creating intake assessment:", error);
      throw error;
    }
  }

  async getIntakeAssessments(userId: string): Promise<IntakeAssessment[]> {
    try {
      return await db
        .select()
        .from(intakeAssessments)
        .where(eq(intakeAssessments.userId, userId))
        .orderBy(desc(intakeAssessments.completedAt));
    } catch (error) {
      console.error("Error getting intake assessments:", error);
      throw error;
    }
  }

  async getLatestIntakeAssessment(userId: string): Promise<IntakeAssessment | undefined> {
    try {
      const [assessment] = await db
        .select()
        .from(intakeAssessments)
        .where(eq(intakeAssessments.userId, userId))
        .orderBy(desc(intakeAssessments.completedAt))
        .limit(1);
      return assessment;
    } catch (error) {
      console.error("Error getting latest intake assessment:", error);
      throw error;
    }
  }

  async getIntakeAssessmentsByType(userId: string, assessmentType: string): Promise<IntakeAssessment[]> {
    try {
      return await db
        .select()
        .from(intakeAssessments)
        .where(and(
          eq(intakeAssessments.userId, userId),
          eq(intakeAssessments.assessmentType, assessmentType)
        ))
        .orderBy(desc(intakeAssessments.completedAt));
    } catch (error) {
      console.error("Error getting intake assessments by type:", error);
      throw error;
    }
  }

  async updateIntakeAssessmentAnalysis(id: number, analysis: any): Promise<IntakeAssessment> {
    try {
      const [updatedAssessment] = await db
        .update(intakeAssessments)
        .set({ aiInsights: analysis })
        .where(eq(intakeAssessments.id, id))
        .returning();
      return updatedAssessment;
    } catch (error) {
      console.error("Error updating intake assessment analysis:", error);
      throw error;
    }
  }

  // Client Portal Insights Implementation
  async createClientPortalInsight(insight: InsertClientPortalInsight): Promise<ClientPortalInsight> {
    try {
      const [newInsight] = await db
        .insert(clientPortalInsights)
        .values(insight)
        .returning();
      return newInsight;
    } catch (error) {
      console.error("Error creating client portal insight:", error);
      throw error;
    }
  }

  async getClientPortalInsights(userId: string): Promise<ClientPortalInsight[]> {
    try {
      return await db
        .select()
        .from(clientPortalInsights)
        .where(eq(clientPortalInsights.userId, userId))
        .orderBy(desc(clientPortalInsights.createdAt));
    } catch (error) {
      console.error("Error getting client portal insights:", error);
      throw error;
    }
  }

  async getLatestClientPortalInsight(userId: string): Promise<ClientPortalInsight | undefined> {
    try {
      const [insight] = await db
        .select()
        .from(clientPortalInsights)
        .where(eq(clientPortalInsights.userId, userId))
        .orderBy(desc(clientPortalInsights.createdAt))
        .limit(1);
      return insight;
    } catch (error) {
      console.error("Error getting latest client portal insight:", error);
      throw error;
    }
  }

  async updateClientPortalInsight(id: number, updates: Partial<InsertClientPortalInsight>): Promise<ClientPortalInsight> {
    try {
      const [updatedInsight] = await db
        .update(clientPortalInsights)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(clientPortalInsights.id, id))
        .returning();
      return updatedInsight;
    } catch (error) {
      console.error("Error updating client portal insight:", error);
      throw error;
    }
  }

  // Religious Preferences Implementation
  async saveReligiousPreference(preference: any): Promise<void> {
    try {
      // Store religious preferences in user's profile or a separate table
      // For now, using a simple JSON storage approach
      const storage = (global as any).religiousPreferences || {};
      storage[preference.userId] = preference;
      (global as any).religiousPreferences = storage;
    } catch (error) {
      console.error("Error saving religious preference:", error);
      throw error;
    }
  }

  async getReligiousPreference(userId: string): Promise<any | null> {
    try {
      const storage = (global as any).religiousPreferences || {};
      return storage[userId] || null;
    } catch (error) {
      console.error("Error getting religious preference:", error);
      return null;
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize database with seed data
(async () => {
  await storage.seedDatabase();
})();
