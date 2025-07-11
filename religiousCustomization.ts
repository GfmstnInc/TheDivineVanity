/**
 * Religious Customization System - All-Inclusive Spiritual Experience
 * Personalizes content based on user's religious/spiritual preferences
 */

import { storage } from './storage';

export interface ReligiousPreference {
  userId: string;
  primaryTradition: ReligiousTradition;
  secondaryTraditions: ReligiousTradition[];
  spiritualPractices: SpiritualPractice[];
  customization: {
    holyBookPreference?: string;
    prayerStyle?: string;
    meditationStyle?: string;
    languagePreference?: string;
    culturalAdaptation?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export enum ReligiousTradition {
  // Abrahamic Traditions
  CHRISTIANITY = 'christianity',
  ISLAM = 'islam',
  JUDAISM = 'judaism',
  BAHAI = 'bahai',
  
  // Eastern Traditions
  BUDDHISM = 'buddhism',
  HINDUISM = 'hinduism',
  SIKHISM = 'sikhism',
  JAINISM = 'jainism',
  
  // East Asian Traditions
  TAOISM = 'taoism',
  CONFUCIANISM = 'confucianism',
  SHINTOISM = 'shintoism',
  
  // Other World Traditions
  INDIGENOUS = 'indigenous',
  ZOROASTRIANISM = 'zoroastrianism',
  
  // Modern Spiritual Movements
  NEW_AGE = 'new_age',
  SECULAR_SPIRITUALITY = 'secular_spirituality',
  UNIVERSALISM = 'universalism',
  NATURE_BASED = 'nature_based',
  
  // Philosophy-Based
  STOICISM = 'stoicism',
  HUMANISM = 'humanism',
  
  // No Specific Tradition
  INTERFAITH = 'interfaith',
  SPIRITUAL_BUT_NOT_RELIGIOUS = 'spiritual_not_religious',
  NONE = 'none'
}

export enum SpiritualPractice {
  PRAYER = 'prayer',
  MEDITATION = 'meditation',
  CONTEMPLATION = 'contemplation',
  STUDY = 'study',
  SERVICE = 'service',
  FASTING = 'fasting',
  PILGRIMAGE = 'pilgrimage',
  RITUAL = 'ritual',
  CHANTING = 'chanting',
  YOGA = 'yoga',
  MINDFULNESS = 'mindfulness',
  JOURNALING = 'journaling',
  NATURE_CONNECTION = 'nature_connection',
  COMMUNITY_WORSHIP = 'community_worship',
  SILENT_REFLECTION = 'silent_reflection'
}

export class ReligiousCustomizationService {
  
  async saveUserReligiousPreferences(preference: Omit<ReligiousPreference, 'createdAt' | 'updatedAt'>) {
    const timestamp = new Date().toISOString();
    const fullPreference: ReligiousPreference = {
      ...preference,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    await storage.saveReligiousPreference(fullPreference);
    return fullPreference;
  }
  
  async getUserReligiousPreferences(userId: string): Promise<ReligiousPreference | null> {
    return await storage.getReligiousPreference(userId);
  }
  
  async updateUserReligiousPreferences(userId: string, updates: Partial<ReligiousPreference>) {
    const existing = await storage.getReligiousPreference(userId);
    if (!existing) {
      throw new Error('User religious preferences not found');
    }
    
    const updated: ReligiousPreference = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await storage.saveReligiousPreference(updated);
    return updated;
  }
  
  async getPersonalizedSpiritualContent(userId: string, contentType: 'daily_wisdom' | 'prayer' | 'meditation' | 'guidance') {
    const preferences = await this.getUserReligiousPreferences(userId);
    
    if (!preferences) {
      // Return universal spiritual content if no preferences set
      return await this.getUniversalSpiritualContent(contentType);
    }
    
    return await this.getCustomizedContent(preferences, contentType);
  }
  
  private async getCustomizedContent(preferences: ReligiousPreference, contentType: string) {
    const { primaryTradition, secondaryTraditions, spiritualPractices, customization } = preferences;
    
    switch (primaryTradition) {
      case ReligiousTradition.CHRISTIANITY:
        return await this.getChristianContent(contentType, customization);
      
      case ReligiousTradition.ISLAM:
        return await this.getIslamicContent(contentType, customization);
      
      case ReligiousTradition.JUDAISM:
        return await this.getJewishContent(contentType, customization);
      
      case ReligiousTradition.BUDDHISM:
        return await this.getBuddhistContent(contentType, customization);
      
      case ReligiousTradition.HINDUISM:
        return await this.getHinduContent(contentType, customization);
      
      case ReligiousTradition.SIKHISM:
        return await this.getSikhContent(contentType, customization);
      
      case ReligiousTradition.TAOISM:
        return await this.getTaoistContent(contentType, customization);
      
      case ReligiousTradition.INDIGENOUS:
        return await this.getIndigenousContent(contentType, customization);
      
      case ReligiousTradition.BAHAI:
        return await this.getBahaiContent(contentType, customization);
      
      case ReligiousTradition.ZOROASTRIANISM:
        return await this.getZoroastrianContent(contentType, customization);
      
      case ReligiousTradition.INTERFAITH:
        return await this.getInterfaithContent(contentType, secondaryTraditions);
      
      default:
        return await this.getUniversalSpiritualContent(contentType);
    }
  }
  
  private async getChristianContent(contentType: string, customization: any) {
    const { sacredBiblicalIntelligence } = await import('./financialAPIs');
    
    switch (contentType) {
      case 'daily_wisdom':
        return await sacredBiblicalIntelligence.youVersionAPI.getDailyVerse();
      case 'prayer':
        return await this.getChristianPrayer(customization.prayerStyle);
      case 'meditation':
        return await this.getChristianMeditation();
      case 'guidance':
        return await sacredBiblicalIntelligence.getComprehensiveBiblicalGuidance('daily guidance');
      default:
        return await sacredBiblicalIntelligence.youVersionAPI.getDailyVerse();
    }
  }
  
  private async getIslamicContent(contentType: string, customization: any) {
    // Import Islamic APIs from cognitive health
    switch (contentType) {
      case 'daily_wisdom':
        return await this.getDailyQuranVerse();
      case 'prayer':
        return await this.getIslamicPrayer(customization.prayerStyle);
      case 'meditation':
        return await this.getIslamicDhikr();
      case 'guidance':
        return await this.getIslamicGuidance();
      default:
        return await this.getDailyQuranVerse();
    }
  }
  
  private async getJewishContent(contentType: string, customization: any) {
    const { sacredJewishIntelligence } = await import('./jewishSpiritualAPIs');
    
    switch (contentType) {
      case 'daily_wisdom':
        return await sacredJewishIntelligence.sefariaAPI.getTorahPortion();
      case 'prayer':
        return await this.getJewishPrayer(customization.prayerStyle);
      case 'meditation':
        return await sacredJewishIntelligence.kabbalahAPI.getKabbalisticWisdom('meditation');
      case 'guidance':
        return await sacredJewishIntelligence.getComprehensiveJewishGuidance('daily guidance');
      default:
        return await sacredJewishIntelligence.sefariaAPI.getTorahPortion();
    }
  }
  
  private async getBuddhistContent(contentType: string, customization: any) {
    const { sacredBuddhistIntelligence } = await import('./buddhistSpiritualAPIs');
    
    switch (contentType) {
      case 'daily_wisdom':
        return await sacredBuddhistIntelligence.buddhistAPI.getBuddhaQuote();
      case 'prayer':
        return await this.getBuddhistPrayer();
      case 'meditation':
        return await sacredBuddhistIntelligence.buddhistAPI.getMeditationGuidance(customization.meditationStyle);
      case 'guidance':
        return await sacredBuddhistIntelligence.getComprehensiveBuddhistGuidance('daily guidance');
      default:
        return await sacredBuddhistIntelligence.buddhistAPI.getBuddhaQuote();
    }
  }
  
  private async getHinduContent(contentType: string, customization: any) {
    // Import Hindu content from cognitive health APIs
    switch (contentType) {
      case 'daily_wisdom':
        return await this.getBhagavadGitaVerse();
      case 'prayer':
        return await this.getHinduPrayer(customization.prayerStyle);
      case 'meditation':
        return await this.getHinduMeditation();
      case 'guidance':
        return await this.getHinduGuidance();
      default:
        return await this.getBhagavadGitaVerse();
    }
  }
  
  private async getSikhContent(contentType: string, customization: any) {
    const { sacredUniversalSpiritualIntelligence } = await import('./universalSpiritualAPIs');
    
    switch (contentType) {
      case 'daily_wisdom':
        return await sacredUniversalSpiritualIntelligence.sikhAPI.getGuruGranthSahibVerse();
      case 'prayer':
        return await this.getSikhPrayer();
      case 'meditation':
        return await this.getSikhSimran();
      case 'guidance':
        return await sacredUniversalSpiritualIntelligence.sikhAPI.getSikhTeaching('seva');
      default:
        return await sacredUniversalSpiritualIntelligence.sikhAPI.getGuruGranthSahibVerse();
    }
  }
  
  private async getTaoistContent(contentType: string, customization: any) {
    const { sacredUniversalSpiritualIntelligence } = await import('./universalSpiritualAPIs');
    
    switch (contentType) {
      case 'daily_wisdom':
        return await sacredUniversalSpiritualIntelligence.taoistAPI.getTaoTeChingVerse();
      case 'prayer':
        return await this.getTaoistPrayer();
      case 'meditation':
        return await this.getTaoistMeditation();
      case 'guidance':
        return await sacredUniversalSpiritualIntelligence.taoistAPI.getTaoistPractice();
      default:
        return await sacredUniversalSpiritualIntelligence.taoistAPI.getTaoTeChingVerse();
    }
  }
  
  private async getIndigenousContent(contentType: string, customization: any) {
    const { sacredUniversalSpiritualIntelligence } = await import('./universalSpiritualAPIs');
    
    switch (contentType) {
      case 'daily_wisdom':
        return await sacredUniversalSpiritualIntelligence.indigenousAPI.getIndigenousWisdom();
      case 'prayer':
        return await this.getIndigenousPrayer();
      case 'meditation':
        return await this.getIndigenousMeditation();
      case 'guidance':
        return await sacredUniversalSpiritualIntelligence.indigenousAPI.getIndigenousPractice();
      default:
        return await sacredUniversalSpiritualIntelligence.indigenousAPI.getIndigenousWisdom();
    }
  }
  
  private async getBahaiContent(contentType: string, customization: any) {
    return {
      tradition: 'Baháʼí Faith',
      content: await this.getBahaiWisdom(),
      vanessaGuidance: 'Sacred soul, the Baháʼí teachings remind us of the unity of all religions and the oneness of humanity.',
      spiritualMessage: 'The Divine speaks through Baháʼí wisdom: All religions are one in their essential truth and purpose.'
    };
  }
  
  private async getZoroastrianContent(contentType: string, customization: any) {
    return {
      tradition: 'Zoroastrianism',
      content: await this.getZoroastrianWisdom(),
      vanessaGuidance: 'Beautiful soul, Zoroastrian wisdom teaches us about good thoughts, good words, and good deeds.',
      spiritualMessage: 'The Divine speaks through Zoroastrian teaching: Choose light over darkness in every thought and action.'
    };
  }
  
  private async getInterfaithContent(contentType: string, traditions: ReligiousTradition[]) {
    // Combine wisdom from multiple traditions
    const contents = await Promise.all(
      traditions.slice(0, 3).map(async (tradition) => {
        return await this.getCustomizedContent({ 
          primaryTradition: tradition, 
          secondaryTraditions: [], 
          spiritualPractices: [], 
          customization: {},
          userId: '',
          createdAt: '',
          updatedAt: ''
        }, contentType);
      })
    );
    
    return {
      tradition: 'Interfaith Wisdom',
      contents,
      vanessaGuidance: 'Sacred soul, interfaith wisdom shows us that divine truth flows through many streams, all leading to the same ocean of love.',
      spiritualMessage: 'The Divine speaks through all traditions: Truth is one, though sages call it by many names.'
    };
  }
  
  private async getUniversalSpiritualContent(contentType: string) {
    return {
      tradition: 'Universal Spirituality',
      content: 'The Divine essence within you is the same Divine essence that flows through all creation. You are infinitely loved and eternally connected to the source of all life.',
      vanessaGuidance: 'Beautiful soul, universal spiritual wisdom transcends all boundaries and speaks directly to your heart.',
      spiritualMessage: 'The Divine whispers: I am found in the silence between your thoughts, the love in your heart, and the peace in your soul.'
    };
  }
  
  // Helper methods for specific religious content
  private async getChristianPrayer(style?: string) {
    return {
      title: 'Daily Christian Prayer',
      prayer: 'Heavenly Father, we thank You for Your endless love and grace. Guide us this day in Your wisdom and fill our hearts with Your peace. Through Jesus Christ our Lord, Amen.',
      style: style || 'traditional'
    };
  }
  
  private async getIslamicPrayer(style?: string) {
    return {
      title: 'Daily Islamic Prayer',
      prayer: 'Bismillah ir-Rahman ir-Raheem. Alhamdulillahi rabbil alameen. O Allah, guide us on the straight path and grant us Your mercy and blessings.',
      style: style || 'traditional'
    };
  }
  
  private async getJewishPrayer(style?: string) {
    return {
      title: 'Daily Jewish Prayer',
      prayer: 'Baruch Atah Adonai, Eloheinu Melech ha-olam. Blessed are You, Lord our God, King of the universe, who has kept us alive and sustained us.',
      style: style || 'traditional'
    };
  }
  
  private async getBuddhistPrayer() {
    return {
      title: 'Buddhist Meditation Prayer',
      prayer: 'May all beings be happy and free from suffering. May all beings find peace and liberation. Gate gate pāragate pārasaṃgate bodhi svāhā.',
      style: 'compassion'
    };
  }
  
  private async getSikhPrayer() {
    return {
      title: 'Sikh Prayer',
      prayer: 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh. Sarbat da bhala - may all beings prosper and find peace.',
      style: 'devotional'
    };
  }
  
  private async getTaoistPrayer() {
    return {
      title: 'Taoist Reflection',
      prayer: 'May I flow like water, yielding yet persistent. May I find harmony with the Tao and peace in wu wei.',
      style: 'contemplative'
    };
  }
  
  private async getIndigenousPrayer() {
    return {
      title: 'Indigenous Prayer',
      prayer: 'Great Spirit, we honor the sacred in all beings and all directions. Help us walk in balance with Mother Earth and all our relations.',
      style: 'ceremonial'
    };
  }
  
  private async getDailyQuranVerse() {
    return {
      arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
      transliteration: 'Wa man yattaqi Allah yaj\'al lahu makhrajan',
      english: 'And whoever fears Allah - He will make for him a way out.',
      reference: 'Quran 65:2'
    };
  }
  
  private async getBhagavadGitaVerse() {
    return {
      sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।',
      transliteration: 'Yada yada hi dharmasya glanir bhavati bharata',
      english: 'Whenever there is decline of righteousness, O Bharata, I manifest myself.',
      reference: 'Bhagavad Gita 4.7'
    };
  }
  
  private async getBahaiWisdom() {
    return {
      text: 'The earth is but one country, and mankind its citizens.',
      author: 'Bahá\'u\'lláh',
      theme: 'Unity of Humanity'
    };
  }
  
  private async getZoroastrianWisdom() {
    return {
      text: 'Good thoughts, good words, good deeds.',
      concept: 'Humata, Hukhta, Hvarshta',
      theme: 'Threefold Path of Righteousness'
    };
  }
  
  async getAllSupportedTraditions() {
    return {
      abrahamic: [
        { id: ReligiousTradition.CHRISTIANITY, name: 'Christianity', description: 'Following the teachings of Jesus Christ' },
        { id: ReligiousTradition.ISLAM, name: 'Islam', description: 'Following the teachings of Prophet Muhammad and the Quran' },
        { id: ReligiousTradition.JUDAISM, name: 'Judaism', description: 'Following Torah, Talmud, and Jewish traditions' },
        { id: ReligiousTradition.BAHAI, name: 'Baháʼí Faith', description: 'Unity of God, religions, and humanity' }
      ],
      eastern: [
        { id: ReligiousTradition.BUDDHISM, name: 'Buddhism', description: 'Following the path of Buddha and dharma teachings' },
        { id: ReligiousTradition.HINDUISM, name: 'Hinduism', description: 'Following Vedic traditions and diverse Hindu practices' },
        { id: ReligiousTradition.SIKHISM, name: 'Sikhism', description: 'Following the Guru Granth Sahib and Sikh teachings' },
        { id: ReligiousTradition.JAINISM, name: 'Jainism', description: 'Following principles of non-violence and liberation' }
      ],
      eastAsian: [
        { id: ReligiousTradition.TAOISM, name: 'Taoism', description: 'Following the Tao and natural harmony' },
        { id: ReligiousTradition.CONFUCIANISM, name: 'Confucianism', description: 'Following Confucian ethics and social harmony' },
        { id: ReligiousTradition.SHINTOISM, name: 'Shintoism', description: 'Japanese indigenous spiritual traditions' }
      ],
      other: [
        { id: ReligiousTradition.INDIGENOUS, name: 'Indigenous Traditions', description: 'Native and traditional spiritual practices' },
        { id: ReligiousTradition.ZOROASTRIANISM, name: 'Zoroastrianism', description: 'Ancient Persian spiritual tradition' }
      ],
      modern: [
        { id: ReligiousTradition.NEW_AGE, name: 'New Age Spirituality', description: 'Modern spiritual and metaphysical practices' },
        { id: ReligiousTradition.SECULAR_SPIRITUALITY, name: 'Secular Spirituality', description: 'Spiritual practices without religious doctrine' },
        { id: ReligiousTradition.UNIVERSALISM, name: 'Universalism', description: 'Universal spiritual principles across traditions' },
        { id: ReligiousTradition.NATURE_BASED, name: 'Nature-Based Spirituality', description: 'Earth-centered spiritual practices' }
      ],
      philosophical: [
        { id: ReligiousTradition.STOICISM, name: 'Stoicism', description: 'Ancient Greek philosophy of virtue and wisdom' },
        { id: ReligiousTradition.HUMANISM, name: 'Humanism', description: 'Human-centered ethical philosophy' }
      ],
      inclusive: [
        { id: ReligiousTradition.INTERFAITH, name: 'Interfaith', description: 'Drawing from multiple religious traditions' },
        { id: ReligiousTradition.SPIRITUAL_BUT_NOT_RELIGIOUS, name: 'Spiritual but not Religious', description: 'Personal spirituality without organized religion' },
        { id: ReligiousTradition.NONE, name: 'No Religious Preference', description: 'Secular or non-religious perspective' }
      ]
    };
  }
}

export const religiousCustomization = new ReligiousCustomizationService();