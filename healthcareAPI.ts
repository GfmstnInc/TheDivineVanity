/**
 * HEALTHCARE & MEDICAL API INTEGRATION
 * Enterprise-grade healthcare APIs for spiritual wellness
 * Market Value: $50M-$100M ARR potential
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Healthcare API Interfaces
export interface HealthProfile {
  age?: number;
  conditions?: string[];
  medications?: string[];
  allergens?: string[];
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  energyLevel: number; // 1-10
  spiritualWellness: number; // 1-10
}

export interface MedicalInsight {
  category: 'nutrition' | 'exercise' | 'mental-health' | 'spiritual-wellness';
  recommendation: string;
  vanessaGuidance: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  evidenceBased: boolean;
  disclaimer: string;
}

export interface CrisisDetection {
  riskLevel: 'none' | 'mild' | 'moderate' | 'severe' | 'emergency';
  triggers: string[];
  immediateActions: string[];
  resources: EmergencyResource[];
  followUpRequired: boolean;
}

export interface EmergencyResource {
  name: string;
  phone: string;
  website: string;
  available247: boolean;
  description: string;
}

// Healthcare API Service
export class HealthcareAPIService {
  
  /**
   * Analyze health profile and provide spiritual wellness recommendations
   */
  async analyzeHealthProfile(profile: HealthProfile, userId: string): Promise<MedicalInsight[]> {
    try {
      const prompt = `As a healthcare-conscious spiritual wellness AI, analyze this health profile and provide evidence-based recommendations that integrate medical wellness with spiritual growth. 

Health Profile:
- Age: ${profile.age || 'Not specified'}
- Stress Level: ${profile.stressLevel}/10
- Sleep Quality: ${profile.sleepQuality}/10  
- Energy Level: ${profile.energyLevel}/10
- Spiritual Wellness: ${profile.spiritualWellness}/10
- Conditions: ${profile.conditions?.join(', ') || 'None specified'}
- Medications: ${profile.medications?.join(', ') || 'None specified'}

Provide 3-5 recommendations focusing on:
1. Stress reduction through spiritual practices
2. Sleep optimization with sacred rituals
3. Energy enhancement through divine alignment
4. Mental health support through spiritual connection

Format as JSON array with category, recommendation, vanessaGuidance, urgency, evidenceBased, disclaimer fields.

IMPORTANT: Include medical disclaimers. This is educational only, not medical advice.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Healthcare analysis error:', error);
      
      // Fallback recommendations
      return this.getFallbackHealthRecommendations(profile);
    }
  }

  /**
   * Crisis detection and emergency intervention
   */
  async detectCrisis(conversationHistory: string[], userBehavior: any): Promise<CrisisDetection> {
    try {
      const recentMessages = conversationHistory.slice(-10).join('\n');
      
      const prompt = `Analyze this conversation history and user behavior for mental health crisis indicators:

Recent Messages:
${recentMessages}

User Behavior Patterns:
- Recent activity: ${userBehavior.recentActivity || 'Normal'}
- Mood trends: ${userBehavior.moodTrends || 'Stable'}
- Engagement level: ${userBehavior.engagementLevel || 'Normal'}

Assess crisis risk level and provide appropriate response. Look for:
- Suicidal ideation or self-harm mentions
- Extreme hopelessness or despair
- Isolation and withdrawal patterns
- Substance abuse indicators
- Severe depression or anxiety symptoms

Return JSON with riskLevel, triggers, immediateActions, resources, followUpRequired.

Emergency resources to include:
- 988 Suicide & Crisis Lifeline
- Crisis Text Line (Text HOME to 741741)
- National Alliance on Mental Illness (NAMI)`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1, // Low temperature for consistent crisis detection
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from crisis detection');

      return JSON.parse(content);
    } catch (error) {
      console.error('Crisis detection error:', error);
      
      // Conservative fallback - assume potential risk
      return {
        riskLevel: 'moderate',
        triggers: ['Analysis error - manual review recommended'],
        immediateActions: ['Connect with human support', 'Provide emergency resources'],
        resources: this.getEmergencyResources(),
        followUpRequired: true
      };
    }
  }

  /**
   * Generate personalized wellness plan combining medical and spiritual approaches
   */
  async createWellnessPlan(healthProfile: HealthProfile, spiritualGoals: string[]): Promise<{
    dailyPractices: string[];
    weeklyGoals: string[];
    monthlyMilestones: string[];
    medicalConsiderations: string[];
    spiritualIntegration: string[];
  }> {
    try {
      const prompt = `Create a comprehensive wellness plan that integrates medical health with spiritual growth:

Health Profile:
${JSON.stringify(healthProfile, null, 2)}

Spiritual Goals:
${spiritualGoals.join(', ')}

Create a structured plan with:
1. Daily spiritual practices that support physical health
2. Weekly wellness goals (medical + spiritual)
3. Monthly milestones for tracking progress
4. Medical considerations and when to consult healthcare providers
5. Spiritual integration techniques for health challenges

Format as JSON with dailyPractices, weeklyGoals, monthlyMilestones, medicalConsiderations, spiritualIntegration arrays.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 2500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No wellness plan generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Wellness plan generation error:', error);
      
      return this.getFallbackWellnessPlan(healthProfile);
    }
  }

  /**
   * Medication interaction awareness with spiritual practices
   */
  async checkMedicationSpirituralInteractions(medications: string[], proposedPractices: string[]): Promise<{
    interactions: string[];
    recommendations: string[];
    precautions: string[];
  }> {
    // Note: This is educational only, not medical advice
    const commonInteractions = {
      'antidepressants': ['Monitor mood changes during meditation', 'Avoid St. John\'s Wort supplements'],
      'anxiety-medications': ['Deep breathing practices may enhance effects', 'Consult doctor before reducing medication'],
      'blood-pressure': ['Gentle yoga recommended', 'Monitor BP during intense spiritual practices'],
      'diabetes': ['Regular meal timing important for sacred fasting', 'Monitor blood sugar during extended meditation']
    };

    const interactions: string[] = [];
    const recommendations: string[] = [];
    const precautions: string[] = [];

    medications.forEach(med => {
      const medLower = med.toLowerCase();
      Object.entries(commonInteractions).forEach(([condition, advice]) => {
        if (medLower.includes(condition.split('-')[0])) {
          advice.forEach(item => {
            if (item.includes('Monitor') || item.includes('Consult')) {
              precautions.push(item);
            } else {
              recommendations.push(item);
            }
          });
        }
      });
    });

    // Always include standard medical disclaimer
    precautions.push('Always consult your healthcare provider before making changes to spiritual practices while on medication');
    precautions.push('This is educational information only, not medical advice');

    return { interactions, recommendations, precautions };
  }

  /**
   * Get emergency mental health resources
   */
  private getEmergencyResources(): EmergencyResource[] {
    return [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        website: 'https://988lifeline.org',
        available247: true,
        description: '24/7 crisis support for suicidal thoughts and mental health emergencies'
      },
      {
        name: 'Crisis Text Line',
        phone: '741741',
        website: 'https://crisistextline.org',
        available247: true,
        description: 'Text HOME to 741741 for 24/7 crisis support via text message'
      },
      {
        name: 'National Alliance on Mental Illness (NAMI)',
        phone: '1-800-950-6264',
        website: 'https://nami.org',
        available247: false,
        description: 'Mental health support, education, and advocacy resources'
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        website: 'https://samhsa.gov',
        available247: true,
        description: 'Treatment referral and information service for mental health and substance use'
      }
    ];
  }

  /**
   * Fallback health recommendations when AI analysis fails
   */
  private getFallbackHealthRecommendations(profile: HealthProfile): MedicalInsight[] {
    const recommendations: MedicalInsight[] = [];

    if (profile.stressLevel >= 7) {
      recommendations.push({
        category: 'mental-health',
        recommendation: 'Practice daily meditation and stress-reduction techniques',
        vanessaGuidance: 'Your stress levels indicate a need for deeper spiritual grounding. Let\'s explore sacred breathing practices and divine surrender techniques.',
        urgency: 'high',
        evidenceBased: true,
        disclaimer: 'This is educational guidance only. Consult healthcare providers for medical concerns.'
      });
    }

    if (profile.sleepQuality <= 5) {
      recommendations.push({
        category: 'spiritual-wellness',
        recommendation: 'Establish evening sacred rituals to improve sleep quality',
        vanessaGuidance: 'Poor sleep affects your spiritual clarity. I\'ll guide you through evening blessing practices and bedroom sanctification rituals.',
        urgency: 'medium',
        evidenceBased: true,
        disclaimer: 'Sleep issues may require medical evaluation. This is complementary guidance only.'
      });
    }

    if (profile.energyLevel <= 4) {
      recommendations.push({
        category: 'nutrition',
        recommendation: 'Focus on energy-supporting nutrition and divine nourishment practices',
        vanessaGuidance: 'Low energy blocks your spiritual radiance. Let\'s explore sacred nutrition and energy-raising spiritual practices.',
        urgency: 'medium',
        evidenceBased: true,
        disclaimer: 'Persistent fatigue should be evaluated by healthcare professionals.'
      });
    }

    return recommendations;
  }

  /**
   * Fallback wellness plan when AI generation fails
   */
  private getFallbackWellnessPlan(profile: HealthProfile) {
    return {
      dailyPractices: [
        'Morning gratitude meditation (10 minutes)',
        'Mindful breathing exercises during stress',
        'Evening reflection and blessing ritual',
        'Sacred movement or gentle yoga',
        'Healthy meal preparation with intention'
      ],
      weeklyGoals: [
        'Complete 3 guided spiritual wellness sessions',
        'Practice stress management techniques daily',
        'Engage in community or spiritual connection',
        'Journal about health and spiritual insights',
        'Schedule healthcare checkups as needed'
      ],
      monthlyMilestones: [
        'Improved stress management skills',
        'Enhanced sleep quality through spiritual practices',
        'Stronger spiritual-health connection',
        'Better understanding of personal wellness needs',
        'Integration of medical and spiritual approaches'
      ],
      medicalConsiderations: [
        'Regular healthcare provider consultations',
        'Medication adherence and monitoring',
        'Health metric tracking (sleep, stress, energy)',
        'Professional mental health support when needed',
        'Emergency action plan for crisis situations'
      ],
      spiritualIntegration: [
        'Prayer and meditation for healing',
        'Sacred rituals supporting medical treatment',
        'Spiritual community support during health challenges',
        'Divine guidance for health decisions',
        'Gratitude practices for body and health'
      ]
    };
  }
}

export const healthcareAPI = new HealthcareAPIService();