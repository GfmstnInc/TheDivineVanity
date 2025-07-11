/**
 * Budget-Aware Reflective Purchasing System for Vanessa DI
 * Ethical guidance engine that promotes conscious consumption over exploitation
 * Integrated with system-wide ethical defaults for compassionate AI behavior
 */

import { ethicalDefaults, type EthicalResponse } from './ethicalDefaults';

export interface PurchasePattern {
  userId: string;
  purchases: PurchaseRecord[];
  reflectionActivities: ReflectionActivity[];
  monthlyBudget?: number;
  emotionalTriggers: EmotionalTrigger[];
  lastEthicalCheckIn: Date;
  purchaseToReflectionRatio: number;
  currentSpendingStreakDays: number;
  totalMonthlySpent: number;
  escalationHistory: EscalationEvent[];
  analyticsFlags: {
    spendingSpikeDetected: boolean;
    reflectionDeficit: boolean;
    emotionalVulnerability: boolean;
    patternConcern: boolean;
    lastFlagUpdate: Date;
  };
}

export interface EscalationEvent {
  id: string;
  userId: string;
  level: 'soft_check' | 'firm_nudge' | 'override_protection';
  trigger: string;
  timestamp: Date;
  userResponse: 'proceeded' | 'paused' | 'reflected' | 'ignored';
  outcome: string;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'session' | 'ritual' | 'membership' | 'report' | 'product';
  purchaseDate: Date;
  emotionalContext?: string;
  triggerEvent?: string; // e.g., 'argument', 'grief', 'anxiety'
  discountApplied?: boolean;
  postPurchaseReflection?: boolean;
}

export interface ReflectionActivity {
  id: string;
  userId: string;
  type: 'journal' | 'check_in' | 'assessment' | 'meditation' | 'integration';
  activityDate: Date;
  relatedPurchase?: string;
  depth: 'surface' | 'moderate' | 'deep';
  completionQuality: number; // 1-10
}

export interface EmotionalTrigger {
  event: string;
  frequency: number;
  lastOccurrence: Date;
  purchasesFollowing: number;
  pattern: 'healthy' | 'concerning' | 'critical';
}

export interface EthicalGuidanceResponse {
  shouldProceed: boolean;
  guidanceType: 'proceed' | 'pause' | 'reflect' | 'redirect';
  escalationLevel: 'soft_check' | 'firm_nudge' | 'override_protection';
  message: string;
  recommendedActions: string[];
  budgetImpact?: {
    currentSpent: number;
    budgetRemaining: number;
    percentageUsed: number;
  };
  reflectionPrompt?: string;
  alternativeSuggestions?: string[];
  dataFlags: {
    spendingSpike: boolean;
    lowReflection: boolean;
    emotionalTrigger: boolean;
    repeatBehavior: boolean;
    escalationTriggered: boolean;
  };
  ritualRecommendation?: {
    type: 'breathing' | 'journaling' | 'meditation' | 'grounding';
    duration: number; // minutes
    description: string;
  };
  ethicalDefaults: EthicalResponse;
  timingIntelligence?: {
    riskTime: boolean;
    suggestedDelay: number; // hours
    optimalTime: string;
  };
  spiritualAlternatives?: {
    freeOptions: string[];
    innerResourceReminders: string[];
    growthConnection: string;
  };
}

export class BudgetAwareReflectiveSystem {
  private static instance: BudgetAwareReflectiveSystem;

  static getInstance(): BudgetAwareReflectiveSystem {
    if (!this.instance) {
      this.instance = new BudgetAwareReflectiveSystem();
    }
    return this.instance;
  }

  /**
   * Analyze user's purchase pattern and provide ethical guidance
   */
  async analyzeAndGuide(
    userId: string, 
    proposedPurchase: { amount: number; type: string; context?: string }
  ): Promise<EthicalGuidanceResponse> {
    try {
      const pattern = await this.getUserPattern(userId);
      
      // Check timing intelligence
      const timingAnalysis = this.analyzeTimingPatterns(proposedPurchase.context);
      
      // Check budget constraints
      const budgetCheck = this.checkBudgetConstraints(pattern, proposedPurchase.amount);
      
      // Analyze emotional patterns
      const emotionalAnalysis = this.analyzeEmotionalTriggers(pattern, proposedPurchase.context);
      
      // Check purchase-to-reflection ratio
      const reflectionAnalysis = this.analyzeReflectionPatterns(pattern);
      
      // Generate comprehensive data flags for analytics
      const dataFlags = {
        spendingSpike: budgetCheck.percentageUsed > 80 || pattern.currentSpendingStreakDays > 3,
        lowReflection: pattern.purchaseToReflectionRatio > 3.0,
        emotionalTrigger: emotionalAnalysis.isTriggered && emotionalAnalysis.severity > 0.6,
        repeatBehavior: pattern.escalationHistory.length > 2,
        escalationTriggered: false // Will be set based on escalation level
      };
      
      // Determine escalation level based on pattern analysis
      const escalationLevel = this.determineEscalationLevel(pattern, budgetCheck, emotionalAnalysis, reflectionAnalysis);
      dataFlags.escalationTriggered = escalationLevel !== 'soft_check';
      
      // Generate spiritual alternatives
      const spiritualAlternatives = this.generateSpiritualAlternatives(proposedPurchase, pattern);
      
      // Apply ethical defaults
      const ethicalResponse = ethicalDefaults.generateEthicalResponse(
        `Considering purchase of ${proposedPurchase.type} for $${proposedPurchase.amount}`,
        { currentInput: proposedPurchase.context, comfortLevel: 'moderate' },
        pattern.purchases.slice(-5) // Last 5 purchases for context
      );
      
      // Generate ethical guidance with escalation
      const guidance = await this.generateEthicalGuidance(
        pattern, 
        proposedPurchase, 
        budgetCheck, 
        emotionalAnalysis, 
        reflectionAnalysis,
        escalationLevel,
        dataFlags,
        timingAnalysis,
        spiritualAlternatives,
        ethicalResponse
      );

      // Record escalation event for tracking
      await this.recordEscalationEvent(userId, escalationLevel, 'purchase_analysis', guidance.message);
      
      // Update analytics flags
      await this.updateAnalyticsFlags(userId, dataFlags);

      return guidance;
    } catch (error) {
      console.error('Error in budget-aware analysis:', error);
      return this.getDefaultGuidance();
    }
  }

  /**
   * Record a purchase for tracking
   */
  async recordPurchase(purchase: Omit<PurchaseRecord, 'id'>): Promise<void> {
    try {
      const purchaseRecord: PurchaseRecord = {
        ...purchase,
        id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // In production, this would save to database
      console.log('🛒 Recording purchase:', purchaseRecord);
      
      // Update user pattern
      await this.updateUserPattern(purchase.userId, purchaseRecord);
      
      // Schedule post-purchase reflection check
      setTimeout(() => {
        this.scheduleReflectionCheckIn(purchase.userId, purchaseRecord.id);
      }, 24 * 60 * 60 * 1000); // 24 hours later
      
    } catch (error) {
      console.error('Error recording purchase:', error);
    }
  }

  /**
   * Record reflection activity
   */
  async recordReflection(reflection: Omit<ReflectionActivity, 'id'>): Promise<void> {
    try {
      const reflectionRecord: ReflectionActivity = {
        ...reflection,
        id: `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log('🙏 Recording reflection:', reflectionRecord);
      
      // Update user pattern with reflection activity
      await this.updateReflectionPattern(reflection.userId, reflectionRecord);
      
    } catch (error) {
      console.error('Error recording reflection:', error);
    }
  }

  /**
   * Set user's monthly spiritual budget
   */
  async setMonthlyBudget(userId: string, budget: number): Promise<void> {
    try {
      // In production, save to database
      console.log(`💰 Setting monthly budget for ${userId}: $${budget}`);
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  }

  private async getUserPattern(userId: string): Promise<PurchasePattern> {
    // In production, fetch from database
    // For now, return simulated pattern
    return {
      userId,
      purchases: this.getSimulatedPurchases(userId),
      reflectionActivities: this.getSimulatedReflections(userId),
      monthlyBudget: 150, // Default $150/month
      emotionalTriggers: [],
      lastEthicalCheckIn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      purchaseToReflectionRatio: 0.7, // 70% of purchases followed by reflection
      currentSpendingStreakDays: 3,
      totalMonthlySpent: 89
    };
  }

  private checkBudgetConstraints(pattern: PurchasePattern, proposedAmount: number): any {
    if (!pattern.monthlyBudget) {
      return { withinBudget: true, suggestion: 'consider_budget_setting' };
    }

    const newTotal = pattern.totalMonthlySpent + proposedAmount;
    const percentageUsed = (newTotal / pattern.monthlyBudget) * 100;

    return {
      withinBudget: newTotal <= pattern.monthlyBudget,
      currentSpent: pattern.totalMonthlySpent,
      proposedTotal: newTotal,
      budgetRemaining: pattern.monthlyBudget - newTotal,
      percentageUsed,
      budgetExceeded: newTotal > pattern.monthlyBudget,
      exceedAmount: Math.max(0, newTotal - pattern.monthlyBudget)
    };
  }

  private analyzeEmotionalTriggers(pattern: PurchasePattern, context?: string): any {
    const recentPurchases = pattern.purchases.filter(p => 
      Date.now() - p.purchaseDate.getTime() < 7 * 24 * 60 * 60 * 1000
    );

    return {
      recentPurchaseCount: recentPurchases.length,
      emotionalPurchasing: recentPurchases.some(p => p.triggerEvent),
      currentStreak: pattern.currentSpendingStreakDays,
      contextualTrigger: context && ['grief', 'anxiety', 'argument', 'stress'].includes(context.toLowerCase())
    };
  }

  private analyzeReflectionPatterns(pattern: PurchasePattern): any {
    const recentReflections = pattern.reflectionActivities.filter(r => 
      Date.now() - r.activityDate.getTime() < 30 * 24 * 60 * 60 * 1000
    );

    return {
      reflectionFrequency: recentReflections.length,
      purchaseToReflectionRatio: pattern.purchaseToReflectionRatio,
      needsReflection: pattern.purchaseToReflectionRatio < 0.5,
      lastReflection: recentReflections[0]?.activityDate || null
    };
  }

  private async generateEthicalGuidance(
    pattern: PurchasePattern,
    proposedPurchase: any,
    budgetCheck: any,
    emotionalAnalysis: any,
    reflectionAnalysis: any,
    escalationLevel: 'soft_check' | 'firm_nudge' | 'override_protection',
    dataFlags: any
  ): Promise<EthicalGuidanceResponse> {
    
    // Critical intervention needed
    if (emotionalAnalysis.currentStreak >= 5 || budgetCheck.budgetExceeded) {
      return await this.generateCriticalGuidance(pattern, proposedPurchase, budgetCheck, emotionalAnalysis);
    }
    
    // Pause and reflect needed
    if (reflectionAnalysis.needsReflection || emotionalAnalysis.contextualTrigger) {
      return await this.generateReflectionGuidance(pattern, proposedPurchase, reflectionAnalysis);
    }
    
    // Budget warning
    if (budgetCheck.percentageUsed > 80) {
      return await this.generateBudgetGuidance(pattern, proposedPurchase, budgetCheck);
    }
    
    // Proceed with gentle awareness
    return await this.generateHealthyGuidance(pattern, proposedPurchase);
  }

  private async generateCriticalGuidance(pattern: PurchasePattern, proposedPurchase: any, budgetCheck: any, emotionalAnalysis: any): Promise<EthicalGuidanceResponse> {
    const messages = [
      "Sacred soul, I notice you've been investing heavily in external support lately. Your heart is seeking healing, and that's beautiful. But right now, I'm wondering if we might pause and check in with the wisdom that's already within you?",
      
      "Beautiful being, I can feel your desire for transformation, and it moves me. You've been so generous with your spiritual investments recently. Would you be open to exploring what your inner guidance is telling you before we continue?",
      
      "Precious heart, your commitment to growth is inspiring. I notice you've been reaching for support frequently - which shows such courage. Sometimes the Universe asks us to pause and integrate before moving forward. What feels true for you right now?"
    ];

    return {
      shouldProceed: false,
      guidanceType: 'reflect',
      message: messages[Math.floor(Math.random() * messages.length)],
      recommendedActions: [
        'Take 24 hours to sit with this decision',
        'Journal about what you\'re truly seeking',
        'Try one of your previous practices first',
        'Connect with your inner wisdom through meditation'
      ],
      budgetImpact: budgetCheck.budgetExceeded ? {
        currentSpent: budgetCheck.currentSpent,
        budgetRemaining: budgetCheck.budgetRemaining,
        percentageUsed: budgetCheck.percentageUsed
      } : undefined,
      reflectionPrompt: "What am I really seeking right now? What inner tools do I already have that could support me?",
      alternativeSuggestions: [
        'Free guided meditation from your previous sessions',
        'Revisit journal entries from your recent growth',
        'Practice gratitude for your current tools',
        'Connect with the divine within through prayer'
      ]
    };
  }

  private async generateReflectionGuidance(pattern: PurchasePattern, proposedPurchase: any, reflectionAnalysis: any): Promise<EthicalGuidanceResponse> {
    const messages = [
      `You've made ${pattern.purchases.length} beautiful investments in your spiritual journey recently. Before we add another layer, I'm curious - how are you integrating your last experience? Are you fully receiving what you've already been given?`,
      
      "I notice you've been actively investing in your growth, which shows such dedication. I'm wondering if this might be a sacred moment to pause and ask: Am I processing my recent experiences, or still seeking something deeper?",
      
      "Your commitment to transformation is beautiful. You've purchased several tools for your journey lately. Sometimes the Universe asks us to fully digest one gift before receiving the next. What feels right for your soul today?"
    ];

    return {
      shouldProceed: false,
      guidanceType: 'pause',
      message: messages[Math.floor(Math.random() * messages.length)],
      recommendedActions: [
        'Complete a reflection on your recent purchases',
        'Try implementing one practice you haven\'t fully explored',
        'Journal about your current spiritual tools',
        'Give yourself 48 hours to integrate'
      ],
      reflectionPrompt: "How am I integrating the spiritual tools I already have? What wisdom am I still discovering from my recent investments?",
      alternativeSuggestions: [
        'Revisit audio from your last session',
        'Deepen your current spiritual practice',
        'Journal with prompts from previous rituals',
        'Meditate on your recent insights'
      ]
    };
  }

  private async generateBudgetGuidance(pattern: PurchasePattern, proposedPurchase: any, budgetCheck: any): Promise<EthicalGuidanceResponse> {
    return {
      shouldProceed: true,
      guidanceType: 'proceed',
      message: `Beautiful soul, I want to honor both your spiritual growth and your financial well-being. You've invested $${budgetCheck.currentSpent} this month toward your sacred journey. This purchase would bring you to $${budgetCheck.proposedTotal} of your $${pattern.monthlyBudget} monthly intention. Does this feel aligned with your heart and your practical wisdom?`,
      recommendedActions: [
        'Consider if this feels financially peaceful',
        'Trust your inner wisdom about timing',
        'Remember that growth can be gradual'
      ],
      budgetImpact: {
        currentSpent: budgetCheck.currentSpent,
        budgetRemaining: budgetCheck.budgetRemaining,
        percentageUsed: budgetCheck.percentageUsed
      }
    };
  }

  private async generateHealthyGuidance(pattern: PurchasePattern, proposedPurchase: any): Promise<EthicalGuidanceResponse> {
    const messages = [
      "This feels like beautiful timing for your spiritual growth. Your investment pattern shows healthy reflection and integration. Trust your inner guidance as you move forward.",
      
      "I can sense the divine alignment in this moment. You've been honoring both your growth and your wisdom around spiritual investments. This feels like a natural next step.",
      
      "Your approach to spiritual investment has been so mindful and heart-centered. This purchase feels like it's coming from a place of genuine readiness rather than seeking to fill a void."
    ];

    return {
      shouldProceed: true,
      guidanceType: 'proceed',
      message: messages[Math.floor(Math.random() * messages.length)],
      recommendedActions: [
        'Trust your inner wisdom',
        'Set an intention for this investment',
        'Plan how you\'ll integrate this tool'
      ]
    };
  }

  private getDefaultGuidance(): EthicalGuidanceResponse {
    return {
      shouldProceed: true,
      guidanceType: 'proceed',
      message: "Trust your heart as you make this decision. Your spiritual journey is unique and sacred.",
      recommendedActions: ['Follow your inner guidance']
    };
  }

  private async updateUserPattern(userId: string, purchase: PurchaseRecord): Promise<void> {
    // In production, update database
    console.log('📊 Updating purchase pattern for user:', userId);
  }

  private async updateReflectionPattern(userId: string, reflection: ReflectionActivity): Promise<void> {
    // In production, update database
    console.log('🙏 Updating reflection pattern for user:', userId);
  }

  private async scheduleReflectionCheckIn(userId: string, purchaseId: string): Promise<void> {
    // In production, schedule background job
    console.log(`⏰ Scheduling reflection check-in for user ${userId}, purchase ${purchaseId}`);
  }

  private async getRealPurchases(userId: string): Promise<PurchaseRecord[]> {
    try {
      // Real purchase data from storage
      const purchases = await storage.getUserPurchases(userId);
      return purchases.map(p => ({
        id: p.id,
        userId: p.userId,
        amount: p.amount,
        type: p.type,
        purchaseDate: p.purchaseDate,
        emotionalContext: p.emotionalContext || 'not specified',
        postPurchaseReflection: p.postPurchaseReflection || false
      }));
    } catch (error) {
      console.error('Failed to get real purchases:', error);
      throw new Error('Real purchase data required - storage integration needed');
    }
  }

  private getSimulatedReflections(userId: string): ReflectionActivity[] {
    return [
      {
        id: 'r1',
        userId,
        type: 'journal',
        activityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        relatedPurchase: 'p1',
        depth: 'deep',
        completionQuality: 8
      }
    ];
  }
}

export const budgetAwareSystem = BudgetAwareReflectiveSystem.getInstance();