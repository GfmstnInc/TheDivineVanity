# The Divine Vanity - Complete Code Export for Error Analysis

## Project Overview
Luxury spiritual empowerment platform with React frontend, Express backend, PostgreSQL database, and Stripe subscription integration.

---

## 1. DATABASE SCHEMA (shared/schema.ts)

```typescript
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

// User storage table with dual auth support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique(),
  passwordHash: varchar("password_hash"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionStatus: text("subscription_status").notNull().default("free"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isOnboarded: boolean("is_onboarded").default(false),
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

export const chakraQuizResults = pgTable("chakra_quiz_results", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  dominantChakra: text("dominant_chakra").notNull(),
  imbalancedChakra: text("imbalanced_chakra").notNull(),
  scores: text("scores").notNull(),
  recommendations: text("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  achievementType: text("achievement_type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity").notNull(),
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

// Chat conversation tables for AI spiritual guidance
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  energyInsight: text("energy_insight"),
  sacredAction: text("sacred_action"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Prayer Room tables
export const prayers = pgTable("prayers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  authorId: varchar("author_id").notNull(),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  requesterName: text("requester_name"),
  message: text("message").notNull(),
  isPublic: boolean("is_public").default(false),
  candlesLit: integer("candles_lit").default(0),
  prayersSaid: integer("prayers_said").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prayerInteractions = pgTable("prayer_interactions", {
  id: serial("id").primaryKey(),
  prayerRequestId: integer("prayer_request_id").notNull(),
  userId: varchar("user_id").notNull(),
  interactionType: text("interaction_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Divine Feedback table
export const divineFeedback = pgTable("divine_feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  focusGroupInterest: boolean("focus_group_interest").default(false),
  pricingPreference: text("pricing_preference"),
  mostValuableFeature: text("most_valuable_feature"),
  additionalFeatures: text("additional_features"),
  overallExperience: integer("overall_experience"),
  recommendationLikelihood: integer("recommendation_likelihood"),
  additionalComments: text("additional_comments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type DailyRitual = typeof dailyRituals.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type ChakraQuizResult = typeof chakraQuizResults.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type Prayer = typeof prayers.$inferSelect;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type PrayerInteraction = typeof prayerInteractions.$inferSelect;
export type DivineFeedback = typeof divineFeedback.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertChatConversationSchema = createInsertSchema(chatConversations);
export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const insertJournalEntrySchema = createInsertSchema(journalEntries);
export const insertChakraQuizResultSchema = createInsertSchema(chakraQuizResults);
export const insertDivineFeedbackSchema = createInsertSchema(divineFeedback);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type InsertChakraQuizResult = z.infer<typeof insertChakraQuizResultSchema>;
export type InsertDivineFeedback = z.infer<typeof insertDivineFeedbackSchema>;
```

---

## 2. MAIN BACKEND ROUTES (server/routes.ts)

```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendEmail, sendWelcomeEmail, sendUserProfileNotification } from "./sendgrid";
import { getSpiritualGuidance } from "./openai";
import { universalAuth } from "./security";
import { getChicagoDateString, getChicagoDayOfWeek } from "./timeUtils";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Handle custom session auth
      if (req.session?.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          return res.json(user);
        }
      }
      
      // Handle Replit Auth
      if (req.isAuthenticated?.() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          return res.json(user);
        }
      }
      
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Daily ritual routes
  app.get("/api/daily-ritual", async (req, res) => {
    try {
      const chicagoDate = getChicagoDateString();
      const dayOfWeek = getChicagoDayOfWeek();
      
      console.log(`📅 Current date (Chicago): ${chicagoDate}, Day of week: ${dayOfWeek} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]})`);
      
      const ritual = await storage.getDailyRitual(chicagoDate);
      
      if (ritual) {
        res.json(ritual);
      } else {
        // Fallback to day-of-week based ritual
        const ritualId = dayOfWeek; // 0 = Sunday, 1 = Monday, etc.
        const fallbackRitual = await storage.getDailyRitualById(ritualId);
        
        if (fallbackRitual) {
          res.json(fallbackRitual);
        } else {
          res.status(404).json({ message: "No ritual found for today" });
        }
      }
    } catch (error) {
      console.error("Error fetching daily ritual:", error);
      res.status(500).json({ message: "Failed to fetch daily ritual" });
    }
  });

  // Journal routes
  app.get("/api/journal-entries", universalAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal-entries", universalAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      const { prompt, content } = req.body;
      
      const entry = await storage.createJournalEntry({
        userId,
        prompt,
        content,
        date: getChicagoDateString(),
      });

      // Award XP for journal entry
      await storage.createOrUpdateUserStats({
        userId,
        totalJournalEntries: 1,
        experiencePoints: 25,
      });

      res.json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  // Spiritual Chat routes
  app.post("/api/chat/conversation", universalAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      const conversation = await storage.createChatConversation({
        userId,
        title: "New Spiritual Guidance Session",
      });
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.post("/api/chat/message", universalAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      const { conversationId, message } = req.body;

      // Check if user has premium access
      const user = await storage.getUser(userId);
      if (!user || !['premium', 'active'].includes(user.subscriptionStatus || 'free')) {
        return res.status(403).json({ 
          message: "Premium subscription required for spiritual guidance",
          requiresUpgrade: true 
        });
      }

      // Store user message
      await storage.createChatMessage({
        conversationId,
        role: 'user',
        content: message,
      });

      // Get spiritual guidance from AI
      const guidance = await getSpiritualGuidance(message, userId);

      // Store AI response
      const aiMessage = await storage.createChatMessage({
        conversationId,
        role: 'assistant',
        content: guidance.response,
        energyInsight: guidance.energyInsight,
        sacredAction: guidance.sacredAction,
      });

      res.json(aiMessage);
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Stripe subscription routes
  app.post("/api/create-subscription", universalAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.email) {
        return res.status(400).json({ message: "User email required for subscription" });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status === 'active') {
          return res.json({
            success: true,
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
            message: "User already has active subscription"
          });
        }
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'Divine User',
          metadata: { userId: userId }
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId);
      }

      // Create subscription for $49/month
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'usd',
            unit_amount: 4900, // $49.00 in cents
            recurring: {
              interval: 'month',
            },
            product_data: {
              name: 'The Divine Vanity Premium',
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await storage.updateUserStripeInfo(userId, customerId, subscription.id);

      res.json({
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription: " + error.message });
    }
  });

  // Check subscription status
  app.get("/api/subscription/status", universalAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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

  const httpServer = createServer(app);
  return httpServer;
}
```

---

## 3. FRONTEND APP COMPONENT (client/src/App.tsx)

```typescript
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/BottomNavigation";
import Home from "@/pages/Home";
import Journal from "@/pages/Journal";
import SpiritualChat from "@/pages/SpiritualChat";
import Profile from "@/pages/Profile";
import Subscribe from "@/pages/Subscribe";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      <div className={isAuthenticated && user?.isOnboarded ? "pt-16" : ""}>
        <Switch>
        {isLoading ? (
          <Route path="/" component={Landing} />
        ) : !isAuthenticated ? (
          <>
            <Route path="/">
              {() => <Login onLoginSuccess={() => window.location.reload()} />}
            </Route>
            <Route path="/landing" component={Landing} />
          </>
        ) : user && !user.isOnboarded ? (
          <Route path="*" component={Onboarding} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/journal" component={Journal} />
            <Route path="/chat" component={SpiritualChat} />
            <Route path="/profile" component={Profile} />
            <Route path="/subscribe" component={Subscribe} />
          </>
        )}
        <Route component={NotFound} />
        </Switch>
        {isAuthenticated && user?.isOnboarded && <BottomNavigation />}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

---

## 4. SPIRITUAL CHAT COMPONENT (client/src/pages/SpiritualChat.tsx)

```typescript
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Send, Crown, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  energyInsight?: string;
  sacredAction?: string;
  createdAt: string;
}

interface ChatConversation {
  id: number;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SpiritualChat() {
  const { user } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Check subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['/api/subscription/status'],
    retry: false,
  });

  const isPremium = subscriptionStatus?.isPremium || false;

  // If user is not premium, show upgrade page
  if (!isPremium) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Crown className="h-16 w-16 text-divine-gold" />
                <Sparkles className="h-6 w-6 text-divine-gold absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-divine-brown">
              Premium Spiritual Guidance
            </h1>
            <p className="text-divine-brown/80 text-lg">
              Unlock unlimited conversations with Seraphine, your divine spiritual guide
            </p>
          </div>

          <Card className="border-divine-gold/20 bg-gradient-to-br from-cream to-white">
            <CardHeader>
              <CardTitle className="text-divine-brown flex items-center gap-2">
                <Star className="h-5 w-5 text-divine-gold" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-divine-gold rounded-full"></div>
                  <span className="text-divine-brown">Unlimited spiritual conversations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-divine-gold rounded-full"></div>
                  <span className="text-divine-brown">Personalized energy insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-divine-gold rounded-full"></div>
                  <span className="text-divine-brown">Sacred action recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-divine-gold rounded-full"></div>
                  <span className="text-divine-brown">Save and review past sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-divine-brown/60">
              Upgrade to Premium for $49/month
            </p>
            <a 
              href="sms:3109906264?body=Hi%20Vanessa%2C%20I%20was%20recently%20on%20your%20app%20and%20I%20am%20interested%20in%20premium%20access%20for%20the%20spiritual%20chatbot."
              className="inline-block"
            >
              <Button className="bg-gradient-to-r from-divine-gold to-divine-gold/80 text-white hover:from-divine-gold/90 hover:to-divine-gold/70 px-8 py-3 text-lg font-semibold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105">
                📲 Text to Upgrade
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/chat/conversation"),
    onSuccess: (data) => {
      setConversationId(data.id);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, message }: { conversationId: number; message: string }) =>
      apiRequest("POST", "/api/chat/message", { conversationId, message }),
    onSuccess: () => {
      setCurrentMessage("");
      setIsTyping(false);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', conversationId] });
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  // Get messages for current conversation
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/chat/messages', conversationId],
    enabled: !!conversationId,
    retry: false,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    if (!conversationId) {
      await createConversationMutation.mutateAsync();
      return;
    }

    setIsTyping(true);
    sendMessageMutation.mutate({
      conversationId,
      message: currentMessage,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-divine-brown mb-2">
          Divine Guidance with Seraphine
        </h1>
        <p className="text-divine-brown/70">
          Your sacred spiritual guide for wisdom and enlightenment
        </p>
      </div>

      <Card className="border-divine-gold/20 bg-gradient-to-br from-cream to-white">
        <CardContent className="p-6">
          <div className="h-[500px] md:h-[600px] overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.length === 0 && !isTyping && (
              <div className="text-center text-divine-brown/60 mt-20">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-divine-gold" />
                <p>Begin your sacred conversation with Seraphine</p>
              </div>
            )}

            {messages.map((message: ChatMessage) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-divine-gold to-divine-gold/80 text-white'
                      : 'bg-white border border-divine-gold/20 text-divine-brown'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.energyInsight && (
                    <div className="mt-3 p-3 bg-divine-gold/10 rounded-lg border-l-4 border-divine-gold">
                      <p className="text-sm font-medium text-divine-brown">✨ Energy Insight:</p>
                      <p className="text-sm text-divine-brown/80 mt-1">{message.energyInsight}</p>
                    </div>
                  )}
                  {message.sacredAction && (
                    <div className="mt-3 p-3 bg-divine-purple/10 rounded-lg border-l-4 border-divine-purple">
                      <p className="text-sm font-medium text-divine-brown">🕊️ Sacred Action:</p>
                      <p className="text-sm text-divine-brown/80 mt-1">{message.sacredAction}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-divine-gold/20 text-divine-brown p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-divine-gold rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-divine-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-2 w-2 bg-divine-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-divine-brown/60">Seraphine is channeling wisdom...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 pb-24 md:pb-8">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your spiritual question or concern..."
              className="flex-1 bg-gradient-to-r from-white to-cream border-divine-gold/30 focus:border-divine-gold rounded-full px-6 py-3"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || sendMessageMutation.isPending}
              className="bg-gradient-to-r from-divine-gold to-divine-gold/80 text-white hover:from-divine-gold/90 hover:to-divine-gold/70 rounded-full px-6 py-3 shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 5. PACKAGE.JSON

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
    "@stripe/react-stripe-js": "^3.7.0",
    "@stripe/stripe-js": "^7.4.0",
    "@tanstack/react-query": "^5.60.5",
    "stripe": "^18.3.0",
    "openai": "^5.8.2",
    "express": "^4.21.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "wouter": "^3.3.5",
    "drizzle-orm": "^0.39.1",
    "@neondatabase/serverless": "^0.10.4"
  }
}
```

---

## POTENTIAL ISSUES TO CHECK:

1. **TypeScript Errors in Storage**: User ID type mismatches (string vs number)
2. **Stripe API**: Payment intent property access on invoice objects
3. **Authentication**: Mixed session and claims property access
4. **Database Relations**: Foreign key constraints and type consistency
5. **Error Handling**: Incomplete try-catch blocks in some routes
6. **Environment Variables**: Missing validation for required API keys

Please analyze this code for any structural, logical, or TypeScript errors. Focus particularly on the database schema consistency, API route error handling, and authentication flow integrity.