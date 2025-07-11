/**
 * AI-Powered Translation Service for Global Divine Vanity Platform
 * Provides intelligent spiritual translation across 72+ languages
 */

import { Language } from '@/contexts/LanguageContext';

interface TranslationRequest {
  text: string;
  targetLanguage: Language;
  sourceLanguage?: Language;
  context?: 'spiritual' | 'navigation' | 'general' | 'ritual' | 'divine';
}

interface TranslationResponse {
  translatedText: string;
  confidence: number;
  culturalAdaptation?: string;
  spiritualContext?: string;
}

/**
 * Enhanced AI Translation Service with Spiritual Context
 */
export class AITranslationService {
  private cache = new Map<string, TranslationResponse>();
  private supportedLanguages: Set<Language>;

  constructor() {
    // Initialize with all supported languages
    this.supportedLanguages = new Set([
      'en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru',
      'nl', 'sv', 'no', 'da', 'fi', 'pl', 'tr', 'th', 'vi', 'he', 'el', 'cs',
      'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'uk', 'be', 'mk',
      'sr', 'bs', 'mt', 'is', 'ga', 'cy', 'eu', 'ca', 'gl', 'id', 'ms', 'tl',
      'sw', 'am', 'zu', 'xh', 'af', 'ur', 'fa', 'bn', 'ta', 'te', 'ml', 'kn',
      'gu', 'pa', 'mr', 'or', 'as', 'ne', 'si', 'my', 'km', 'lo', 'ka', 'hy',
      'az', 'kk', 'ky', 'uz', 'tg', 'tk', 'mn'
    ]);
  }

  /**
   * Translate text with spiritual context and cultural adaptation
   */
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const cacheKey = `${request.text}-${request.targetLanguage}-${request.context}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const spiritualPrompt = this.buildSpiritualTranslationPrompt(request);
      
      // Use existing AI infrastructure for translation
      const translatedText = await this.callAITranslation(spiritualPrompt, request);
      
      const response: TranslationResponse = {
        translatedText,
        confidence: 0.95, // High confidence with AI translation
        culturalAdaptation: await this.getCulturalAdaptation(request.targetLanguage),
        spiritualContext: this.getSpiritualContext(request.context)
      };

      // Cache the result
      this.cache.set(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('AI Translation failed:', error);
      
      // Fallback to basic translation
      return {
        translatedText: request.text,
        confidence: 0.1,
        culturalAdaptation: 'Using fallback translation'
      };
    }
  }

  /**
   * Build spiritual context-aware translation prompt
   */
  private buildSpiritualTranslationPrompt(request: TranslationRequest): string {
    const languageMap: Record<Language, string> = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
      'zh': 'Chinese (Simplified)', 'ja': 'Japanese', 'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi', 'ru': 'Russian',
      'nl': 'Dutch', 'sv': 'Swedish', 'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish', 'pl': 'Polish',
      'tr': 'Turkish', 'th': 'Thai', 'vi': 'Vietnamese', 'he': 'Hebrew', 'el': 'Greek', 'cs': 'Czech',
      'hu': 'Hungarian', 'ro': 'Romanian', 'bg': 'Bulgarian', 'hr': 'Croatian', 'sk': 'Slovak', 'sl': 'Slovenian',
      'et': 'Estonian', 'lv': 'Latvian', 'lt': 'Lithuanian', 'uk': 'Ukrainian', 'be': 'Belarusian', 'mk': 'Macedonian',
      'sr': 'Serbian', 'bs': 'Bosnian', 'mt': 'Maltese', 'is': 'Icelandic', 'ga': 'Irish', 'cy': 'Welsh',
      'eu': 'Basque', 'ca': 'Catalan', 'gl': 'Galician', 'id': 'Indonesian', 'ms': 'Malay', 'tl': 'Filipino',
      'sw': 'Swahili', 'am': 'Amharic', 'zu': 'Zulu', 'xh': 'Xhosa', 'af': 'Afrikaans', 'ur': 'Urdu',
      'fa': 'Persian', 'bn': 'Bengali', 'ta': 'Tamil', 'te': 'Telugu', 'ml': 'Malayalam', 'kn': 'Kannada',
      'gu': 'Gujarati', 'pa': 'Punjabi', 'mr': 'Marathi', 'or': 'Odia', 'as': 'Assamese', 'ne': 'Nepali',
      'si': 'Sinhala', 'my': 'Myanmar', 'km': 'Khmer', 'lo': 'Lao', 'ka': 'Georgian', 'hy': 'Armenian',
      'az': 'Azerbaijani', 'kk': 'Kazakh', 'ky': 'Kyrgyz', 'uz': 'Uzbek', 'tg': 'Tajik', 'tk': 'Turkmen', 'mn': 'Mongolian'
    };

    const targetLanguageName = languageMap[request.targetLanguage] || request.targetLanguage;
    
    return `
You are a divine spiritual translator specializing in sacred, healing, and empowerment content for The Divine Vanity platform.

TRANSLATION TASK:
- Translate this ${request.context || 'spiritual'} text from English to ${targetLanguageName}
- Maintain the sacred, empowering, and luxurious tone
- Adapt to cultural spiritual traditions respectfully
- Preserve the divine feminine energy and healing intention

TEXT TO TRANSLATE: "${request.text}"

CONTEXT: ${this.getSpiritualContext(request.context)}

REQUIREMENTS:
1. Use respectful, elevated language that honors spiritual traditions
2. Maintain the empowering tone for high-achieving women
3. Adapt sacred concepts to local spiritual understanding
4. Preserve the healing and transformation intention
5. Use culturally appropriate spiritual terminology

Respond ONLY with the translated text, no explanations.
    `.trim();
  }

  /**
   * Call AI translation service using existing infrastructure
   */
  private async callAITranslation(prompt: string, request: TranslationRequest): Promise<string> {
    try {
      // Use OpenAI for translation (can be enhanced with other AI providers)
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          temperature: 0.3, // Lower temperature for consistent translations
          maxTokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('AI translation request failed');
      }

      const data = await response.json();
      return data.response || request.text;
    } catch (error) {
      console.error('AI translation API call failed:', error);
      throw error;
    }
  }

  /**
   * Get cultural adaptation notes for target language
   */
  private async getCulturalAdaptation(language: Language): Promise<string> {
    const culturalNotes: Record<string, string> = {
      'zh': 'Adapted for Chinese spiritual traditions with emphasis on harmony and balance',
      'ja': 'Incorporated Japanese concepts of mindfulness and spiritual purity',
      'ko': 'Aligned with Korean cultural values of respect and spiritual growth',
      'ar': 'Respectfully adapted for Arabic-speaking cultures with universal spiritual principles',
      'hi': 'Integrated with Hindu/Buddhist spiritual concepts while maintaining universal appeal',
      'th': 'Adapted for Thai Buddhist cultural context with emphasis on compassion',
      'vi': 'Culturally sensitive to Vietnamese spiritual traditions',
      'he': 'Respectfully adapted for Hebrew-speaking audiences with universal spiritual wisdom'
    };

    return culturalNotes[language] || 'Culturally adapted for universal spiritual accessibility';
  }

  /**
   * Get spiritual context description
   */
  private getSpiritualContext(context?: string): string {
    const contexts = {
      'spiritual': 'Sacred spiritual guidance and healing content',
      'navigation': 'Platform navigation and user interface elements',
      'general': 'General platform content and messaging',
      'ritual': 'Sacred ritual instructions and spiritual practices',
      'divine': 'Divine feminine empowerment and transformation content'
    };

    return contexts[context as keyof typeof contexts] || 'General spiritual platform content';
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(texts: string[], targetLanguage: Language, context?: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    for (const text of texts) {
      try {
        const response = await this.translateText({
          text,
          targetLanguage,
          context: context as any
        });
        results[text] = response.translatedText;
      } catch (error) {
        console.error(`Failed to translate "${text}":`, error);
        results[text] = text; // Fallback to original
      }
    }

    return results;
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(language: Language): boolean {
    return this.supportedLanguages.has(language);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): Language[] {
    return Array.from(this.supportedLanguages);
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const aiTranslationService = new AITranslationService();