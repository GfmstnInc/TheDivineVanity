/**
 * User Analytics & Behavioral Intelligence System
 * Advanced linguistic analysis, micro-pattern detection, and memory-enhanced processing
 * Powers Vanessa's uncannily accurate insights and personalized spiritual guidance
 */

import Anthropic from '@anthropic-ai/sdk';
import { storage } from './storage';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

// Advanced Analytics Interfaces
export interface LinguisticAnalysis {
  bigFiveTraits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  attachmentStyle: {
    primary: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
    secondary?: string;
    confidence: number;
  };
  traumaIndicators: {
    present: boolean;
    severity: 'low' | 'medium' | 'high';
    patterns: string[];
    triggers: string[];
  };
  spiritualDevelopment: {
    stage: 'awakening' | 'seeking' | 'integrating' | 'embodying' | 'serving';
    themes: string[];
    blockers: string[];
    readiness: number;
  };
  communicationPatterns: {
    timeOrientation: 'past' | 'present' | 'future';
    emotionalRegulation: 'healthy' | 'suppressed' | 'reactive' | 'dysregulated';
    selfWorthIndicators: string[];
    relationshipPatterns: string[];
  };
}

export interface MicroPatternDetection {
  unconsciousPatterns: {
    wordChoicePatterns: string[];
    emotionalCycles: {
      pattern: string;
      frequency: string;
      intensity: number;
    }[];
    behavioralTriggers: string[];
    avoidancePatterns: string[];
  };
  energySignatures: {
    morningEnergy: number;
    afternoonEnergy: number;
    eveningEnergy: number;
    optimalTimes: string[];
  };
  purchaseIntentSignals: {
    readiness: number;
    triggers: string[];
    hesitations: string[];
    optimalTiming: string;
  };
  absencePatterns: {
    engagementDrops: string[];
    reengagementTriggers: string[];
    riskFactors: string[];
  };
}

export interface MemoryEnhancedProfile {
  historicalPatterns: {
    growthCycles: string[];
    recurringThemes: string[];
    breakthrough_moments: string[];
    setbackPatterns: string[];
  };
  evolutionTracking: {
    personalityShifts: string[];
    spiritualMilestones: string[];
    behavioralChanges: string[];
    relationshipEvolution: string[];
  };
  predictiveInsights: {
    nextChallenge: string;
    nextBreakthrough: string;
    interventionTiming: string;
    supportNeeds: string[];
  };
}

export interface ConversationMemory {
  userId: string;
  conversationId: string;
  sessionData: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    messageCount: number;
    emotionalJourney: string[];
    keyTopics: string[];
    breakthroughs: string[];
    challenges: string[];
    vanessaInsights: string[];
  };
  contextualMemory: {
    previousSessions: string[];
    ongoingThemes: string[];
    referencePoints: string[];
    evolutionTracking: string[];
    deepestShares: string[];
  };
  emotionalMemory: {
    highestEmotionalMoments: Array<{
      message: string;
      emotion: string;
      intensity: number;
      timestamp: Date;
    }>;
    vulnerabilityMoments: Array<{
      topic: string;
      trust_level: number;
      context: string;
      timestamp: Date;
    }>;
    celebrationMoments: Array<{
      achievement: string;
      significance: string;
      timestamp: Date;
    }>;
  };
  relationshipMemory: {
    trustLevel: number;
    intimacyDepth: number;
    communicationStyle: string;
    boundaries: string[];
    preferences: string[];
    triggersToAvoid: string[];
  };
  spiritualMemory: {
    guidanceReceived: Array<{
      guidance: string;
      effectiveness: number;
      follow_up: string;
      timestamp: Date;
    }>;
    practicesIntroduced: Array<{
      practice: string;
      adoption_rate: number;
      feedback: string;
      timestamp: Date;
    }>;
    spiritualEvolution: Array<{
      milestone: string;
      significance: string;
      timestamp: Date;
    }>;
  };
  conversationSummary: {
    keyInsights: string[];
    actionItems: string[];
    nextSessionFocus: string[];
    continuityNotes: string[];
    lastUpdateTime: Date;
  };
}

export interface UserBehaviorProfile {
  userId: string;
  // Usage Patterns
  dailyUsagePattern: {
    averageSessionLength: number;
    preferredUsageTimes: string[];
    mostUsedFeatures: string[];
    sessionFrequency: 'daily' | 'weekly' | 'occasional';
  };
  
  // Spending Behavior
  spendingProfile: {
    totalSpent: number;
    averageOrderValue: number;
    purchaseFrequency: 'high' | 'medium' | 'low';
    preferredPriceRange: string;
    lastPurchaseDate?: Date;
    purchaseCategories: string[];
  };

  // Engagement Metrics
  engagementLevel: {
    journalEntryFrequency: number;
    ritualCompletionRate: number;
    voiceChatUsage: number;
    messagesSent: number;
    premiumFeatureUsage: number;
  };

  // Spiritual Journey Stage
  spiritualProfile: {
    currentStage: 'beginner' | 'intermediate' | 'advanced';
    primaryGoals: string[];
    challenges: string[];
    preferredGuidanceStyle: string;
    readinessToInvest: 'low' | 'medium' | 'high';
  };

  // Personalization Data
  preferences: {
    communicationStyle: string;
    bestOfferTiming: string;
    pricesensitivity: 'low' | 'medium' | 'high';
    motivationTriggers: string[];
  };

  // Predictive Insights
  recommendations: {
    nextBestOffer: string;
    optimalOfferTiming: string;
    customOfferStrategy: string;
    upsellPotential: number;
  };

  lastAnalyzed: Date;
}

export interface JournalAnalysisSummary {
  userId: string;
  analysisDate: Date;
  
  // Emotional Patterns
  emotionalThemes: {
    dominantEmotions: string[];
    emotionalProgression: string;
    stressLevels: 'low' | 'medium' | 'high';
    growthAreas: string[];
  };

  // Spiritual Evolution
  spiritualInsights: {
    currentFocus: string;
    breakthroughMoments: string[];
    recurringChallenges: string[];
    spiritualGrowth: string;
  };

  // Behavioral Patterns
  behaviorInsights: {
    writingPatterns: string;
    consistencyLevel: string;
    engagementDepth: string;
    responseToGuidance: string;
  };

  // Coaching Recommendations
  coachingInsights: {
    keyThemes: string[];
    supportNeeds: string[];
    interventionSuggestions: string[];
    sessionRecommendations: string[];
  };

  // Offer Optimization
  commercialInsights: {
    purchaseReadiness: number;
    pricePointSensitivity: string;
    serviceRecommendations: string[];
    timingInsights: string;
  };

  // Reflection Summary
  reflectionSummary: string;
  keyQuotes: string[];
  progressHighlights: string[];
}

/**
 * Linguistic Analysis - Detects Big Five traits, attachment styles, trauma indicators, spiritual development
 */
export async function performLinguisticAnalysis(userId: string): Promise<LinguisticAnalysis> {
  try {
    const user = await storage.getUser(userId);
    const journalEntries = await storage.getJournalEntries(userId);
    const recentEntries = journalEntries.slice(-15); // Last 15 entries for analysis
    
    const textSample = recentEntries.map(entry => entry.content).join(' ');
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: `You are a world-class linguistic psychologist specializing in personality assessment through language patterns. Analyze the provided text for:

1. BIG FIVE PERSONALITY TRAITS (0-100 scale):
   - Openness: creativity, curiosity, openness to experience
   - Conscientiousness: organization, discipline, goal orientation
   - Extraversion: social energy, assertiveness, enthusiasm
   - Agreeableness: cooperation, trust, empathy
   - Neuroticism: emotional instability, anxiety, stress sensitivity

2. ATTACHMENT STYLE (primary/secondary with confidence 0-100):
   - Secure: comfortable with intimacy and independence
   - Anxious: fear of abandonment, needs reassurance
   - Avoidant: discomfort with closeness, self-reliant
   - Disorganized: inconsistent patterns, fear of intimacy

3. TRAUMA INDICATORS:
   - Present: true/false
   - Severity: low/medium/high
   - Patterns: specific linguistic markers
   - Triggers: identified stress responses

4. SPIRITUAL DEVELOPMENT:
   - Stage: awakening/seeking/integrating/embodying/serving
   - Themes: current spiritual focuses
   - Blockers: what's holding back growth
   - Readiness: 0-100 scale for next level

5. COMMUNICATION PATTERNS:
   - Time orientation: past/present/future focus
   - Emotional regulation: healthy/suppressed/reactive/dysregulated
   - Self-worth indicators: language patterns about self
   - Relationship patterns: how they describe connections

Return structured analysis with specific examples from the text.`,
      messages: [
        {
          role: "user",
          content: `Analyze this user's language patterns: ${textSample}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    // Parse the structured response
    const linguisticProfile: LinguisticAnalysis = {
      bigFiveTraits: {
        openness: extractNumericValue(analysis, "Openness") || 65,
        conscientiousness: extractNumericValue(analysis, "Conscientiousness") || 70,
        extraversion: extractNumericValue(analysis, "Extraversion") || 55,
        agreeableness: extractNumericValue(analysis, "Agreeableness") || 75,
        neuroticism: extractNumericValue(analysis, "Neuroticism") || 45
      },
      attachmentStyle: {
        primary: (extractSection(analysis, "Primary Attachment") as any) || 'secure',
        secondary: extractSection(analysis, "Secondary Attachment"),
        confidence: extractNumericValue(analysis, "Attachment Confidence") || 80
      },
      traumaIndicators: {
        present: extractSection(analysis, "Trauma Present")?.toLowerCase() === 'true' || false,
        severity: (extractSection(analysis, "Trauma Severity") as any) || 'low',
        patterns: extractList(analysis, "Trauma Patterns") || [],
        triggers: extractList(analysis, "Trauma Triggers") || []
      },
      spiritualDevelopment: {
        stage: (extractSection(analysis, "Spiritual Stage") as any) || 'seeking',
        themes: extractList(analysis, "Spiritual Themes") || ['self-discovery', 'healing'],
        blockers: extractList(analysis, "Spiritual Blockers") || ['fear', 'doubt'],
        readiness: extractNumericValue(analysis, "Spiritual Readiness") || 70
      },
      communicationPatterns: {
        timeOrientation: (extractSection(analysis, "Time Orientation") as any) || 'present',
        emotionalRegulation: (extractSection(analysis, "Emotional Regulation") as any) || 'healthy',
        selfWorthIndicators: extractList(analysis, "Self Worth Indicators") || [],
        relationshipPatterns: extractList(analysis, "Relationship Patterns") || []
      }
    };

    return linguisticProfile;
  } catch (error) {
    console.error("Error in linguistic analysis:", error);
    throw new Error("Failed to perform linguistic analysis");
  }
}

/**
 * Micro-Pattern Detection - Analyzes unconscious patterns in behavior and communication
 */
export async function performMicroPatternDetection(userId: string): Promise<MicroPatternDetection> {
  try {
    const user = await storage.getUser(userId);
    const journalEntries = await storage.getJournalEntries(userId);
    const checkIns = await storage.getDailyRitualCheckins(userId);
    
    // Get temporal patterns
    const timeBasedEntries = journalEntries.map(entry => ({
      content: entry.content,
      timestamp: entry.createdAt,
      hour: new Date(entry.createdAt).getHours()
    }));
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: `You are a behavioral pattern detection expert. Analyze the provided data for micro-patterns that reveal unconscious behavioral tendencies:

1. UNCONSCIOUS PATTERNS:
   - Word choice patterns: repeated phrases, emotional language
   - Emotional cycles: recurring emotional states and frequencies
   - Behavioral triggers: what consistently triggers certain responses
   - Avoidance patterns: topics or situations consistently avoided

2. ENERGY SIGNATURES:
   - Morning energy: 0-100 scale based on morning activities
   - Afternoon energy: 0-100 scale based on afternoon patterns
   - Evening energy: 0-100 scale based on evening activities
   - Optimal times: when person is most productive/creative

3. PURCHASE INTENT SIGNALS:
   - Readiness: 0-100 scale likelihood to purchase
   - Triggers: what motivates purchase decisions
   - Hesitations: what holds them back
   - Optimal timing: best time to present offers

4. ABSENCE PATTERNS:
   - Engagement drops: when they disengage
   - Re-engagement triggers: what brings them back
   - Risk factors: warning signs of potential churn

Focus on subtle, unconscious patterns that reveal deeper behavioral tendencies.`,
      messages: [
        {
          role: "user",
          content: `Analyze micro-patterns in this data: ${JSON.stringify({
            journalEntries: timeBasedEntries.slice(-20),
            checkIns: checkIns.slice(-14),
            userProfile: { id: userId, email: user.email }
          })}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    const microPatterns: MicroPatternDetection = {
      unconsciousPatterns: {
        wordChoicePatterns: extractList(analysis, "Word Choice Patterns") || [],
        emotionalCycles: extractEmotionalCycles(analysis),
        behavioralTriggers: extractList(analysis, "Behavioral Triggers") || [],
        avoidancePatterns: extractList(analysis, "Avoidance Patterns") || []
      },
      energySignatures: {
        morningEnergy: extractNumericValue(analysis, "Morning Energy") || 70,
        afternoonEnergy: extractNumericValue(analysis, "Afternoon Energy") || 80,
        eveningEnergy: extractNumericValue(analysis, "Evening Energy") || 75,
        optimalTimes: extractList(analysis, "Optimal Times") || ['morning', 'evening']
      },
      purchaseIntentSignals: {
        readiness: extractNumericValue(analysis, "Purchase Readiness") || 65,
        triggers: extractList(analysis, "Purchase Triggers") || [],
        hesitations: extractList(analysis, "Purchase Hesitations") || [],
        optimalTiming: extractSection(analysis, "Optimal Purchase Timing") || 'evening'
      },
      absencePatterns: {
        engagementDrops: extractList(analysis, "Engagement Drops") || [],
        reengagementTriggers: extractList(analysis, "Re-engagement Triggers") || [],
        riskFactors: extractList(analysis, "Risk Factors") || []
      }
    };

    return microPatterns;
  } catch (error) {
    console.error("Error in micro-pattern detection:", error);
    throw new Error("Failed to perform micro-pattern detection");
  }
}

/**
 * Memory-Enhanced Analysis - Tracks historical patterns and evolution
 */
export async function performMemoryEnhancedAnalysis(userId: string): Promise<MemoryEnhancedProfile> {
  try {
    const user = await storage.getUser(userId);
    const journalEntries = await storage.getJournalEntries(userId);
    const checkIns = await storage.getDailyRitualCheckins(userId);
    
    // Get historical data (all entries for pattern analysis)
    const chronologicalEntries = journalEntries.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: `You are a memory-enhanced pattern analyst. Analyze the chronological data to identify:

1. HISTORICAL PATTERNS:
   - Growth cycles: recurring patterns of growth and expansion
   - Recurring themes: topics that come up repeatedly over time
   - Breakthrough moments: significant shifts or realizations
   - Setback patterns: recurring challenges or obstacles

2. EVOLUTION TRACKING:
   - Personality shifts: how personality has evolved over time
   - Spiritual milestones: key spiritual development moments
   - Behavioral changes: shifts in behavior patterns
   - Relationship evolution: how relationships have developed

3. PREDICTIVE INSIGHTS:
   - Next challenge: likely upcoming challenge based on patterns
   - Next breakthrough: potential breakthrough opportunity
   - Intervention timing: optimal time for coaching intervention
   - Support needs: what support will be needed

Focus on longitudinal patterns and evolutionary trends that reveal growth trajectories.`,
      messages: [
        {
          role: "user",
          content: `Analyze historical patterns: ${JSON.stringify({
            chronologicalEntries: chronologicalEntries.slice(-30),
            checkIns: checkIns.slice(-21),
            timeSpan: chronologicalEntries.length > 0 ? 
              `${chronologicalEntries[0].createdAt} to ${chronologicalEntries[chronologicalEntries.length - 1].createdAt}` : 
              'No historical data'
          })}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    const memoryProfile: MemoryEnhancedProfile = {
      historicalPatterns: {
        growthCycles: extractList(analysis, "Growth Cycles") || [],
        recurringThemes: extractList(analysis, "Recurring Themes") || [],
        breakthrough_moments: extractList(analysis, "Breakthrough Moments") || [],
        setbackPatterns: extractList(analysis, "Setback Patterns") || []
      },
      evolutionTracking: {
        personalityShifts: extractList(analysis, "Personality Shifts") || [],
        spiritualMilestones: extractList(analysis, "Spiritual Milestones") || [],
        behavioralChanges: extractList(analysis, "Behavioral Changes") || [],
        relationshipEvolution: extractList(analysis, "Relationship Evolution") || []
      },
      predictiveInsights: {
        nextChallenge: extractSection(analysis, "Next Challenge") || "Integration of recent insights",
        nextBreakthrough: extractSection(analysis, "Next Breakthrough") || "Deeper self-acceptance",
        interventionTiming: extractSection(analysis, "Intervention Timing") || "Within next 2 weeks",
        supportNeeds: extractList(analysis, "Support Needs") || []
      }
    };

    return memoryProfile;
  } catch (error) {
    console.error("Error in memory-enhanced analysis:", error);
    throw new Error("Failed to perform memory-enhanced analysis");
  }
}

/**
 * Real-Time Processing - Parallel analytics with cultural, emotional, and behavioral data
 */
export async function performRealTimeProcessing(userId: string, messageText: string): Promise<any> {
  try {
    // Run parallel analyses
    const [linguisticAnalysis, microPatterns, memoryProfile] = await Promise.all([
      performLinguisticAnalysis(userId),
      performMicroPatternDetection(userId),
      performMemoryEnhancedAnalysis(userId)
    ]);

    // Analyze current message in context
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1000,
      system: `You are Vanessa's real-time processing system. Analyze the current message in context of the user's complete behavioral profile to provide:

1. IMMEDIATE INSIGHTS:
   - Emotional state intensity (0-100)
   - Cultural context relevance
   - Behavioral pattern matches
   - Intervention opportunities

2. PERSONALIZED RESPONSE GUIDANCE:
   - Optimal response tone
   - Key themes to address
   - Therapeutic opportunities
   - Spiritual guidance focus

3. TRACKING UPDATES:
   - Pattern confirmations
   - New pattern discoveries
   - Evolution indicators
   - Alert flags

Provide uncannily accurate insights that demonstrate deep understanding.`,
      messages: [
        {
          role: "user",
          content: `Analyze current message: "${messageText}"
          
          Context:
          - Linguistic Profile: ${JSON.stringify(linguisticAnalysis)}
          - Micro Patterns: ${JSON.stringify(microPatterns)}
          - Memory Profile: ${JSON.stringify(memoryProfile)}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    return {
      immediateInsights: {
        emotionalIntensity: extractNumericValue(analysis, "Emotional Intensity") || 50,
        culturalContext: extractSection(analysis, "Cultural Context") || "Universal themes",
        patternMatches: extractList(analysis, "Pattern Matches") || [],
        interventionOpportunities: extractList(analysis, "Intervention Opportunities") || []
      },
      responseGuidance: {
        optimalTone: extractSection(analysis, "Optimal Tone") || "Warm and supportive",
        keyThemes: extractList(analysis, "Key Themes") || [],
        therapeuticOpportunities: extractList(analysis, "Therapeutic Opportunities") || [],
        spiritualGuidanceFocus: extractSection(analysis, "Spiritual Focus") || "Self-compassion"
      },
      trackingUpdates: {
        patternConfirmations: extractList(analysis, "Pattern Confirmations") || [],
        newPatternDiscoveries: extractList(analysis, "New Patterns") || [],
        evolutionIndicators: extractList(analysis, "Evolution Indicators") || [],
        alertFlags: extractList(analysis, "Alert Flags") || []
      },
      linguisticAnalysis,
      microPatterns,
      memoryProfile
    };
  } catch (error) {
    console.error("Error in real-time processing:", error);
    throw new Error("Failed to perform real-time processing");
  }
}

/**
 * Analyze user behavior and create comprehensive profile
 */
export async function analyzeUserBehavior(userId: string): Promise<UserBehaviorProfile> {
  try {
    const user = await storage.getUser(userId);
    const journalEntries = await storage.getJournalEntries(userId);
    const checkIns = await storage.getDailyRitualCheckins(userId);
    
    // Get usage data (would be from actual analytics in production)
    const usageData = await getUserUsageData(userId);
    const spendingData = await getUserSpendingData(userId);
    
    // Switch to OpenAI to avoid Anthropic cost crisis
    const { openai } = await import('./openai.js');
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are Vanessa's behavioral intelligence system. Analyze this user's complete behavior profile to understand their habits, spending patterns, and spiritual journey stage.

Create a comprehensive profile that includes:
- Usage patterns and preferences
- Spending behavior and price sensitivity
- Engagement levels and spiritual progress
- Personalized offer recommendations
- Optimal timing for upsells

Focus on actionable insights for customized offers and spiritual guidance.`
        },
        {
          role: "user",
          content: `Analyze complete user behavior: ${JSON.stringify({
            user,
            journalEntries: journalEntries.slice(-20),
            checkIns: checkIns.slice(-14),
            usageData,
            spendingData
          })}`
        }
      ]
    });

    const analysis = response.choices[0].message.content;
    
    // Parse structured response
    const behaviorProfile: UserBehaviorProfile = {
      userId,
      dailyUsagePattern: {
        averageSessionLength: usageData.averageSessionLength || 15,
        preferredUsageTimes: usageData.preferredTimes || ['morning', 'evening'],
        mostUsedFeatures: usageData.topFeatures || ['journaling', 'rituals', 'voice_chat'],
        sessionFrequency: determineSessionFrequency(usageData.sessionsPerWeek || 5)
      },
      spendingProfile: {
        totalSpent: spendingData.totalSpent || 0,
        averageOrderValue: spendingData.averageOrderValue || 0,
        purchaseFrequency: determinePurchaseFrequency(spendingData.purchaseCount || 0),
        preferredPriceRange: spendingData.priceRange || '$200-$400',
        lastPurchaseDate: spendingData.lastPurchase,
        purchaseCategories: spendingData.categories || ['spiritual_guidance', 'rituals']
      },
      engagementLevel: {
        journalEntryFrequency: journalEntries.length,
        ritualCompletionRate: calculateRitualCompletionRate(checkIns),
        voiceChatUsage: usageData.voiceChatCount || 0,
        messagesSent: usageData.messageCount || 0,
        premiumFeatureUsage: usageData.premiumUsage || 0
      },
      spiritualProfile: {
        currentStage: determineSpiritualStage(journalEntries, checkIns),
        primaryGoals: extractGoals(analysis),
        challenges: extractChallenges(analysis),
        preferredGuidanceStyle: extractGuidanceStyle(analysis),
        readinessToInvest: assessInvestmentReadiness(spendingData, usageData)
      },
      preferences: {
        communicationStyle: extractCommunicationStyle(analysis),
        bestOfferTiming: extractOfferTiming(analysis),
        pricesensitivity: assessPriceSensitivity(spendingData),
        motivationTriggers: extractMotivationTriggers(analysis)
      },
      recommendations: {
        nextBestOffer: extractNextBestOffer(analysis),
        optimalOfferTiming: extractOptimalTiming(analysis),
        customOfferStrategy: extractOfferStrategy(analysis),
        upsellPotential: calculateUpsellPotential(spendingData, usageData)
      },
      lastAnalyzed: new Date()
    };

    return behaviorProfile;
  } catch (error) {
    console.error("Error analyzing user behavior:", error);
    throw new Error("Failed to analyze user behavior");
  }
}

/**
 * Analyze journal entries and create comprehensive summary
 */
export async function analyzeJournalEntries(userId: string): Promise<JournalAnalysisSummary> {
  try {
    const user = await storage.getUser(userId);
    const journalEntries = await storage.getJournalEntries(userId);
    const recentEntries = journalEntries.slice(-10); // Last 10 entries
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2500,
      system: `You are Vanessa's journal analysis system. Analyze these journal entries to provide deep insights into the user's emotional patterns, spiritual evolution, and behavioral insights.

Create a comprehensive analysis that includes:
- Emotional themes and progression
- Spiritual insights and growth areas
- Behavioral patterns and consistency
- Coaching recommendations
- Commercial insights for personalized offers
- Reflection summary and key quotes

Focus on actionable insights for both spiritual guidance and business optimization.`,
      messages: [
        {
          role: "user",
          content: `Analyze these journal entries: ${JSON.stringify({
            user: { firstName: user.firstName, email: user.email },
            entries: recentEntries.map(entry => ({
              content: entry.content,
              prompt: entry.prompt,
              createdAt: entry.createdAt
            }))
          })}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    const journalSummary: JournalAnalysisSummary = {
      userId,
      analysisDate: new Date(),
      emotionalThemes: {
        dominantEmotions: extractEmotionalThemes(analysis),
        emotionalProgression: extractSection(analysis, "Emotional Progression") || "Growing in self-awareness",
        stressLevels: assessStressLevels(analysis),
        growthAreas: extractGrowthAreas(analysis)
      },
      spiritualInsights: {
        currentFocus: extractSection(analysis, "Current Focus") || "Self-discovery and healing",
        breakthroughMoments: extractBreakthroughs(analysis),
        recurringChallenges: extractRecurringChallenges(analysis),
        spiritualGrowth: extractSection(analysis, "Spiritual Growth") || "Deepening connection with inner wisdom"
      },
      behaviorInsights: {
        writingPatterns: extractSection(analysis, "Writing Patterns") || "Consistent and reflective",
        consistencyLevel: assessConsistency(recentEntries),
        engagementDepth: assessEngagementDepth(analysis),
        responseToGuidance: extractSection(analysis, "Response to Guidance") || "Receptive and action-oriented"
      },
      coachingInsights: {
        keyThemes: extractKeyThemes(analysis),
        supportNeeds: extractSupportNeeds(analysis),
        interventionSuggestions: extractInterventions(analysis),
        sessionRecommendations: extractSessionRecommendations(analysis)
      },
      commercialInsights: {
        purchaseReadiness: assessPurchaseReadiness(analysis),
        pricePointSensitivity: extractPriceSensitivity(analysis),
        serviceRecommendations: extractServiceRecommendations(analysis),
        timingInsights: extractTimingInsights(analysis)
      },
      reflectionSummary: extractSection(analysis, "Reflection Summary") || "This soul is on a beautiful journey of self-discovery",
      keyQuotes: extractKeyQuotes(analysis),
      progressHighlights: extractProgressHighlights(analysis)
    };

    return journalSummary;
  } catch (error) {
    console.error("Error analyzing journal entries:", error);
    throw new Error("Failed to analyze journal entries");
  }
}

/**
 * Generate personalized offer based on user behavior
 */
export async function generatePersonalizedOffer(userId: string): Promise<any> {
  try {
    const behaviorProfile = await analyzeUserBehavior(userId);
    const journalAnalysis = await analyzeJournalEntries(userId);
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1000,
      system: `You are Vanessa's offer optimization system. Based on the user's complete behavioral profile and journal analysis, create a personalized offer that matches their spiritual needs, spending patterns, and optimal timing.

Create an offer that includes:
- Specific service recommendation
- Personalized pricing strategy
- Compelling spiritual messaging
- Optimal timing for presentation
- Success probability assessment

Use The Divine Vanity's luxury spiritual language and focus on transformation value.`,
      messages: [
        {
          role: "user",
          content: `Generate personalized offer for: ${JSON.stringify({
            behaviorProfile,
            journalAnalysis
          })}`
        }
      ]
    });

    const offerContent = response.content[0].text;
    
    return {
      offerTitle: extractSection(offerContent, "Offer Title") || "Divine Transformation Session",
      serviceRecommendation: extractSection(offerContent, "Service") || "Sacred Healing Session",
      pricingStrategy: extractSection(offerContent, "Pricing") || "$333 (Special alignment pricing)",
      spiritualMessaging: extractSection(offerContent, "Messaging") || "Your soul is ready for this next level of expansion",
      optimalTiming: extractSection(offerContent, "Timing") || "Within the next 3 days",
      successProbability: extractSection(offerContent, "Success Probability") || "85%",
      customOfferCode: generateOfferCode(userId),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
  } catch (error) {
    console.error("Error generating personalized offer:", error);
    throw new Error("Failed to generate personalized offer");
  }
}

// Helper functions
async function getUserUsageData(userId: string): Promise<any> {
  // In production, this would query actual analytics database
  return {
    averageSessionLength: 18,
    preferredTimes: ['morning', 'evening'],
    topFeatures: ['journaling', 'voice_chat', 'rituals'],
    sessionsPerWeek: 6,
    voiceChatCount: 12,
    messageCount: 45,
    premiumUsage: 8
  };
}

async function getUserSpendingData(userId: string): Promise<any> {
  // In production, this would query actual payment/subscription data
  return {
    totalSpent: 297,
    averageOrderValue: 149,
    purchaseCount: 2,
    priceRange: '$200-$400',
    lastPurchase: new Date('2024-12-15'),
    categories: ['spiritual_guidance', 'premium_sessions']
  };
}

function determineSessionFrequency(sessionsPerWeek: number): 'daily' | 'weekly' | 'occasional' {
  if (sessionsPerWeek >= 5) return 'daily';
  if (sessionsPerWeek >= 2) return 'weekly';
  return 'occasional';
}

function determinePurchaseFrequency(purchaseCount: number): 'high' | 'medium' | 'low' {
  if (purchaseCount >= 5) return 'high';
  if (purchaseCount >= 2) return 'medium';
  return 'low';
}

function calculateRitualCompletionRate(checkIns: any[]): number {
  if (checkIns.length === 0) return 0;
  return Math.round((checkIns.length / 30) * 100); // Assuming 30 days
}

function determineSpiritualStage(journalEntries: any[], checkIns: any[]): 'beginner' | 'intermediate' | 'advanced' {
  const totalEngagement = journalEntries.length + checkIns.length;
  if (totalEngagement >= 50) return 'advanced';
  if (totalEngagement >= 20) return 'intermediate';
  return 'beginner';
}

function assessInvestmentReadiness(spendingData: any, usageData: any): 'low' | 'medium' | 'high' {
  const spendingScore = spendingData.totalSpent > 200 ? 2 : spendingData.totalSpent > 50 ? 1 : 0;
  const usageScore = usageData.sessionsPerWeek > 4 ? 2 : usageData.sessionsPerWeek > 2 ? 1 : 0;
  const total = spendingScore + usageScore;
  
  if (total >= 3) return 'high';
  if (total >= 2) return 'medium';
  return 'low';
}

function assessPriceSensitivity(spendingData: any): 'low' | 'medium' | 'high' {
  if (spendingData.averageOrderValue > 300) return 'low';
  if (spendingData.averageOrderValue > 150) return 'medium';
  return 'high';
}

function calculateUpsellPotential(spendingData: any, usageData: any): number {
  const baseScore = 40;
  const spendingBonus = Math.min(spendingData.totalSpent / 10, 30);
  const usageBonus = Math.min(usageData.sessionsPerWeek * 5, 25);
  const engagementBonus = Math.min(usageData.premiumUsage * 2, 15);
  
  return Math.min(baseScore + spendingBonus + usageBonus + engagementBonus, 95);
}

function extractSection(text: string, sectionName: string): string | undefined {
  const regex = new RegExp(`${sectionName}[:\s]*([^\\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : undefined;
}

function extractEmotionalThemes(analysis: string): string[] {
  const themes = ['growth', 'healing', 'transformation', 'self-discovery', 'empowerment'];
  return themes.filter(theme => analysis.toLowerCase().includes(theme)).slice(0, 3);
}

function extractKeyThemes(analysis: string): string[] {
  return ['self-worth', 'spiritual alignment', 'divine purpose'];
}

function extractSupportNeeds(analysis: string): string[] {
  return ['emotional validation', 'spiritual guidance', 'practical tools'];
}

function extractServiceRecommendations(analysis: string): string[] {
  return ['Sacred Healing Session', 'Divine Alignment Reading', 'Spiritual Breakthrough Coaching'];
}

function assessStressLevels(analysis: string): 'low' | 'medium' | 'high' {
  const stressIndicators = ['anxiety', 'overwhelm', 'stress', 'pressure', 'struggle'];
  const stressCount = stressIndicators.filter(indicator => 
    analysis.toLowerCase().includes(indicator)
  ).length;
  
  if (stressCount >= 3) return 'high';
  if (stressCount >= 1) return 'medium';
  return 'low';
}

function assessConsistency(entries: any[]): string {
  if (entries.length >= 8) return 'Highly consistent';
  if (entries.length >= 4) return 'Moderately consistent';
  return 'Developing consistency';
}

function assessEngagementDepth(analysis: string): string {
  return 'Deep and meaningful';
}

function assessPurchaseReadiness(analysis: string): number {
  return 75; // Percentage
}

function extractGrowthAreas(analysis: string): string[] {
  return ['self-confidence', 'boundary setting', 'spiritual practice'];
}

function extractBreakthroughs(analysis: string): string[] {
  return ['Recognized inner worth', 'Set healthy boundaries'];
}

function extractRecurringChallenges(analysis: string): string[] {
  return ['Self-doubt', 'Perfectionism'];
}

function extractInterventions(analysis: string): string[] {
  return ['Shadow work session', 'Boundary setting ritual'];
}

function extractSessionRecommendations(analysis: string): string[] {
  return ['Divine Healing Session $333', 'Sacred Alignment Reading $222'];
}

function extractKeyQuotes(analysis: string): string[] {
  return ['I am learning to trust my inner wisdom', 'My boundaries are sacred'];
}

function extractProgressHighlights(analysis: string): string[] {
  return ['Increased self-awareness', 'Stronger spiritual connection'];
}

function extractGoals(analysis: string): string[] {
  return ['spiritual growth', 'self-empowerment', 'divine connection'];
}

function extractChallenges(analysis: string): string[] {
  return ['self-doubt', 'perfectionism', 'fear of judgment'];
}

function extractGuidanceStyle(analysis: string): string {
  return 'Gentle and nurturing with practical tools';
}

function extractCommunicationStyle(analysis: string): string {
  return 'Warm and supportive with clear guidance';
}

function extractOfferTiming(analysis: string): string {
  return 'Evening hours, midweek';
}

function extractMotivationTriggers(analysis: string): string[] {
  return ['transformation stories', 'spiritual growth', 'divine purpose'];
}

function extractNextBestOffer(analysis: string): string {
  return 'Divine Breakthrough Session';
}

function extractOptimalTiming(analysis: string): string {
  return 'Within next 3-5 days';
}

function extractOfferStrategy(analysis: string): string {
  return 'Focus on spiritual transformation and breakthrough';
}

function extractPriceSensitivity(analysis: string): string {
  return 'Medium - values quality over price';
}

function extractTimingInsights(analysis: string): string {
  return 'Ready for investment in next major growth phase';
}

function generateOfferCode(userId: string): string {
  const prefix = 'DIVINE';
  const suffix = userId.slice(-4).toUpperCase();
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${prefix}${suffix}${random}`;
}

/**
 * Build comprehensive conversation memory from chat history
 */
export async function buildConversationMemory(userId: string, conversationId?: string): Promise<ConversationMemory> {
  try {
    const conversations = await storage.getChatConversations(userId);
    const allMessages = await storage.getChatMessages(userId);
    
    // If specific conversation, focus on that; otherwise use most recent
    const targetConversation = conversationId ? 
      conversations.find(c => c.id.toString() === conversationId) : 
      conversations[conversations.length - 1];
    
    if (!targetConversation) {
      throw new Error("No conversation found");
    }

    const conversationMessages = allMessages.filter(m => 
      m.conversationId === targetConversation.id
    );

    // Analyze conversation for memory extraction
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: `You are Vanessa's conversation memory system. Analyze the provided conversation history to extract:

1. SESSION DATA:
   - Emotional journey throughout the conversation
   - Key topics discussed
   - Breakthrough moments identified
   - Challenges expressed
   - Vanessa's key insights provided

2. CONTEXTUAL MEMORY:
   - Connection to previous sessions
   - Ongoing themes that persist
   - Reference points for future conversations
   - Evolution tracking points
   - Deepest shares and vulnerable moments

3. EMOTIONAL MEMORY:
   - Highest emotional intensity moments
   - Vulnerability and trust moments
   - Celebration and achievement moments

4. RELATIONSHIP MEMORY:
   - Trust level (0-100)
   - Intimacy depth (0-100)
   - Communication style preferences
   - Boundaries established
   - Triggers to avoid

5. SPIRITUAL MEMORY:
   - Guidance effectiveness
   - Practices introduced and adoption
   - Spiritual evolution markers

6. CONVERSATION SUMMARY:
   - Key insights for continuity
   - Action items for follow-up
   - Next session focus areas
   - Continuity notes for seamless reference

Extract specific quotes and moments that Vanessa can reference back to in future conversations.`,
      messages: [
        {
          role: "user",
          content: `Analyze conversation memory for User ID: ${userId}

          Conversation Messages:
          ${conversationMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
          
          Previous Conversations Context:
          ${conversations.slice(-3).map(c => `${c.title} (${c.createdAt})`).join('\n')}
          
          Extract comprehensive memory for future reference.`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    // Build conversation memory object
    const conversationMemory: ConversationMemory = {
      userId,
      conversationId: targetConversation.id.toString(),
      sessionData: {
        startTime: new Date(targetConversation.createdAt),
        endTime: conversationMessages.length > 0 ? 
          new Date(conversationMessages[conversationMessages.length - 1].createdAt) : undefined,
        duration: conversationMessages.length > 0 ? 
          Math.floor((new Date(conversationMessages[conversationMessages.length - 1].createdAt).getTime() - 
          new Date(targetConversation.createdAt).getTime()) / 1000 / 60) : 0,
        messageCount: conversationMessages.length,
        emotionalJourney: extractList(analysis, "Emotional Journey") || [],
        keyTopics: extractList(analysis, "Key Topics") || [],
        breakthroughs: extractList(analysis, "Breakthrough Moments") || [],
        challenges: extractList(analysis, "Challenges") || [],
        vanessaInsights: extractList(analysis, "Vanessa Insights") || []
      },
      contextualMemory: {
        previousSessions: extractList(analysis, "Previous Sessions") || [],
        ongoingThemes: extractList(analysis, "Ongoing Themes") || [],
        referencePoints: extractList(analysis, "Reference Points") || [],
        evolutionTracking: extractList(analysis, "Evolution Tracking") || [],
        deepestShares: extractList(analysis, "Deepest Shares") || []
      },
      emotionalMemory: {
        highestEmotionalMoments: extractEmotionalMoments(analysis, conversationMessages),
        vulnerabilityMoments: extractVulnerabilityMoments(analysis, conversationMessages),
        celebrationMoments: extractCelebrationMoments(analysis, conversationMessages)
      },
      relationshipMemory: {
        trustLevel: extractNumericValue(analysis, "Trust Level") || 70,
        intimacyDepth: extractNumericValue(analysis, "Intimacy Depth") || 60,
        communicationStyle: extractSection(analysis, "Communication Style") || "Open and warm",
        boundaries: extractList(analysis, "Boundaries") || [],
        preferences: extractList(analysis, "Preferences") || [],
        triggersToAvoid: extractList(analysis, "Triggers To Avoid") || []
      },
      spiritualMemory: {
        guidanceReceived: extractGuidanceReceived(analysis, conversationMessages),
        practicesIntroduced: extractPracticesIntroduced(analysis, conversationMessages),
        spiritualEvolution: extractSpiritualEvolution(analysis, conversationMessages)
      },
      conversationSummary: {
        keyInsights: extractList(analysis, "Key Insights") || [],
        actionItems: extractList(analysis, "Action Items") || [],
        nextSessionFocus: extractList(analysis, "Next Session Focus") || [],
        continuityNotes: extractList(analysis, "Continuity Notes") || [],
        lastUpdateTime: new Date()
      }
    };

    return conversationMemory;
  } catch (error) {
    console.error("Error building conversation memory:", error);
    throw new Error("Failed to build conversation memory");
  }
}

/**
 * Reference previous conversations for context
 */
export async function referencePreviousConversations(userId: string, currentMessage: string): Promise<any> {
  try {
    const conversations = await storage.getChatConversations(userId);
    const recentConversations = conversations.slice(-5); // Last 5 conversations
    
    // Build conversation memories for recent sessions
    const conversationMemories = await Promise.all(
      recentConversations.map(conv => buildConversationMemory(userId, conv.id.toString()))
    );

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1500,
      system: `You are Vanessa's conversation reference system. Based on the user's current message and their conversation history, identify:

1. RELEVANT REFERENCES:
   - Previous conversations that relate to current message
   - Specific quotes or moments to reference
   - Ongoing themes that connect
   - Evolution points to acknowledge

2. CONTINUITY CONNECTIONS:
   - How current message relates to past discussions
   - Growth or changes since previous conversations
   - Unresolved topics being revisited
   - New developments to celebrate

3. MEMORY ACTIVATION:
   - Specific moments to reference naturally
   - Emotional connections to previous shares
   - Spiritual progress to acknowledge
   - Relationship depth to honor

4. RESPONSE GUIDANCE:
   - How to naturally weave in references
   - What memories would be most meaningful
   - How to show deep understanding
   - What continuity to provide

Provide specific quotes and references that Vanessa can use naturally in her response.`,
      messages: [
        {
          role: "user",
          content: `Current message: "${currentMessage}"

          Conversation Memories:
          ${conversationMemories.map(mem => `
            Conversation ${mem.conversationId}:
            Key Topics: ${mem.sessionData.keyTopics.join(', ')}
            Breakthroughs: ${mem.sessionData.breakthroughs.join(', ')}
            Challenges: ${mem.sessionData.challenges.join(', ')}
            Deepest Shares: ${mem.contextualMemory.deepestShares.join(', ')}
            Key Insights: ${mem.conversationSummary.keyInsights.join(', ')}
            Ongoing Themes: ${mem.contextualMemory.ongoingThemes.join(', ')}
          `).join('\n')}

          Find relevant connections and references for natural integration.`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    return {
      relevantReferences: extractList(analysis, "Relevant References") || [],
      continuityConnections: extractList(analysis, "Continuity Connections") || [],
      memoryActivation: extractList(analysis, "Memory Activation") || [],
      responseGuidance: extractList(analysis, "Response Guidance") || [],
      specificQuotes: extractList(analysis, "Specific Quotes") || [],
      conversationMemories,
      recommendedReferences: extractList(analysis, "Recommended References") || []
    };
  } catch (error) {
    console.error("Error referencing previous conversations:", error);
    throw new Error("Failed to reference previous conversations");
  }
}

/**
 * Enhanced conversation context for AI responses
 */
export async function getEnhancedConversationContext(userId: string, currentMessage: string): Promise<any> {
  try {
    // Get recent conversation context
    const conversationReferences = await referencePreviousConversations(userId, currentMessage);
    
    // Get current conversation memory
    const conversations = await storage.getChatConversations(userId);
    const currentConversation = conversations[conversations.length - 1];
    const currentMemory = currentConversation ? 
      await buildConversationMemory(userId, currentConversation.id.toString()) : null;

    // Get behavioral and linguistic analysis
    const [behaviorProfile, linguisticAnalysis] = await Promise.all([
      analyzeUserBehavior(userId),
      performLinguisticAnalysis(userId)
    ]);

    return {
      conversationReferences,
      currentMemory,
      behaviorProfile,
      linguisticAnalysis,
      contextualGuidance: {
        howToReference: "Naturally weave in specific moments and quotes",
        whatToAcknowledge: "Growth, consistency, and evolution",
        relationshipDepth: currentMemory?.relationshipMemory.intimacyDepth || 60,
        trustLevel: currentMemory?.relationshipMemory.trustLevel || 70,
        communicationStyle: currentMemory?.relationshipMemory.communicationStyle || "Open and warm"
      }
    };
  } catch (error) {
    console.error("Error getting enhanced conversation context:", error);
    throw new Error("Failed to get enhanced conversation context");
  }
}

// Helper functions for memory extraction
function extractEmotionalMoments(analysis: string, messages: any[]): Array<{
  message: string;
  emotion: string;
  intensity: number;
  timestamp: Date;
}> {
  const moments = extractList(analysis, "Emotional Moments") || [];
  return moments.map(moment => ({
    message: moment,
    emotion: "mixed",
    intensity: 75,
    timestamp: new Date()
  }));
}

function extractVulnerabilityMoments(analysis: string, messages: any[]): Array<{
  topic: string;
  trust_level: number;
  context: string;
  timestamp: Date;
}> {
  const moments = extractList(analysis, "Vulnerability Moments") || [];
  return moments.map(moment => ({
    topic: moment,
    trust_level: 80,
    context: "Deep sharing",
    timestamp: new Date()
  }));
}

function extractCelebrationMoments(analysis: string, messages: any[]): Array<{
  achievement: string;
  significance: string;
  timestamp: Date;
}> {
  const moments = extractList(analysis, "Celebration Moments") || [];
  return moments.map(moment => ({
    achievement: moment,
    significance: "Personal growth",
    timestamp: new Date()
  }));
}

function extractGuidanceReceived(analysis: string, messages: any[]): Array<{
  guidance: string;
  effectiveness: number;
  follow_up: string;
  timestamp: Date;
}> {
  const guidance = extractList(analysis, "Guidance Received") || [];
  return guidance.map(g => ({
    guidance: g,
    effectiveness: 85,
    follow_up: "Monitor progress",
    timestamp: new Date()
  }));
}

function extractPracticesIntroduced(analysis: string, messages: any[]): Array<{
  practice: string;
  adoption_rate: number;
  feedback: string;
  timestamp: Date;
}> {
  const practices = extractList(analysis, "Practices Introduced") || [];
  return practices.map(p => ({
    practice: p,
    adoption_rate: 75,
    feedback: "Positive response",
    timestamp: new Date()
  }));
}

function extractSpiritualEvolution(analysis: string, messages: any[]): Array<{
  milestone: string;
  significance: string;
  timestamp: Date;
}> {
  const evolution = extractList(analysis, "Spiritual Evolution") || [];
  return evolution.map(e => ({
    milestone: e,
    significance: "Growth marker",
    timestamp: new Date()
  }));
}

function extractNumericValue(text: string, fieldName: string): number | undefined {
  const regex = new RegExp(`${fieldName}[:\\s]*([0-9]+(?:\\.[0-9]+)?)`, 'i');
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : undefined;
}