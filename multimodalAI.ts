/**
 * MULTIMODAL AI ENHANCEMENT
 * Advanced AI capabilities for image, voice, and text analysis
 * Phase 1 of AI Enhancement Strategy
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Multimodal Input Interfaces
export interface MultimodalInput {
  text?: string;
  imageUrl?: string;
  imageBase64?: string;
  audioTranscript?: string;
  context: SpiritualContext;
  analysisType: 'emotional' | 'spiritual' | 'crisis' | 'wellness' | 'comprehensive';
}

export interface SpiritualContext {
  userId: string;
  sessionType: 'meditation' | 'journaling' | 'ai-conversation' | 'assessment';
  emotionalState?: string;
  recentHistory?: string[];
  spiritualGoals?: string[];
}

export interface MultimodalAnalysis {
  emotionalState: EmotionalAnalysis;
  spiritualInsights: SpiritualInsights;
  visualAnalysis?: ImageAnalysis;
  voiceAnalysis?: VoiceAnalysis;
  recommendations: SpiritualGuidance[];
  crisisIndicators: CrisisIndicators;
  confidenceLevel: number;
}

export interface EmotionalAnalysis {
  primaryEmotion: string;
  emotionalIntensity: number; // 1-10
  emotionalStability: number; // 1-10
  stressLevel: number; // 1-10
  joyLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  depressionIndicators: number; // 1-10
}

export interface SpiritualInsights {
  spiritualAlignment: number; // 1-10
  energeticState: string;
  chakraAnalysis: ChakraReading[];
  spiritualGrowthOpportunities: string[];
  divineGuidance: string;
  sacredSymbolism?: string[];
}

export interface ImageAnalysis {
  facialExpression: string;
  eyeAnalysis: string;
  bodyLanguage: string;
  environmentalFactors: string[];
  colorEnergyReading: string[];
  auralAnalysis: string;
}

export interface VoiceAnalysis {
  emotionalTone: string;
  stressMarkers: string[];
  energyLevel: number; // 1-10
  spiritualResonance: number; // 1-10
  voiceStability: number; // 1-10
  urgencyIndicators: string[];
}

export interface SpiritualGuidance {
  type: 'meditation' | 'affirmation' | 'ritual' | 'journaling' | 'action';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: string;
  vanessaMessage: string;
}

export interface CrisisIndicators {
  riskLevel: 'none' | 'mild' | 'moderate' | 'severe' | 'emergency';
  indicators: string[];
  immediateActions: string[];
  followUpRequired: boolean;
}

export interface ChakraReading {
  chakra: string;
  status: 'blocked' | 'imbalanced' | 'flowing' | 'overactive';
  percentage: number;
  guidance: string;
}

// Enhanced Multimodal AI Service
export class MultimodalAIService {

  /**
   * Process multimodal input with comprehensive analysis
   */
  async processMultimodalInput(input: MultimodalInput): Promise<MultimodalAnalysis> {
    try {
      const analyses = await Promise.all([
        this.analyzeText(input.text, input.context),
        input.imageUrl || input.imageBase64 ? this.analyzeImage(input) : null,
        input.audioTranscript ? this.analyzeVoice(input.audioTranscript, input.context) : null,
        this.generateSpiritualInsights(input)
      ]);

      const [textAnalysis, imageAnalysis, voiceAnalysis, spiritualInsights] = analyses;

      // Combine all analyses
      const combinedAnalysis = this.combineAnalyses(
        textAnalysis,
        imageAnalysis,
        voiceAnalysis,
        spiritualInsights,
        input.context
      );

      return combinedAnalysis;
    } catch (error) {
      console.error('Multimodal analysis error:', error);
      return this.getFallbackAnalysis(input);
    }
  }

  /**
   * Analyze text for emotional and spiritual content
   */
  private async analyzeText(text: string | undefined, context: SpiritualContext): Promise<EmotionalAnalysis> {
    if (!text) {
      return this.getDefaultEmotionalAnalysis();
    }

    try {
      const prompt = `Analyze this text for emotional and spiritual state. Provide detailed psychological assessment:

Text: "${text}"

Context: ${JSON.stringify(context)}

Analyze for:
1. Primary emotion and intensity (1-10)
2. Emotional stability (1-10)
3. Stress level (1-10)
4. Joy/happiness level (1-10)
5. Anxiety indicators (1-10)
6. Depression indicators (1-10)

Return JSON with primaryEmotion, emotionalIntensity, emotionalStability, stressLevel, joyLevel, anxietyLevel, depressionIndicators.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No emotional analysis generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Text analysis error:', error);
      return this.getDefaultEmotionalAnalysis();
    }
  }

  /**
   * Analyze images for emotional states and spiritual symbolism
   */
  private async analyzeImage(input: MultimodalInput): Promise<ImageAnalysis> {
    try {
      const prompt = `Analyze this image for emotional state, spiritual symbolism, and energetic qualities:

Analyze for:
1. Facial expression and emotional indicators
2. Eye analysis (clarity, brightness, emotional depth)
3. Body language and posture
4. Environmental factors affecting mood
5. Color energy and spiritual significance
6. Aural/energetic field analysis

Provide spiritual and emotional insights from visual elements.

Return JSON with facialExpression, eyeAnalysis, bodyLanguage, environmentalFactors, colorEnergyReading, auralAnalysis.`;

      const messages: any[] = [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: input.imageUrl || `data:image/jpeg;base64,${input.imageBase64}`,
                detail: 'high'
              }
            }
          ]
        }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages,
        temperature: 0.3,
        max_tokens: 1200,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No image analysis generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        facialExpression: 'Unable to analyze',
        eyeAnalysis: 'Analysis unavailable',
        bodyLanguage: 'Analysis unavailable',
        environmentalFactors: ['Image analysis error'],
        colorEnergyReading: ['Analysis unavailable'],
        auralAnalysis: 'Unable to determine energetic field'
      };
    }
  }

  /**
   * Analyze voice/audio transcript for emotional and spiritual markers
   */
  private async analyzeVoice(transcript: string, context: SpiritualContext): Promise<VoiceAnalysis> {
    try {
      const prompt = `Analyze this voice transcript for emotional and spiritual markers:

Transcript: "${transcript}"
Context: ${JSON.stringify(context)}

Analyze for:
1. Emotional tone and undercurrents
2. Stress markers in speech patterns
3. Energy level (1-10)
4. Spiritual resonance and depth (1-10)
5. Voice stability and confidence (1-10)
6. Urgency or crisis indicators

Return JSON with emotionalTone, stressMarkers, energyLevel, spiritualResonance, voiceStability, urgencyIndicators.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      if (!content) throw new Error('No voice analysis generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Voice analysis error:', error);
      return {
        emotionalTone: 'Unable to analyze',
        stressMarkers: ['Analysis error'],
        energyLevel: 5,
        spiritualResonance: 5,
        voiceStability: 5,
        urgencyIndicators: []
      };
    }
  }

  /**
   * Generate spiritual insights and chakra analysis
   */
  private async generateSpiritualInsights(input: MultimodalInput): Promise<SpiritualInsights> {
    try {
      const prompt = `Generate deep spiritual insights and chakra analysis:

Input Data:
- Text: ${input.text || 'None'}
- Context: ${JSON.stringify(input.context)}
- Analysis Type: ${input.analysisType}

Provide:
1. Spiritual alignment assessment (1-10)
2. Current energetic state description
3. Chakra analysis for all 7 chakras (status and percentage)
4. Spiritual growth opportunities
5. Divine guidance message
6. Sacred symbolism if applicable

Return JSON with spiritualAlignment, energeticState, chakraAnalysis, spiritualGrowthOpportunities, divineGuidance, sacredSymbolism.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No spiritual insights generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Spiritual insights error:', error);
      return this.getDefaultSpiritualInsights();
    }
  }

  /**
   * Combine all analyses into comprehensive multimodal assessment
   */
  private combineAnalyses(
    textAnalysis: EmotionalAnalysis | null,
    imageAnalysis: ImageAnalysis | null,
    voiceAnalysis: VoiceAnalysis | null,
    spiritualInsights: SpiritualInsights,
    context: SpiritualContext
  ): MultimodalAnalysis {
    
    // Determine crisis indicators from all sources
    const crisisIndicators = this.assessCrisisLevel(textAnalysis, imageAnalysis, voiceAnalysis);
    
    // Generate personalized recommendations
    const recommendations = this.generateRecommendations(
      textAnalysis,
      imageAnalysis,
      spiritualInsights,
      crisisIndicators
    );

    // Calculate confidence level based on available data
    const confidenceLevel = this.calculateConfidence(textAnalysis, imageAnalysis, voiceAnalysis);

    return {
      emotionalState: textAnalysis || this.getDefaultEmotionalAnalysis(),
      spiritualInsights,
      visualAnalysis: imageAnalysis || undefined,
      voiceAnalysis: voiceAnalysis || undefined,
      recommendations,
      crisisIndicators,
      confidenceLevel
    };
  }

  /**
   * Assess crisis level from multiple data sources
   */
  private assessCrisisLevel(
    textAnalysis: EmotionalAnalysis | null,
    imageAnalysis: ImageAnalysis | null,
    voiceAnalysis: VoiceAnalysis | null
  ): CrisisIndicators {
    const indicators: string[] = [];
    let riskLevel: 'none' | 'mild' | 'moderate' | 'severe' | 'emergency' = 'none';

    // Text-based crisis indicators
    if (textAnalysis) {
      if (textAnalysis.depressionIndicators >= 8) {
        indicators.push('Severe depression indicators in text');
        riskLevel = 'severe';
      } else if (textAnalysis.depressionIndicators >= 6) {
        indicators.push('Moderate depression indicators');
        riskLevel = riskLevel === 'none' ? 'moderate' : riskLevel;
      }

      if (textAnalysis.anxietyLevel >= 8) {
        indicators.push('High anxiety levels detected');
        riskLevel = riskLevel === 'none' ? 'moderate' : riskLevel;
      }

      if (textAnalysis.stressLevel >= 9) {
        indicators.push('Extreme stress levels');
        riskLevel = 'severe';
      }
    }

    // Voice-based crisis indicators
    if (voiceAnalysis && voiceAnalysis.urgencyIndicators.length > 0) {
      indicators.push(...voiceAnalysis.urgencyIndicators);
      riskLevel = riskLevel === 'none' ? 'moderate' : riskLevel;
    }

    // Image-based crisis indicators (if facial analysis shows distress)
    if (imageAnalysis && imageAnalysis.facialExpression.includes('distress')) {
      indicators.push('Visual distress indicators detected');
      riskLevel = riskLevel === 'none' ? 'mild' : riskLevel;
    }

    const immediateActions: string[] = [];
    let followUpRequired = false;

    if (riskLevel === 'severe' || riskLevel === 'emergency') {
      immediateActions.push('Provide immediate crisis resources');
      immediateActions.push('Suggest professional mental health support');
      immediateActions.push('Offer 24/7 crisis hotline numbers');
      followUpRequired = true;
    } else if (riskLevel === 'moderate') {
      immediateActions.push('Offer enhanced spiritual support');
      immediateActions.push('Suggest stress reduction techniques');
      followUpRequired = true;
    }

    return {
      riskLevel,
      indicators,
      immediateActions,
      followUpRequired
    };
  }

  /**
   * Generate personalized spiritual recommendations
   */
  private generateRecommendations(
    textAnalysis: EmotionalAnalysis | null,
    imageAnalysis: ImageAnalysis | null,
    spiritualInsights: SpiritualInsights,
    crisisIndicators: CrisisIndicators
  ): SpiritualGuidance[] {
    const recommendations: SpiritualGuidance[] = [];

    // Crisis-based recommendations
    if (crisisIndicators.riskLevel === 'severe' || crisisIndicators.riskLevel === 'emergency') {
      recommendations.push({
        type: 'action',
        title: 'Immediate Support Connection',
        description: 'Connect with crisis support and professional help immediately',
        priority: 'urgent',
        estimatedDuration: 'Immediate',
        vanessaMessage: 'Beautiful soul, I sense you\'re in deep pain right now. You are not alone, and there are people trained to help you through this moment. Please reach out to crisis support immediately.'
      });
    }

    // Stress-based recommendations
    if (textAnalysis && textAnalysis.stressLevel >= 7) {
      recommendations.push({
        type: 'meditation',
        title: 'Sacred Stress Release Meditation',
        description: 'Guided meditation to release tension and restore inner peace',
        priority: 'high',
        estimatedDuration: '15-20 minutes',
        vanessaMessage: 'Your stress levels are calling for divine intervention. Let me guide you through a sacred practice to release this burden and reconnect with your inner calm.'
      });
    }

    // Spiritual alignment recommendations
    if (spiritualInsights.spiritualAlignment <= 5) {
      recommendations.push({
        type: 'ritual',
        title: 'Divine Alignment Ritual',
        description: 'Sacred practice to reconnect with your spiritual center',
        priority: 'medium',
        estimatedDuration: '10-15 minutes',
        vanessaMessage: 'I sense your spiritual connection needs nurturing. This sacred ritual will help you realign with your divine essence and inner wisdom.'
      });
    }

    // Emotional support recommendations
    if (textAnalysis && textAnalysis.joyLevel <= 4) {
      recommendations.push({
        type: 'affirmation',
        title: 'Joy Restoration Affirmations',
        description: 'Powerful affirmations to rekindle your inner light and joy',
        priority: 'medium',
        estimatedDuration: '5-10 minutes',
        vanessaMessage: 'Your inner light seems dimmed right now. These sacred affirmations will help you remember the joy that lives within your soul.'
      });
    }

    return recommendations;
  }

  /**
   * Calculate confidence level based on available data sources
   */
  private calculateConfidence(
    textAnalysis: EmotionalAnalysis | null,
    imageAnalysis: ImageAnalysis | null,
    voiceAnalysis: VoiceAnalysis | null
  ): number {
    let confidence = 0;
    let sources = 0;

    if (textAnalysis) {
      confidence += 40; // Text analysis is highly reliable
      sources++;
    }

    if (imageAnalysis) {
      confidence += 35; // Image analysis provides valuable insights
      sources++;
    }

    if (voiceAnalysis) {
      confidence += 25; // Voice analysis adds emotional context
      sources++;
    }

    // Bonus for multiple sources
    if (sources > 1) {
      confidence += 10 * (sources - 1);
    }

    return Math.min(confidence, 95); // Cap at 95% confidence
  }

  /**
   * Default emotional analysis when text is unavailable
   */
  private getDefaultEmotionalAnalysis(): EmotionalAnalysis {
    return {
      primaryEmotion: 'neutral',
      emotionalIntensity: 5,
      emotionalStability: 5,
      stressLevel: 5,
      joyLevel: 5,
      anxietyLevel: 3,
      depressionIndicators: 2
    };
  }

  /**
   * Default spiritual insights
   */
  private getDefaultSpiritualInsights(): SpiritualInsights {
    return {
      spiritualAlignment: 6,
      energeticState: 'Balanced and receptive',
      chakraAnalysis: [
        { chakra: 'Root', status: 'flowing', percentage: 75, guidance: 'Your foundation is stable' },
        { chakra: 'Sacral', status: 'flowing', percentage: 70, guidance: 'Creative energy is balanced' },
        { chakra: 'Solar Plexus', status: 'flowing', percentage: 65, guidance: 'Personal power is emerging' },
        { chakra: 'Heart', status: 'flowing', percentage: 80, guidance: 'Love flows freely through you' },
        { chakra: 'Throat', status: 'flowing', percentage: 70, guidance: 'Your truth wants to be expressed' },
        { chakra: 'Third Eye', status: 'flowing', percentage: 75, guidance: 'Intuition is awakening' },
        { chakra: 'Crown', status: 'flowing', percentage: 85, guidance: 'Divine connection is strong' }
      ],
      spiritualGrowthOpportunities: [
        'Deepen meditation practice',
        'Explore creative expression',
        'Strengthen spiritual community connections'
      ],
      divineGuidance: 'You are exactly where you need to be on your spiritual journey. Trust the process and allow yourself to grow.',
      sacredSymbolism: ['Light', 'Growth', 'Connection']
    };
  }

  /**
   * Fallback analysis when errors occur
   */
  private getFallbackAnalysis(input: MultimodalInput): MultimodalAnalysis {
    return {
      emotionalState: this.getDefaultEmotionalAnalysis(),
      spiritualInsights: this.getDefaultSpiritualInsights(),
      recommendations: [{
        type: 'meditation',
        title: 'Centering Practice',
        description: 'A gentle practice to center yourself and connect with inner wisdom',
        priority: 'medium',
        estimatedDuration: '10 minutes',
        vanessaMessage: 'I sense you need some gentle guidance right now. Let\'s take a moment to center ourselves and connect with your inner wisdom.'
      }],
      crisisIndicators: {
        riskLevel: 'none',
        indicators: [],
        immediateActions: [],
        followUpRequired: false
      },
      confidenceLevel: 50
    };
  }
}

export const multimodalAI = new MultimodalAIService();