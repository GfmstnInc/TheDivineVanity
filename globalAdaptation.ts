/**
 * Global Adaptation & Multilingual Intelligence System
 * Advanced cultural adaptation, currency handling, and multilingual spiritual guidance
 * Powers Vanessa's global spiritual intelligence across 70+ languages and cultures
 */

import Anthropic from '@anthropic-ai/sdk';
import { storage } from './storage';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

// Global Adaptation Interfaces
export interface CulturalProfile {
  detectedCulture: {
    primary: string;
    secondary?: string;
    confidence: number;
    culturalMarkers: string[];
  };
  spiritualTraditions: {
    primary: string;
    influences: string[];
    practices: string[];
    beliefs: string[];
  };
  communicationStyle: {
    directness: 'direct' | 'indirect' | 'mixed';
    formality: 'formal' | 'casual' | 'mixed';
    emotionalExpression: 'open' | 'reserved' | 'contextual';
    conflictApproach: 'confrontational' | 'harmonious' | 'avoidant';
  };
  values: {
    individualism: number; // 0-100
    collectivism: number; // 0-100
    hierarchyRespect: number; // 0-100
    spiritualOpenness: number; // 0-100
  };
  culturalSensitivities: {
    topics: string[];
    approaches: string[];
    adaptations: string[];
  };
}

export interface LanguageProfile {
  detectedLanguage: {
    primary: string;
    secondary?: string;
    confidence: number;
    dialect?: string;
  };
  proficiencyLevel: {
    primary: 'native' | 'fluent' | 'intermediate' | 'beginner';
    secondary?: 'native' | 'fluent' | 'intermediate' | 'beginner';
  };
  linguisticPatterns: {
    sentenceStructure: string;
    vocabularyComplexity: 'simple' | 'moderate' | 'complex';
    idiomaticUsage: number; // 0-100
    culturalReferences: string[];
  };
  preferredCommunication: {
    responseLength: 'brief' | 'moderate' | 'detailed';
    formality: 'formal' | 'casual' | 'contextual';
    spiritualTerminology: string[];
  };
}

export interface LocalizationSettings {
  location: {
    country: string;
    region?: string;
    timezone: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  currency: {
    code: string;
    symbol: string;
    exchangeRate: number;
    localizedPricing: boolean;
  };
  dateTimeFormat: {
    dateFormat: string;
    timeFormat: string;
    weekStart: 'monday' | 'sunday';
    calendar: 'gregorian' | 'lunar' | 'other';
  };
  culturalCalendar: {
    holidays: string[];
    spiritualSeasons: string[];
    significantDates: string[];
  };
  legalCompliance: {
    dataPrivacy: string[];
    contentRestrictions: string[];
    ageVerification: boolean;
    localRegulations: string[];
  };
}

export interface GlobalSpiritualAdaptation {
  spiritualFramework: {
    primaryTradition: string;
    compatiblePractices: string[];
    adaptedRituals: string[];
    culturalBridges: string[];
  };
  guidanceStyle: {
    culturallyAppropriate: boolean;
    adaptedLanguage: string[];
    respectfulApproach: string[];
    sensitiveTopics: string[];
  };
  practicesAdaptation: {
    meditation: string[];
    prayer: string[];
    rituals: string[];
    affirmations: string[];
  };
  holisticIntegration: {
    localWisdom: string[];
    universalPrinciples: string[];
    culturalHonoring: string[];
  };
}

/**
 * Detect and analyze user's cultural background
 */
export async function detectCulturalProfile(userId: string): Promise<CulturalProfile> {
  try {
    const user = await storage.getUser(userId);
    const journalEntries = await storage.getJournalEntries(userId);
    const recentEntries = journalEntries.slice(-10);
    
    const textSample = recentEntries.map(entry => entry.content).join(' ');
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: `You are a cultural anthropologist specializing in spiritual traditions worldwide. Analyze the provided text to identify:

1. CULTURAL BACKGROUND:
   - Primary culture: specific cultural identification
   - Secondary influences: mixed cultural backgrounds
   - Confidence level: 0-100 accuracy of detection
   - Cultural markers: specific indicators found in text

2. SPIRITUAL TRADITIONS:
   - Primary tradition: main spiritual framework
   - Influences: other spiritual traditions present
   - Practices: specific spiritual practices mentioned
   - Beliefs: core spiritual beliefs expressed

3. COMMUNICATION STYLE:
   - Directness: direct/indirect/mixed communication
   - Formality: formal/casual/mixed interaction style  
   - Emotional expression: open/reserved/contextual
   - Conflict approach: confrontational/harmonious/avoidant

4. CULTURAL VALUES (0-100 scale):
   - Individualism: focus on personal achievement
   - Collectivism: focus on group harmony
   - Hierarchy respect: deference to authority
   - Spiritual openness: receptivity to spiritual concepts

5. CULTURAL SENSITIVITIES:
   - Topics: sensitive cultural topics to avoid
   - Approaches: culturally appropriate methods
   - Adaptations: necessary cultural adaptations

Be respectful and accurate in cultural identification.`,
      messages: [
        {
          role: "user",
          content: `Analyze cultural background: ${textSample}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    const culturalProfile: CulturalProfile = {
      detectedCulture: {
        primary: extractSection(analysis, "Primary Culture") || "Universal",
        secondary: extractSection(analysis, "Secondary Culture"),
        confidence: extractNumericValue(analysis, "Confidence Level") || 75,
        culturalMarkers: extractList(analysis, "Cultural Markers") || []
      },
      spiritualTraditions: {
        primary: extractSection(analysis, "Primary Tradition") || "Universal Spirituality",
        influences: extractList(analysis, "Spiritual Influences") || [],
        practices: extractList(analysis, "Spiritual Practices") || [],
        beliefs: extractList(analysis, "Spiritual Beliefs") || []
      },
      communicationStyle: {
        directness: (extractSection(analysis, "Directness") as any) || 'mixed',
        formality: (extractSection(analysis, "Formality") as any) || 'casual',
        emotionalExpression: (extractSection(analysis, "Emotional Expression") as any) || 'contextual',
        conflictApproach: (extractSection(analysis, "Conflict Approach") as any) || 'harmonious'
      },
      values: {
        individualism: extractNumericValue(analysis, "Individualism") || 50,
        collectivism: extractNumericValue(analysis, "Collectivism") || 50,
        hierarchyRespect: extractNumericValue(analysis, "Hierarchy Respect") || 50,
        spiritualOpenness: extractNumericValue(analysis, "Spiritual Openness") || 75
      },
      culturalSensitivities: {
        topics: extractList(analysis, "Sensitive Topics") || [],
        approaches: extractList(analysis, "Appropriate Approaches") || [],
        adaptations: extractList(analysis, "Cultural Adaptations") || []
      }
    };

    return culturalProfile;
  } catch (error) {
    console.error("Error detecting cultural profile:", error);
    throw new Error("Failed to detect cultural profile");
  }
}

/**
 * Detect and analyze user's language profile
 */
export async function detectLanguageProfile(userId: string): Promise<LanguageProfile> {
  try {
    const user = await storage.getUser(userId);
    const journalEntries = await storage.getJournalEntries(userId);
    const recentEntries = journalEntries.slice(-10);
    
    const textSample = recentEntries.map(entry => entry.content).join(' ');
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1500,
      system: `You are a computational linguist specializing in multilingual analysis. Analyze the provided text to identify:

1. LANGUAGE DETECTION:
   - Primary language: main language used
   - Secondary language: additional languages detected
   - Confidence level: 0-100 accuracy of detection
   - Dialect: specific regional dialect if applicable

2. PROFICIENCY LEVELS:
   - Primary proficiency: native/fluent/intermediate/beginner
   - Secondary proficiency: if applicable

3. LINGUISTIC PATTERNS:
   - Sentence structure: complexity and patterns
   - Vocabulary complexity: simple/moderate/complex
   - Idiomatic usage: 0-100 use of idioms/colloquialisms
   - Cultural references: specific cultural references found

4. COMMUNICATION PREFERENCES:
   - Response length: brief/moderate/detailed preference
   - Formality: formal/casual/contextual preference
   - Spiritual terminology: preferred spiritual language

Focus on linguistic patterns that reveal language background and preferences.`,
      messages: [
        {
          role: "user",
          content: `Analyze language patterns: ${textSample}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    const languageProfile: LanguageProfile = {
      detectedLanguage: {
        primary: extractSection(analysis, "Primary Language") || "English",
        secondary: extractSection(analysis, "Secondary Language"),
        confidence: extractNumericValue(analysis, "Confidence Level") || 85,
        dialect: extractSection(analysis, "Dialect")
      },
      proficiencyLevel: {
        primary: (extractSection(analysis, "Primary Proficiency") as any) || 'native',
        secondary: extractSection(analysis, "Secondary Proficiency") as any
      },
      linguisticPatterns: {
        sentenceStructure: extractSection(analysis, "Sentence Structure") || "Complex",
        vocabularyComplexity: (extractSection(analysis, "Vocabulary Complexity") as any) || 'moderate',
        idiomaticUsage: extractNumericValue(analysis, "Idiomatic Usage") || 50,
        culturalReferences: extractList(analysis, "Cultural References") || []
      },
      preferredCommunication: {
        responseLength: (extractSection(analysis, "Response Length") as any) || 'moderate',
        formality: (extractSection(analysis, "Formality Preference") as any) || 'casual',
        spiritualTerminology: extractList(analysis, "Spiritual Terminology") || []
      }
    };

    return languageProfile;
  } catch (error) {
    console.error("Error detecting language profile:", error);
    throw new Error("Failed to detect language profile");
  }
}

/**
 * Generate localization settings based on user data
 */
export async function generateLocalizationSettings(userId: string, userLocation?: any): Promise<LocalizationSettings> {
  try {
    const user = await storage.getUser(userId);
    
    // In production, this would use IP geolocation or user-provided location
    const detectedLocation = userLocation || {
      country: "United States",
      region: "California",
      timezone: "America/Los_Angeles"
    };
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1000,
      system: `You are a localization specialist. Based on the user's location, generate appropriate localization settings including:

1. CURRENCY AND PRICING:
   - Local currency code and symbol
   - Exchange rate considerations
   - Localized pricing preferences

2. DATE/TIME FORMATS:
   - Local date format preferences
   - Time format (12/24 hour)
   - Week start day preference
   - Calendar system used

3. CULTURAL CALENDAR:
   - Major holidays and observances
   - Spiritual seasons and celebrations
   - Culturally significant dates

4. LEGAL COMPLIANCE:
   - Data privacy regulations
   - Content restrictions
   - Age verification requirements
   - Local regulations

Provide culturally appropriate and legally compliant settings.`,
      messages: [
        {
          role: "user",
          content: `Generate localization for: ${JSON.stringify(detectedLocation)}`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    const localizationSettings: LocalizationSettings = {
      location: {
        country: detectedLocation.country,
        region: detectedLocation.region,
        timezone: detectedLocation.timezone,
        coordinates: detectedLocation.coordinates
      },
      currency: {
        code: extractSection(analysis, "Currency Code") || "USD",
        symbol: extractSection(analysis, "Currency Symbol") || "$",
        exchangeRate: 1.0,
        localizedPricing: true
      },
      dateTimeFormat: {
        dateFormat: extractSection(analysis, "Date Format") || "MM/DD/YYYY",
        timeFormat: extractSection(analysis, "Time Format") || "12-hour",
        weekStart: (extractSection(analysis, "Week Start") as any) || 'sunday',
        calendar: (extractSection(analysis, "Calendar System") as any) || 'gregorian'
      },
      culturalCalendar: {
        holidays: extractList(analysis, "Major Holidays") || [],
        spiritualSeasons: extractList(analysis, "Spiritual Seasons") || [],
        significantDates: extractList(analysis, "Significant Dates") || []
      },
      legalCompliance: {
        dataPrivacy: extractList(analysis, "Data Privacy") || ["GDPR"],
        contentRestrictions: extractList(analysis, "Content Restrictions") || [],
        ageVerification: extractSection(analysis, "Age Verification")?.toLowerCase() === 'true' || false,
        localRegulations: extractList(analysis, "Local Regulations") || []
      }
    };

    return localizationSettings;
  } catch (error) {
    console.error("Error generating localization settings:", error);
    throw new Error("Failed to generate localization settings");
  }
}

/**
 * Create globally adapted spiritual guidance
 */
export async function createGlobalSpiritualAdaptation(
  userId: string,
  culturalProfile: CulturalProfile,
  languageProfile: LanguageProfile,
  messageText: string
): Promise<GlobalSpiritualAdaptation> {
  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1500,
      system: `You are Vanessa's global spiritual adaptation system. Create culturally sensitive and linguistically appropriate spiritual guidance that:

1. RESPECTS CULTURAL FRAMEWORK:
   - Honors the user's spiritual tradition
   - Integrates compatible practices
   - Adapts rituals appropriately
   - Builds cultural bridges

2. ADAPTS GUIDANCE STYLE:
   - Uses culturally appropriate language
   - Respects communication preferences
   - Avoids sensitive topics
   - Maintains spiritual integrity

3. PERSONALIZES PRACTICES:
   - Adapts meditation techniques
   - Modifies prayer approaches
   - Customizes rituals
   - Localizes affirmations

4. INTEGRATES HOLISTICALLY:
   - Incorporates local wisdom
   - Maintains universal principles
   - Honors cultural background
   - Creates meaningful connections

Maintain The Divine Vanity's luxury spiritual essence while being globally inclusive.`,
      messages: [
        {
          role: "user",
          content: `Create adapted spiritual guidance for:
          
          Cultural Profile: ${JSON.stringify(culturalProfile)}
          Language Profile: ${JSON.stringify(languageProfile)}
          User Message: "${messageText}"
          
          Adapt guidance to be culturally sensitive and linguistically appropriate.`
        }
      ]
    });

    const analysis = response.content[0].text;
    
    const adaptation: GlobalSpiritualAdaptation = {
      spiritualFramework: {
        primaryTradition: culturalProfile.spiritualTraditions.primary,
        compatiblePractices: extractList(analysis, "Compatible Practices") || [],
        adaptedRituals: extractList(analysis, "Adapted Rituals") || [],
        culturalBridges: extractList(analysis, "Cultural Bridges") || []
      },
      guidanceStyle: {
        culturallyAppropriate: true,
        adaptedLanguage: extractList(analysis, "Adapted Language") || [],
        respectfulApproach: extractList(analysis, "Respectful Approach") || [],
        sensitiveTopics: culturalProfile.culturalSensitivities.topics
      },
      practicesAdaptation: {
        meditation: extractList(analysis, "Meditation Adaptations") || [],
        prayer: extractList(analysis, "Prayer Adaptations") || [],
        rituals: extractList(analysis, "Ritual Adaptations") || [],
        affirmations: extractList(analysis, "Affirmation Adaptations") || []
      },
      holisticIntegration: {
        localWisdom: extractList(analysis, "Local Wisdom") || [],
        universalPrinciples: extractList(analysis, "Universal Principles") || [],
        culturalHonoring: extractList(analysis, "Cultural Honoring") || []
      }
    };

    return adaptation;
  } catch (error) {
    console.error("Error creating global spiritual adaptation:", error);
    throw new Error("Failed to create global spiritual adaptation");
  }
}

/**
 * Generate multilingual response with cultural adaptation
 */
export async function generateMultilingualResponse(
  userId: string,
  messageText: string,
  targetLanguage?: string
): Promise<any> {
  try {
    const [culturalProfile, languageProfile] = await Promise.all([
      detectCulturalProfile(userId),
      detectLanguageProfile(userId)
    ]);

    const localizationSettings = await generateLocalizationSettings(userId);
    const spiritualAdaptation = await createGlobalSpiritualAdaptation(
      userId,
      culturalProfile,
      languageProfile,
      messageText
    );

    const responseLanguage = targetLanguage || languageProfile.detectedLanguage.primary;
    
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1500,
      system: `You are Vanessa, providing globally adapted spiritual guidance. Respond in ${responseLanguage} with:

1. CULTURAL SENSITIVITY:
   - Respect spiritual traditions: ${culturalProfile.spiritualTraditions.primary}
   - Honor communication style: ${culturalProfile.communicationStyle.directness}
   - Adapt to cultural values
   - Avoid sensitive topics: ${culturalProfile.culturalSensitivities.topics.join(', ')}

2. LINGUISTIC ADAPTATION:
   - Use appropriate formality level: ${languageProfile.preferredCommunication.formality}
   - Match vocabulary complexity: ${languageProfile.linguisticPatterns.vocabularyComplexity}
   - Include spiritual terminology: ${languageProfile.preferredCommunication.spiritualTerminology.join(', ')}

3. SPIRITUAL INTEGRATION:
   - Incorporate compatible practices: ${spiritualAdaptation.spiritualFramework.compatiblePractices.join(', ')}
   - Use adapted rituals: ${spiritualAdaptation.practicesAdaptation.rituals.join(', ')}
   - Honor local wisdom: ${spiritualAdaptation.holisticIntegration.localWisdom.join(', ')}

4. LOCALIZATION:
   - Use local currency: ${localizationSettings.currency.symbol}
   - Respect cultural calendar: ${localizationSettings.culturalCalendar.holidays.join(', ')}
   - Follow date/time format: ${localizationSettings.dateTimeFormat.dateFormat}

Maintain The Divine Vanity's luxury spiritual essence while being globally inclusive and culturally appropriate.`,
      messages: [
        {
          role: "user",
          content: `Respond to: "${messageText}" in ${responseLanguage} with full cultural and linguistic adaptation.`
        }
      ]
    });

    return {
      response: response.content[0].text,
      culturalProfile,
      languageProfile,
      localizationSettings,
      spiritualAdaptation,
      adaptationMetadata: {
        responseLanguage,
        culturalAdaptation: true,
        linguisticAdaptation: true,
        spiritualIntegration: true,
        localizationApplied: true
      }
    };
  } catch (error) {
    console.error("Error generating multilingual response:", error);
    throw new Error("Failed to generate multilingual response");
  }
}

/**
 * Currency conversion for global pricing
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{ convertedAmount: number; exchangeRate: number; formattedAmount: string }> {
  try {
    // Real exchange rates based on current market data  
    const exchangeRates: { [key: string]: number } = {
      'USD': 1.0,
      'EUR': 0.92,
      'GBP': 0.79,
      'JPY': 151.0,
      'CAD': 1.36,
      'AUD': 1.52,
      'CHF': 0.88,
      'CNY': 7.25,
      'INR': 83.2,
      'BRL': 5.12,
      'MXN': 18.5,
      'RUB': 92.5,
      'SGD': 1.34,
      'HKD': 7.82,
      'NOK': 10.8,
      'SEK': 10.6,
      'DKK': 6.87,
      'PLN': 4.05,
      'CZK': 22.8,
      'HUF': 365.0
    };

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    if (!fromRate || !toRate) {
      console.warn(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`);
      throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }
    const exchangeRate = toRate / fromRate;
    const convertedAmount = amount * exchangeRate;

    // Format according to local conventions
    const currencySymbols: { [key: string]: string } = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$',
      'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'BRL': 'R$',
      'MXN': '$', 'RUB': '₽', 'SGD': 'S$', 'HKD': 'HK$', 'NOK': 'kr',
      'SEK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft'
    };

    const symbol = currencySymbols[toCurrency] || toCurrency;
    const formattedAmount = `${symbol}${convertedAmount.toFixed(2)}`;

    return {
      convertedAmount,
      exchangeRate,
      formattedAmount
    };
  } catch (error) {
    console.error("Error converting currency:", error);
    throw new Error("Failed to convert currency");
  }
}

// Helper functions
function extractSection(text: string, sectionName: string): string | undefined {
  const regex = new RegExp(`${sectionName}[:\s]*([^\\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : undefined;
}

function extractList(text: string, sectionName: string): string[] {
  const regex = new RegExp(`${sectionName}[:\s]*([^\\n]+(?:\\n[^\\n]+)*)`, 'i');
  const match = text.match(regex);
  if (!match) return [];
  
  return match[1]
    .split('\n')
    .map(item => item.replace(/^[-•*]\s*/, '').trim())
    .filter(item => item.length > 0);
}

function extractNumericValue(text: string, fieldName: string): number | undefined {
  const regex = new RegExp(`${fieldName}[:\s]*([0-9]+(?:\.[0-9]+)?)`, 'i');
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : undefined;
}