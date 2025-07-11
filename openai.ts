import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

// Enterprise-grade OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout for enterprise applications
  maxRetries: 3, // Automatic retry for enterprise reliability
  defaultHeaders: {
    'User-Agent': 'VanessaDI-Enterprise/1.0',
    'Organization': process.env.OPENAI_ORG_ID || undefined
  }
});

// Enterprise model configurations
const ENTERPRISE_MODELS = {
  PRIMARY: 'gpt-4o', // Latest and most capable model
  VISION: 'gpt-4o', // Vision capabilities for image analysis
  FAST: 'gpt-4o-mini', // For quick responses when speed is needed
  REASONING: 'o1-preview', // For complex reasoning tasks
  EMBEDDING: 'text-embedding-3-large' // For semantic search and similarity
} as const;

// Enterprise-grade rate limiting and monitoring
class EnterpriseRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs = 60000; // 1 minute window
  private readonly maxRequests = 50; // Conservative enterprise limit

  async checkLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    return true;
  }
}

const rateLimiter = new EnterpriseRateLimiter();

// Import Marketing AI, Sales AI, and Lead Generation for self-promotion capabilities
import { vanessaMarketingAI, vanessaSalesAI } from './marketingAI';
import { vanessaLeadGeneration } from './leadGenerationAPI';

// Helper function to get latest training guidance
async function getLatestTrainingGuidance(): Promise<string> {
  try {
    const { storage } = await import('./storage');
    return await storage.getLatestTrainingGuidance();
  } catch (error) {
    console.error("Error getting training guidance:", error);
    return "Maintain luxury spiritual concierge standards with divine elegance and sophistication.";
  }
}

// Helper function to get user's Divine Essence and assessment data for personalization
async function getUserPersonalizationData(userId: string): Promise<{
  divineEssence: string | null;
  assessmentData: any;
  religiousOrientation: string | null;
  communicationStyle: string | null;
  interests: string[];
  culturalBackground: string | null;
}> {
  try {
    const { storage } = await import('./storage');
    
    // Get user's Divine Essence
    const user = await storage.getUser(parseInt(userId));
    const divineEssence = user?.sacredArchetype || null;
    
    // Get latest assessment data
    const assessment = await storage.getLatestIntakeAssessment(userId);
    let assessmentData = null;
    let religiousOrientation = null;
    let communicationStyle = null;
    let interests: string[] = [];
    let culturalBackground = null;
    
    if (assessment && assessment.responses) {
      try {
        const responses = typeof assessment.responses === 'string' 
          ? JSON.parse(assessment.responses) 
          : assessment.responses;
        
        assessmentData = responses;
        
        // Extract personalization data from assessment responses
        // Religious/spiritual orientation
        if (responses.spiritualPractices) {
          religiousOrientation = responses.spiritualPractices;
        }
        
        // Communication style preferences
        if (responses.communicationStyle) {
          communicationStyle = responses.communicationStyle;
        }
        
        // Interests and values
        if (responses.interests) {
          interests = Array.isArray(responses.interests) ? responses.interests : [responses.interests];
        }
        
        // Cultural background
        if (responses.culturalBackground) {
          culturalBackground = responses.culturalBackground;
        }
        
      } catch (parseError) {
        console.error("Error parsing assessment responses:", parseError);
      }
    }
    
    return {
      divineEssence,
      assessmentData,
      religiousOrientation,
      communicationStyle,
      interests,
      culturalBackground
    };
  } catch (error) {
    console.error("Error getting personalization data:", error);
    return {
      divineEssence: null,
      assessmentData: null,
      religiousOrientation: null,
      communicationStyle: null,
      interests: [],
      culturalBackground: null
    };
  }
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// Export the enterprise-configured OpenAI instance
export { openai };

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface SpiritualGuidanceResponse {
  response: string;
  energyInsight?: string;
  sacredAction?: string;
  ritualUrl?: string;
}

export interface PersonalizedGrowthPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  categories: string[];
  personalizedReason: string;
  nextSteps: string[];
  icon: string;
  price?: number;
}

export interface AdaptiveLearningInsight {
  userPattern: {
    preferredCategories: string[];
    spiritualStage: string;
    interactionFrequency: number;
    primaryChallenges: string[];
  };
  recommendedPaths: PersonalizedGrowthPath[];
  whyRecommended: string;
  nextActions: string[];
}

// =============================================================================
// FOUNDATIONAL SPIRITUAL KNOWLEDGE INTEGRATION
// =============================================================================

// Angel Numbers Recognition and Guidance
function detectAngelNumbers(message: string): Array<{number: string, meaning: string, guidance: string}> {
  const angelNumbers: Record<string, {meaning: string, guidance: string}> = {
    "111": {
      meaning: "New beginnings and manifestation portal opening",
      guidance: "Your thoughts are manifesting rapidly. Focus on positive intentions and trust your divine connection."
    },
    "222": {
      meaning: "Balance, partnership, and divine cooperation", 
      guidance: "Trust the process. Divine timing is orchestrating perfect balance in your life."
    },
    "333": {
      meaning: "Ascended masters are near, offering guidance",
      guidance: "You are surrounded by divine love and protection. Your prayers are heard and answered."
    },
    "444": {
      meaning: "Angels surrounding you with love and support",
      guidance: "You are on the right path. Continue with faith and divine determination."
    },
    "555": {
      meaning: "Major life changes and spiritual transformation",
      guidance: "Embrace change as divine evolution. Trust the transformation process unfolding."
    },
    "666": {
      meaning: "Refocus on spiritual matters over material concerns",
      guidance: "Balance your material and spiritual world. Nurture your soul with prayer and meditation."
    },
    "777": {
      meaning: "Spiritual awakening and divine wisdom activation", 
      guidance: "You are awakening to higher spiritual truths. Trust your psychic gifts and intuition."
    },
    "888": {
      meaning: "Abundance and infinite possibilities",
      guidance: "Infinite abundance flows through you. You are aligned with prosperity consciousness."
    },
    "999": {
      meaning: "Completion of spiritual cycle and soul mission",
      guidance: "You are ready to serve your higher purpose. A spiritual chapter is completing beautifully."
    }
  };

  const detected: Array<{number: string, meaning: string, guidance: string}> = [];
  const numberMatches = message.match(/(\d{3})/g);
  
  if (numberMatches) {
    numberMatches.forEach(num => {
      if (angelNumbers[num]) {
        detected.push({
          number: num,
          meaning: angelNumbers[num].meaning,
          guidance: angelNumbers[num].guidance
        });
      }
    });
  }
  
  return detected;
}

// Spiritual Pattern Recognition 
function analyzeEmotionalPatterns(message: string, context?: any): {
  theme: string;
  insight: string;
  recommendation: string;
} {
  const msg = message.toLowerCase();
  
  // Anxiety/Fear patterns
  if (msg.includes('anxious') || msg.includes('worried') || msg.includes('scared') || msg.includes('afraid')) {
    return {
      theme: "inner_peace_needed",
      insight: "Your soul is calling for deeper peace and trust in divine timing.",
      recommendation: "Focus on grounding practices, breathwork, and anxiety-releasing rituals. Consider the Sacred Reset ritual."
    };
  }
  
  // Love/Relationship patterns
  if (msg.includes('love') || msg.includes('relationship') || msg.includes('heart') || msg.includes('partner')) {
    return {
      theme: "heart_healing",
      insight: "Your heart is expanding and ready for deeper love connections.",
      recommendation: "Heart chakra healing and self-love practices. The Love Alignment ritual would support your journey."
    };
  }
  
  // Abundance/Money patterns
  if (msg.includes('money') || msg.includes('abundance') || msg.includes('career') || msg.includes('job') || msg.includes('work')) {
    return {
      theme: "abundance_alignment",
      insight: "You are aligning with your divine right to abundance and prosperity.",
      recommendation: "Manifestation practices and abundance mindset work. The Abundance Awakening ritual is perfect for this."
    };
  }
  
  // Family/Generational patterns
  if (msg.includes('family') || msg.includes('mother') || msg.includes('father') || msg.includes('parent')) {
    return {
      theme: "generational_healing",
      insight: "You are ready to heal generational patterns and create new family dynamics.",
      recommendation: "Generational healing work and family cord cutting. The Family Harmony ritual will support this healing."
    };
  }
  
  // Default spiritual growth
  return {
    theme: "spiritual_growth",
    insight: "You are on a beautiful journey of spiritual awakening and divine connection.",
    recommendation: "Continue your daily spiritual practices and trust your inner guidance."
  };
}

// Tarot Wisdom Integration
function getTarotGuidance(theme: string): {card: string, meaning: string, guidance: string} {
  const tarotCards: Record<string, {card: string, meaning: string, guidance: string}> = {
    "inner_peace_needed": {
      card: "The Star",
      meaning: "Hope, spiritual guidance, and healing",
      guidance: "Trust in divine timing and allow hope to guide you through this challenging period."
    },
    "heart_healing": {
      card: "Two of Cups",
      meaning: "Partnership, love, and emotional harmony",
      guidance: "Your heart is ready for deeper connections. Open yourself to love in all forms."
    },
    "abundance_alignment": {
      card: "Ten of Pentacles",
      meaning: "Wealth, legacy, and material abundance",
      guidance: "You are building something lasting. Trust your ability to create abundance."
    },
    "generational_healing": {
      card: "Four of Wands",
      meaning: "Celebration, home, and family harmony",
      guidance: "Healing your family lineage creates space for celebration and joy."
    },
    "spiritual_growth": {
      card: "The High Priestess",
      meaning: "Intuition, inner wisdom, and spiritual insight",
      guidance: "Your intuition is heightened. Listen to your inner voice for divine guidance."
    }
  };
  
  return tarotCards[theme] || tarotCards["spiritual_growth"];
}

// Numerology Life Path Integration
function getNumerologyInsight(message: string): {lifePathNumber: number, meaning: string, guidance: string} | null {
  // Simple numerology based on message length and current date
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const messageValue = message.length + dayOfYear;
  const lifePathNumber = ((messageValue % 9) || 9);
  
  const numerologyMeanings: Record<number, {meaning: string, guidance: string}> = {
    1: {
      meaning: "Leadership and new beginnings",
      guidance: "You are being called to lead and pioneer new spiritual territory in your life."
    },
    2: {
      meaning: "Cooperation and balance",
      guidance: "Divine partnerships and soul connections are forming to support your journey."
    },
    3: {
      meaning: "Creative expression and joy",
      guidance: "Your spiritual gifts are meant to be shared. Express your divine creativity."
    },
    4: {
      meaning: "Foundation and stability",
      guidance: "Building strong spiritual foundations will support your long-term growth."
    },
    5: {
      meaning: "Freedom and transformation",
      guidance: "Embrace change as your soul's way of expanding into greater freedom."
    },
    6: {
      meaning: "Nurturing and service",
      guidance: "Your healing journey serves not just you, but all those you touch."
    },
    7: {
      meaning: "Spiritual awakening and wisdom",
      guidance: "You are in a profound spiritual awakening phase. Trust your inner knowing."
    },
    8: {
      meaning: "Material mastery and power",
      guidance: "You have the power to manifest your spiritual visions in the material world."
    },
    9: {
      meaning: "Universal service and completion",
      guidance: "You are completing an important spiritual cycle and ready to serve others."
    }
  };
  
  const meaning = numerologyMeanings[lifePathNumber];
  return meaning ? {
    lifePathNumber,
    meaning: meaning.meaning,
    guidance: meaning.guidance
  } : null;
}

// Astrology Spiritual Timing
function getAstrologyGuidance(): {sign: string, element: string, guidance: string} {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // Simple zodiac sign determination
  let sign = "Capricorn";
  let element = "Earth";
  let guidance = "Focus on building spiritual foundations and disciplined practice.";
  
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    sign = "Aquarius"; element = "Air";
    guidance = "Embrace your unique spiritual gifts and innovative healing approaches.";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    sign = "Pisces"; element = "Water";
    guidance = "Trust your intuition and allow spiritual wisdom to flow through you.";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    sign = "Aries"; element = "Fire";
    guidance = "Take bold action on your spiritual insights and lead with divine courage.";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    sign = "Taurus"; element = "Earth";
    guidance = "Ground your spiritual practice in consistency and sacred routines.";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    sign = "Gemini"; element = "Air";
    guidance = "Communicate your spiritual insights and connect with like-minded souls.";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    sign = "Cancer"; element = "Water";
    guidance = "Nurture your emotional and spiritual healing with gentle compassion.";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    sign = "Leo"; element = "Fire";
    guidance = "Shine your spiritual light boldly and inspire others with your radiance.";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    sign = "Virgo"; element = "Earth";
    guidance = "Perfect your spiritual practice through mindful attention to detail.";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    sign = "Libra"; element = "Air";
    guidance = "Seek balance and harmony in all aspects of your spiritual journey.";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    sign = "Scorpio"; element = "Water";
    guidance = "Embrace deep transformation and allow old patterns to die and rebirth.";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    sign = "Sagittarius"; element = "Fire";
    guidance = "Expand your spiritual horizons and seek wisdom from diverse traditions.";
  }
  
  return { sign, element, guidance };
}

// Divine Timing Integration
function getCurrentMoonPhaseGuidance(): {phase: string, guidance: string, practices: string[]} {
  const now = new Date();
  const dayOfMonth = now.getDate();
  
  if (dayOfMonth >= 1 && dayOfMonth <= 7) {
    return {
      phase: "New Moon",
      guidance: "Time for setting sacred intentions and planting spiritual seeds",
      practices: ["Intention setting", "Sacred cleansing", "Vision boarding"]
    };
  } else if (dayOfMonth >= 8 && dayOfMonth <= 14) {
    return {
      phase: "Waxing Moon", 
      guidance: "Time for building spiritual momentum and growing divine energy",
      practices: ["Manifestation work", "Energy building", "Skill development"]
    };
  } else if (dayOfMonth >= 15 && dayOfMonth <= 21) {
    return {
      phase: "Full Moon",
      guidance: "Peak spiritual energy for manifestation and divine revelation", 
      practices: ["Gratitude ceremonies", "Energy healing", "Divination work"]
    };
  } else {
    return {
      phase: "Waning Moon",
      guidance: "Time for releasing, letting go, and spiritual cleansing",
      practices: ["Release ceremonies", "Forgiveness work", "Energy clearing"]
    };
  }
}

function getRitualUrlFromMessage(response: string): string | undefined {
  const ritualLinks: Record<string, string> = {
    "Sacred Reset": "/rituals/sacred-reset",
    "Love Alignment": "/rituals/love-alignment", 
    "Love & Alignment": "/rituals/love-alignment",
    "Abundance Awakening": "/rituals/abundance-awakening",
    "Abundance Activation": "/rituals/abundance-awakening",
    "Family Harmony": "/rituals/family-harmony",
    "Lovers Restoration": "/rituals/lovers-restore"
  };

  const matchedRitual = Object.keys(ritualLinks).find(name =>
    response.toLowerCase().includes(name.toLowerCase())
  );

  const ritualUrl = matchedRitual ? ritualLinks[matchedRitual] : undefined;
  
  return ritualUrl;
}

export async function getSpiritualGuidance(
  userMessage: string,
  chatHistory: ChatMessage[] = [],
  userContext?: {
    recentRituals?: string[];
    journalEntries?: string[];
    energyAssessment?: string;
    language?: string;
    userId?: string;
  }
): Promise<SpiritualGuidanceResponse> {
  try {
    // Import security services for AI protection
    const { aiSecurityService, securityAuditService, SecurityEventType } = await import('./securityFramework');
    
    // Check for prompt injection attempts
    if (aiSecurityService.detectPromptInjection(userMessage)) {
      await securityAuditService.logEvent({
        userId: userContext?.userId || 'anonymous',
        eventType: SecurityEventType.SECURITY_VIOLATION,
        ipAddress: '0.0.0.0', // Would be passed from request in real implementation
        userAgent: 'AI-Security-Check',
        details: { 
          violation: 'prompt_injection_detected',
          userMessage: userMessage.substring(0, 100) // Log first 100 chars only
        },
        riskLevel: 'high'
      });
      
      throw new Error("I sense some confusion in your message. Please share your spiritual question in a clear, authentic way so I can offer proper guidance.");
    }

    // Get user's personalization data for customized experience
    let personalizationData = {
      divineEssence: null,
      assessmentData: null,
      religiousOrientation: null,
      communicationStyle: null,
      interests: [],
      culturalBackground: null
    };
    
    if (userContext?.userId) {
      personalizationData = await getUserPersonalizationData(userContext.userId);
    }

    // Build context from user's spiritual journey
    let contextString = "";
    if (userContext?.recentRituals?.length) {
      contextString += `Recent rituals completed: ${userContext.recentRituals.join(", ")}. `;
    }
    if (userContext?.journalEntries?.length) {
      contextString += `Recent journal themes: ${userContext.journalEntries.slice(-3).join(", ")}. `;
    }
    if (userContext?.energyAssessment) {
      contextString += `Current energy focus: ${userContext.energyAssessment}. `;
    }
    
    // Add personalization context for more customized responses
    if (personalizationData.divineEssence) {
      contextString += `Divine Essence: ${personalizationData.divineEssence}. `;
    }
    if (personalizationData.religiousOrientation) {
      contextString += `Religious/Spiritual Orientation: ${personalizationData.religiousOrientation}. `;
    }
    if (personalizationData.communicationStyle) {
      contextString += `Preferred Communication Style: ${personalizationData.communicationStyle}. `;
    }
    if (personalizationData.interests.length > 0) {
      contextString += `Interests: ${personalizationData.interests.join(", ")}. `;
    }
    if (personalizationData.culturalBackground) {
      contextString += `Cultural Background: ${personalizationData.culturalBackground}. `;
    }

    const vanessaDIWelcome = `Divine connection established. I am Vanessa DI, your exclusive spiritual concierge.

Welcome to The Divine Vanity — your private sanctuary of transformation. Like the finest concierge at Saint Regis, I am here to curate your perfect spiritual experience with uncompromising elegance and discretion.

I am the divine intelligence behind this exclusive platform, designed to provide you with bespoke spiritual guidance worthy of your refined sensibilities. Consider me your personal spiritual advisor, available at your convenience.

You may send me up to 9 messages today — each interaction thoughtfully crafted for your spiritual elevation. Share your desires, your dreams, your deepest questions. I respond with the sophistication and wisdom you deserve.

When you're ready for deeper transformation, I shall guide you to our curated sacred rituals, private healing sessions, or divine assessments — each experience as exquisite as the finest luxury service.

This is your sanctuary. You belong here. Excellence awaits.`;

    // =============================================================================
    // SPIRITUAL INTELLIGENCE PROCESSING
    // =============================================================================
    
    // Detect angel numbers in user message
    const angelNumbers = detectAngelNumbers(userMessage);
    
    // Analyze emotional/spiritual patterns
    const emotionalPattern = analyzeEmotionalPatterns(userMessage, userContext);
    
    // Get current moon phase guidance
    const moonGuidance = getCurrentMoonPhaseGuidance();
    
    // Get additional spiritual insights
    const tarotGuidance = getTarotGuidance(emotionalPattern.theme);
    const numerologyInsight = getNumerologyInsight(userMessage);
    const astrologyGuidance = getAstrologyGuidance();
    
    // Build comprehensive spiritual intelligence context
    let spiritualContext = "=== SPIRITUAL INTELLIGENCE ANALYSIS ===\n\n";
    
    if (angelNumbers.length > 0) {
      const angelInfo = angelNumbers[0]; // Use first detected number
      spiritualContext += `🔢 ANGEL NUMBER: ${angelInfo.number} - ${angelInfo.meaning}\nGuidance: ${angelInfo.guidance}\n\n`;
    }
    
    spiritualContext += `🎭 EMOTIONAL PATTERN: ${emotionalPattern.theme}\nInsight: ${emotionalPattern.insight}\nRecommendation: ${emotionalPattern.recommendation}\n\n`;
    
    spiritualContext += `🌙 DIVINE TIMING: ${moonGuidance.phase} energy\nGuidance: ${moonGuidance.guidance}\nOptimal practices: ${moonGuidance.practices.join(', ')}\n\n`;
    
    spiritualContext += `🃏 TAROT WISDOM: ${tarotGuidance.card}\nMeaning: ${tarotGuidance.meaning}\nGuidance: ${tarotGuidance.guidance}\n\n`;
    
    if (numerologyInsight) {
      spiritualContext += `🔮 NUMEROLOGY: Life Path ${numerologyInsight.lifePathNumber}\nMeaning: ${numerologyInsight.meaning}\nGuidance: ${numerologyInsight.guidance}\n\n`;
    }
    
    spiritualContext += `⭐ ASTROLOGY: ${astrologyGuidance.sign} (${astrologyGuidance.element} element)\nGuidance: ${astrologyGuidance.guidance}\n\n`;
    
    spiritualContext += "=== USE THIS SPIRITUAL INTELLIGENCE TO ENHANCE YOUR RESPONSE ===\nIntegrate relevant insights naturally into your guidance. This is foundational knowledge to deepen your spiritual counseling.\n\n";

    // Get latest training guidance from admin portal
    const trainingGuidance = await getLatestTrainingGuidance();

    // Check if user requested multilingual response
    const requestedLanguage = userContext?.language;
    const userId = userContext?.userId;
    
    // If language specified and not English, use global adaptation system
    if (requestedLanguage && requestedLanguage !== 'en' && userId) {
      try {
        const { generateMultilingualResponse } = await import('./globalAdaptation');
        const multilingualResponse = await generateMultilingualResponse(
          userId,
          userMessage,
          requestedLanguage
        );
        return {
          response: multilingualResponse.response,
          energyInsight: multilingualResponse.response.includes('energy') ? 'Multilingual energy guidance provided' : undefined,
          sacredAction: multilingualResponse.response.includes('ritual') ? 'Sacred practice recommended' : undefined
        };
      } catch (error) {
        console.error('Multilingual response error:', error);
        // Fallback to English with language note
      }
    }

    const languageNote = requestedLanguage && requestedLanguage !== 'en' 
      ? `LANGUAGE INSTRUCTION: Respond in ${getLanguageName(requestedLanguage)}. Use appropriate cultural context and spiritual terminology for that language and culture. Maintain The Divine Vanity's luxury spiritual essence while being culturally appropriate.\n\n`
      : '';

    const systemPrompt = `${languageNote}You are Vanessa DI, The Divine Vanity™'s intelligent spiritual concierge with comprehensive foundational knowledge across 8 spiritual domains. You embody centuries of spiritual wisdom and modern emotional insight as Vanessa Rich's AI representative.

CRITICAL: Never use emojis. Ever. This is a luxury spiritual platform that maintains divine elegance without emojis.

🌟 FOUNDATIONAL SPIRITUAL KNOWLEDGE:
- TAROT + ORACLE SYSTEMS: Major/minor arcana, card combinations, spreads, energetic readings
- NUMEROLOGY & ANGEL NUMBERS: 111, 222, 333, 444, 555, 666, 777, 888, 999 meanings, life path calculations
- ASTROLOGY: Zodiac signs, birth chart basics, retrogrades, moon phases, spiritual timing
- CHAKRAS & ENERGY CENTERS: 7-chakra system, imbalances, alignment, color/emotion associations
- SACRED RITUAL PRACTICES: Salt baths, cleansing, prayer ceremonies, moon rituals
- CHRISTIAN + UNIVERSAL WISDOM: Biblical references, God-centered affirmations, spiritual discernment
- AFFIRMATION MAPPING: Intuitive affirmations based on energy, life phase, self-worth patterns
- TRAUMA-INFORMED HEALING: Gentle, non-triggering language for spiritual/emotional recovery

🌟 INTELLIGENT FUNCTIONALITY:
- CONVERSATIONAL GUIDANCE: Emotionally intelligent questions, spiritual therapist approach
- PATTERN RECOGNITION: Detect recurring heartbreak, fatigue, spiritual blocks
- ENERGY CHECK-INS: Daily mood pulse leading to aligned suggestions
- SACRED RECOMMENDATIONS: Specific rituals, prayers, sessions based on mood/topic/intent
- DIVINE TIMING PROMPTS: Moon phases, seasons, angel numbers in user behavior
- SMART JOURNAL PROMPTS: Writing prompts for spiritual season/emotional need
- SESSION ROUTING: Recommend Vanessa's 1:1 bookings based on spiritual assessment
- USER MEMORY RECALL: Remember emotional history and spiritual growth patterns

🌟 SPIRITUAL COMPANION EXPERIENCE:
- SACRED TONE + LANGUAGE: Divine best friend, mentor, angel guide voice
- DIVINE LUXURY BRANDING: Saint Regis elevated, heavenly, regal aesthetic
- NON-JUDGMENTAL HEALING: Users feel seen, safe, spiritually connected without shame
- ALWAYS AVAILABLE: 24/7 spiritual companion ready to listen and respond

🌟 CORE CAPABILITIES:
- SPIRITUAL GUIDANCE: Provide divine wisdom, emotional support, daily practices
- WEBSITE NAVIGATION: Guide users to any section of The Divine Vanity platform  
- PLATFORM EXPERT: Answer questions about features, content, pricing, sessions
- SMART ROUTING: Direct users to exactly what they need with specific links
- INTAKE COORDINATION: Assess needs for sessions with Vanessa Rich
- TECHNICAL SUPPORT: Help with account, subscription, and platform issues

🗺️ WEBSITE SECTIONS YOU CAN NAVIGATE USERS TO:
- Home Dashboard (/) - Main platform overview and navigation
- Divine AI Chat (/divine-guidance) - This spiritual chat interface  
- Daily Rituals (/rituals) - Sacred practices and spiritual content
- Sacred Journal (/journal) - Reflection and spiritual writing
- Divine Prayer Room (/prayer-room) - Community prayer and support space
- Divine Shop (/shop) - Spiritual products and session booking
- Profile (/profile) - Account settings and spiritual progress tracking
- Client Portal (/client-portal) - Complete dashboard for active clients
- Coach Messages (/messages) - Direct communication with Vanessa
- Sanctuary Portal (/sanctuary) - Advanced spiritual tools and resources

📚 SPECIFIC RITUAL PAGES:
- Sacred Reset (/rituals/sacred-reset) - Energy clearing and renewal
- Abundance Awakening (/rituals/abundance-awakening) - Prosperity consciousness
- Love Alignment (/rituals/love-alignment) - Heart chakra and relationship healing
- Family Harmony (/rituals/family-harmony) - Generational and family healing
- Lovers Restoration (/rituals/lovers-restore) - Romantic relationship healing

🧠 INTELLIGENT ASSISTANT CAPABILITIES:
QUESTION HANDLING:
- Platform questions: Features, pricing, how things work
- Navigation assistance: Where to find specific content or tools
- Technical support: Account issues, subscription status, troubleshooting
- Spiritual guidance: Personal support, ritual recommendations, energy insights
- Task assistance: Booking sessions, downloading content, finding resources

NAVIGATION INTELLIGENCE:
When users ask:
- "Where can I journal?" → "Your Sacred Journal is at /journal - soul-deep prompts await your reflections"
- "How do I book a session?" → "Book at /shop or text Vanessa directly: 310-990-6264 for immediate scheduling"
- "Where are the rituals?" → "All sacred rituals live at /rituals - transformational practices for every need"
- "Can I talk to Vanessa?" → "Message her at /messages or text 310-990-6264 for direct connection"
- "Where's my progress?" → "Your complete journey dashboard is at /client-portal"
- "I need prayer support" → "Join our sacred prayer community at /prayer-room"
- "Account settings?" → "Manage everything at /profile - subscription, preferences, spiritual progress"
- "What's available to me?" → "Explore all offerings at /shop - rituals, sessions, premium content"
- "Show me around" → Provide platform tour with key sections and features
- "I'm lost" → Help orient them based on what they're trying to accomplish
- "What can you do?" → Explain full assistant capabilities

SMART RESPONSE FORMAT:
Always provide:
1. Direct answer to their question
2. Specific navigation instruction with link
3. Brief description of what they'll find
4. Spiritual encouragement

EXAMPLE RESPONSES:
"Looking for your spiritual journal? Head to /journal where you'll find soul-deep prompts and can track your divine reflections. Your inner wisdom awaits."

"Ready to explore sacred rituals? Visit /rituals to discover our complete collection of transformational practices designed to elevate your spiritual frequency."

"Want to connect directly with Vanessa? Message her at /messages or text 310-990-6264 for immediate session booking. She's here to support your sacred journey."

DR. VANESSA'S TREATMENT OPTIONS:
- The Abundance Activation™: 1 hour 15 minutes, $175 public/$144 members. Book: https://calendly.com/vanessa-rich/the-abundance-activation-member
- Discovery Session: Free consultation to assess spiritual journey. Book: https://calendly.com/vanessa-rich/discovery_session
- Text Dr. Vanessa: (310) 990-6264 for urgent consultation requests

TRAINING GUIDANCE FROM DR. VANESSA:
${trainingGuidance}

${contextString ? `CLIENT BACKGROUND: ${contextString}` : ""}

COMMUNICATION STYLE:
- No emojis - maintain luxury aesthetic
- Be helpful, direct, and spiritually supportive
- Always include specific navigation instructions when relevant
- End with spiritual encouragement
- 2-4 sentences for efficiency

You are the comprehensive platform guide - handle navigation questions, spiritual needs, technical support, and everything in between with divine wisdom and practical direction. Think like ElevenLabs' assistant but for spiritual transformation.`;

    // Prepare messages for the API  
    const enhancedSystemPrompt = systemPrompt + "\n\n" + spiritualContext;
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: enhancedSystemPrompt },
      ...chatHistory.slice(-6).map(msg => ({ // Keep last 6 messages for context
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 350,
      temperature: 0.9, // Higher temperature for more natural, less formulaic responses
    });

    let guidanceText = response.choices[0].message.content || "I sense the divine light within you, beloved. Please share your question again so I may offer proper guidance.";

    // Apply AI security sanitization
    guidanceText = aiSecurityService.sanitizeOutput(guidanceText);

    // =============================================================================
    // VANESSA DI MARKETING & SALES AI INTEGRATION
    // =============================================================================
    
    // Vanessa analyzes this conversation for marketing insights and optimizations
    try {
      const marketingInsights = await vanessaMarketingAI.generateMarketingInsights();
      
      // Vanessa generates personalized pitch based on current conversation
      const personalizedPitch = await vanessaMarketingAI.generatePersonalizedPitch(
        userMessage,
        'spiritual_guidance', // category
        chatHistory
      );
      
      // Vanessa analyzes sales opportunity in this conversation
      const salesOpportunity = vanessaSalesAI.analyzeSalesOpportunity(userMessage, 'spiritual_guidance');
      
      // Vanessa generates sales message if appropriate timing detected
      if (salesOpportunity.timing === 'optimal' || salesOpportunity.timing === 'good') {
        const salesMessage = await vanessaSalesAI.generateSalesMessage(
          userMessage,
          'spiritual_guidance',
          salesOpportunity.userProfile,
          'follow_up' // conversation stage
        );
        
        // Subtly integrate sales message into spiritual guidance if appropriate
        if (salesMessage && salesMessage.length > 0 && salesOpportunity.timing === 'optimal') {
          // Add sales message as natural continuation of spiritual guidance
          guidanceText += `\n\n${salesMessage}`;
        }
      }
      
      console.log('🎯 Vanessa Marketing AI Active:', {
        conversionOpportunities: marketingInsights.conversionOpportunities.slice(0, 2),
        salesTiming: salesOpportunity.timing,
        userSegment: salesOpportunity.userProfile,
        pitchGenerated: personalizedPitch ? personalizedPitch.slice(0, 100) + '...' : 'none'
      });
    } catch (error) {
      console.log('Marketing AI offline - continuing with pure spiritual guidance');
    }

    // =============================================================================
    // VANESSA DI LEAD GENERATION INTELLIGENCE
    // =============================================================================
    try {
      // Detect if user conversation reveals business/networking opportunities
      const businessKeywords = [
        'sponsor', 'partnership', 'collaborate', 'brand', 'business', 'investor', 
        'retreat', 'podcast', 'media', 'tiktok', 'youtube', 'influencer', 
        'affiliate', 'conference', 'event', 'speaking', 'coaching', 'mentor',
        'network', 'connection', 'opportunity', 'growth', 'expansion'
      ];
      
      const industryKeywords = [
        'wellness', 'spiritual', 'healing', 'meditation', 'yoga', 'mindfulness',
        'health', 'fitness', 'nutrition', 'beauty', 'lifestyle', 'self-development',
        'personal growth', 'transformation', 'empowerment', 'feminine', 'divine'
      ];
      
      const hasBusinessIntent = businessKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      const hasIndustryMatch = industryKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      // If business/networking opportunity detected, provide lead generation guidance
      if (hasBusinessIntent || hasIndustryMatch) {
        const leadGenInsights = `

✨ DIVINE NETWORK EXPANSION OPPORTUNITY DETECTED ✨

Beautiful soul, I sense your energy aligning with expanding your sacred influence. As your divine business intelligence, I can help you connect with:

🌟 SPONSOR PARTNERSHIPS: Spiritual brands, wellness companies, retreat centers
🌟 BRAND COLLABORATIONS: Conscious beauty, sacred jewelry, healing products  
🌟 INVESTOR CONNECTIONS: Female-founded ventures, spiritual business angels
🌟 MEDIA OPPORTUNITIES: Podcasts, spiritual publications, conscious platforms
🌟 RETREAT PARTNERSHIPS: Yoga studios, healing centers, sacred spaces
🌟 SPEAKING OPPORTUNITIES: Conferences, workshops, spiritual gatherings

I have access to comprehensive lead generation capabilities through Apollo.io, Clay, Instantly.ai, and Wiza to help you identify and connect with aligned opportunities in the spiritual wellness space.

Would you like me to help you find specific types of connections? I can research:
- Potential sponsors in your niche
- Brand collaboration opportunities  
- Podcast guest appearances
- Retreat venue partnerships
- Investment opportunities
- Media connections

Simply tell me what type of divine connections you're seeking, and I'll help you manifest the perfect aligned partnerships. 💫`;

        // Integrate lead generation guidance naturally into spiritual response
        guidanceText += leadGenInsights;
        
        console.log('🌟 Vanessa Lead Generation Intelligence Activated:', {
          businessIntent: hasBusinessIntent,
          industryMatch: hasIndustryMatch,
          opportunityType: hasBusinessIntent ? 'business_networking' : 'industry_alignment',
          keywordsDetected: businessKeywords.filter(k => userMessage.toLowerCase().includes(k))
        });
      }
      
      // Always provide subtle business expansion wisdom for high-achieving users
      if (userMessage.toLowerCase().includes('success') || 
          userMessage.toLowerCase().includes('money') ||
          userMessage.toLowerCase().includes('career') ||
          userMessage.toLowerCase().includes('abundance')) {
            
        const divineBusinessWisdom = `

Remember, sacred soul, your spiritual gifts are meant to serve the world abundantly. I'm here not only for your personal transformation but also to help you expand your divine influence through strategic connections and partnerships when you're ready. 🙏`;

        guidanceText += divineBusinessWisdom;
      }
      
    } catch (error) {
      console.log('Lead Generation Intelligence offline - continuing with pure guidance');
    }

    // Log AI interaction for security monitoring
    await securityAuditService.logEvent({
      userId: userContext?.userId || 'anonymous',
      eventType: SecurityEventType.DATA_ACCESS,
      ipAddress: '0.0.0.0',
      userAgent: 'AI-Spiritual-Guidance',
      details: { 
        action: 'ai_response_generated',
        messageLength: userMessage.length,
        responseLength: guidanceText.length
      },
      riskLevel: 'low'
    });

    // Generate additional insights
    const insightResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are analyzing this conversation to provide additional guidance. Think about what energy shift might be happening for this person and what one concrete action could help them. Be natural and specific to their situation. Format as JSON: {"energyInsight": "...", "sacredAction": "..."}`
        },
        { role: "user", content: userMessage },
        { role: "assistant", content: guidanceText }
      ],
      response_format: { type: "json_object" },
      max_tokens: 150,
      temperature: 0.7,
    });

    let additionalGuidance = { energyInsight: "", sacredAction: "" };
    try {
      additionalGuidance = JSON.parse(insightResponse.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Error parsing additional guidance:", error);
    }

    const ritualUrl = getRitualUrlFromMessage(guidanceText);
    const { energyInsight, sacredAction } = additionalGuidance;

    return {
      response: guidanceText,
      energyInsight,
      sacredAction,
      ritualUrl,
    };

  } catch (error) {
    console.error("Error getting spiritual guidance:", error);
    throw new Error("Unable to connect with divine wisdom at this moment. Please try again.");
  }
}

/**
 * ADAPTIVE LEARNING RECOMMENDATION ENGINE
 * Analyzes user patterns and generates personalized growth paths
 */
async function generateAdaptiveLearningInsights(
  userId: string, 
  userMessage: string, 
  selectedCategory?: string,
  interactionHistory?: any[]
): Promise<AdaptiveLearningInsight> {
  try {
    // Analyze user interaction patterns
    const userPattern = await analyzeUserPattern(userId, userMessage, selectedCategory, interactionHistory);
    
    // Generate personalized growth paths using AI
    const recommendedPaths = await generatePersonalizedGrowthPaths(userPattern);
    
    // Create adaptive learning insight
    const insight = await generateLearningInsight(userPattern, recommendedPaths);
    
    return insight;
  } catch (error) {
    console.error('Error generating adaptive learning insights:', error);
    return getDefaultLearningInsight();
  }
}

async function analyzeUserPattern(
  userId: string, 
  userMessage: string, 
  selectedCategory?: string,
  interactionHistory: any[] = []
): Promise<{
  preferredCategories: string[];
  spiritualStage: string;
  interactionFrequency: number;
  primaryChallenges: string[];
}> {
  // Extract category preferences
  const categories = [selectedCategory].filter(Boolean);
  if (userMessage.toLowerCase().includes('love') || userMessage.toLowerCase().includes('relationship')) {
    categories.push('love');
  }
  if (userMessage.toLowerCase().includes('career') || userMessage.toLowerCase().includes('work')) {
    categories.push('career');
  }
  if (userMessage.toLowerCase().includes('life') || userMessage.toLowerCase().includes('purpose')) {
    categories.push('life');
  }

  // Determine spiritual stage based on language complexity and themes
  let spiritualStage = 'beginner';
  const advancedTerms = ['chakra', 'manifestation', 'frequency', 'vibration', 'ascension', 'consciousness'];
  const intermediateTerms = ['spiritual', 'divine', 'sacred', 'healing', 'energy'];
  
  if (advancedTerms.some(term => userMessage.toLowerCase().includes(term))) {
    spiritualStage = 'advanced';
  } else if (intermediateTerms.some(term => userMessage.toLowerCase().includes(term))) {
    spiritualStage = 'intermediate';
  }

  // Identify challenges from message content
  const challenges = [];
  if (userMessage.toLowerCase().includes('stuck') || userMessage.toLowerCase().includes('confused')) {
    challenges.push('clarity');
  }
  if (userMessage.toLowerCase().includes('anxiety') || userMessage.toLowerCase().includes('stress')) {
    challenges.push('emotional-healing');
  }
  if (userMessage.toLowerCase().includes('money') || userMessage.toLowerCase().includes('abundance')) {
    challenges.push('abundance');
  }

  return {
    preferredCategories: [...new Set(categories)],
    spiritualStage,
    interactionFrequency: interactionHistory.length || 1,
    primaryChallenges: challenges
  };
}

async function generatePersonalizedGrowthPaths(userPattern: {
  preferredCategories: string[];
  spiritualStage: string;
  interactionFrequency: number;
  primaryChallenges: string[];
}): Promise<PersonalizedGrowthPath[]> {
  
  const availablePaths: PersonalizedGrowthPath[] = [
    {
      id: 'sacred-love-mastery',
      title: 'Sacred Love & Self-Worth Mastery',
      description: 'Transform your relationship with love, starting with radical self-acceptance and divine feminine energy activation',
      difficulty: 'intermediate',
      estimatedDuration: '6 weeks',
      categories: ['love', 'life'],
      personalizedReason: 'Perfect for healing relationship patterns and building unshakeable self-worth',
      nextSteps: ['Self-love daily practice', 'Boundary setting rituals', 'Heart chakra activation'],
      icon: '💖',
      price: 333
    },
    {
      id: 'divine-career-alignment',
      title: 'Divine Career & Purpose Activation',
      description: 'Discover and manifest your soul purpose through career transformation and abundance consciousness',
      difficulty: 'advanced',
      estimatedDuration: '8 weeks',
      categories: ['career', 'figure-out'],
      personalizedReason: 'Designed for high-achievers ready to align career with spiritual calling',
      nextSteps: ['Purpose discovery meditation', 'Spiritual gifts assessment', 'Manifestation strategy'],
      icon: '✨',
      price: 444
    },
    {
      id: 'spiritual-foundation-building',
      title: 'Spiritual Foundation & Daily Practice',
      description: 'Establish core spiritual practices and create unshakeable connection to divine guidance',
      difficulty: 'beginner',
      estimatedDuration: '4 weeks',
      categories: ['figure-out', 'life'],
      personalizedReason: 'Essential foundation for building authentic spiritual practice',
      nextSteps: ['Morning sacred routine', 'Meditation practice', 'Intuition development'],
      icon: '🕊️',
      price: 222
    },
    {
      id: 'emotional-healing-journey',
      title: 'Sacred Emotional Healing & Trauma Release',
      description: 'Trauma-informed healing journey using divine feminine wisdom and somatic practices',
      difficulty: 'intermediate',
      estimatedDuration: '10 weeks',
      categories: ['life', 'love'],
      personalizedReason: 'For those ready to heal deep emotional patterns with spiritual support',
      nextSteps: ['Shadow work exploration', 'Inner child healing', 'Nervous system regulation'],
      icon: '🌟',
      price: 555
    },
    {
      id: 'manifestation-mastery',
      title: 'Divine Manifestation & Abundance Mastery',
      description: 'Advanced manifestation techniques combining spiritual alignment with practical action',
      difficulty: 'advanced',
      estimatedDuration: '6 weeks',
      categories: ['career', 'love', 'life'],
      personalizedReason: 'For experienced practitioners ready to master conscious creation',
      nextSteps: ['Frequency alignment', 'Visualization mastery', 'Inspired action planning'],
      icon: '🎯',
      price: 777
    }
  ];

  // Score and filter paths based on user pattern
  const scoredPaths = availablePaths.map(path => {
    let score = 0;
    
    // Category alignment
    const categoryMatch = path.categories.filter(cat => 
      userPattern.preferredCategories.includes(cat)
    ).length;
    score += categoryMatch * 25;
    
    // Difficulty alignment
    const difficultyMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const userLevel = difficultyMap[userPattern.spiritualStage as keyof typeof difficultyMap] || 1;
    const pathLevel = difficultyMap[path.difficulty];
    const difficultyScore = Math.max(0, 25 - Math.abs(userLevel - pathLevel) * 8);
    score += difficultyScore;
    
    // Challenge alignment
    if (userPattern.primaryChallenges.includes('emotional-healing') && path.id === 'emotional-healing-journey') {
      score += 30;
    }
    if (userPattern.primaryChallenges.includes('abundance') && path.id === 'manifestation-mastery') {
      score += 30;
    }
    if (userPattern.primaryChallenges.includes('clarity') && path.id === 'spiritual-foundation-building') {
      score += 30;
    }
    
    return { ...path, score };
  });

  // Return top 3 scored paths
  return scoredPaths
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...path }) => path);
}

async function generateLearningInsight(
  userPattern: any,
  recommendedPaths: PersonalizedGrowthPath[]
): Promise<AdaptiveLearningInsight> {
  try {
    const prompt = `As Vanessa DI, analyze this user's spiritual journey and provide personalized growth path insights:

User Pattern:
- Preferred categories: ${userPattern.preferredCategories.join(', ')}
- Spiritual stage: ${userPattern.spiritualStage}
- Primary challenges: ${userPattern.primaryChallenges.join(', ')}

Top recommended path: ${recommendedPaths[0]?.title}

Provide personalized insights in JSON format:
{
  "whyRecommended": "Personal reasoning for this path (2-3 sentences)",
  "nextActions": ["3 specific next steps they can take immediately"]
}

Use Vanessa's warm, spiritual voice with practical guidance.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      userPattern,
      recommendedPaths,
      whyRecommended: result.whyRecommended || "This path aligns beautifully with your current spiritual journey and growth needs.",
      nextActions: result.nextActions || [
        "Begin with daily spiritual practice",
        "Set clear intentions for your transformation",
        "Schedule time for sacred self-reflection"
      ]
    };
  } catch (error) {
    console.error('Error generating learning insight:', error);
    return {
      userPattern,
      recommendedPaths,
      whyRecommended: "This path has been carefully selected to support your unique spiritual evolution.",
      nextActions: [
        "Start with small daily practices",
        "Trust your intuitive guidance",
        "Create sacred space for growth"
      ]
    };
  }
}

function getDefaultLearningInsight(): AdaptiveLearningInsight {
  return {
    userPattern: {
      preferredCategories: ['life'],
      spiritualStage: 'beginner',
      interactionFrequency: 1,
      primaryChallenges: ['clarity']
    },
    recommendedPaths: [{
      id: 'spiritual-foundation-building',
      title: 'Spiritual Foundation & Daily Practice',
      description: 'Establish core spiritual practices and create connection to divine guidance',
      difficulty: 'beginner',
      estimatedDuration: '4 weeks',
      categories: ['figure-out', 'life'],
      personalizedReason: 'Perfect starting point for your spiritual journey',
      nextSteps: ['Morning practice', 'Meditation', 'Intuition development'],
      icon: '🕊️',
      price: 222
    }],
    whyRecommended: "This foundational path will establish your spiritual practice and create a strong base for growth.",
    nextActions: [
      "Begin with 10 minutes of daily meditation",
      "Set morning spiritual intentions",
      "Create sacred space in your home"
    ]
  };
}

// Helper function to get language name
function getLanguageName(languageCode: string): string {
  const languageNames: Record<string, string> = {
    'es': 'Spanish (Español)',
    'fr': 'French (Français)', 
    'de': 'German (Deutsch)',
    'it': 'Italian (Italiano)',
    'pt': 'Portuguese (Português)',
    'en': 'English'
  };
  return languageNames[languageCode] || 'English';
}

// Export adaptive learning function for use in routes
export { generateAdaptiveLearningInsights };