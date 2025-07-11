import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, Unlock, Crown, Star, Book, Download, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface UnlockedContent {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'guide' | 'ritual' | 'prompts';
  requiresMilestone: string;
  content: {
    text?: string;
    downloadUrl?: string;
    steps?: string[];
  };
}

const vaultContent: UnlockedContent[] = [
  {
    id: 'vip-prompts',
    title: 'VIP Soul-Deep Journal Prompts',
    description: 'Exclusive journaling prompts designed for profound spiritual insight and divine connection.',
    type: 'prompts',
    requiresMilestone: 'first_journal',
    content: {
      text: 'Access to 50+ exclusive journal prompts for deeper spiritual exploration.'
    }
  },
  {
    id: 'sacred-breath',
    title: 'Sacred Breath Mastery Guide',
    description: 'Advanced meditation techniques for deeper spiritual connection and divine alignment.',
    type: 'meditation',
    requiresMilestone: 'journal_streak_7',
    content: {
      text: 'Complete breathwork guide with 7 sacred breathing techniques.'
    }
  },
  {
    id: 'divine-energy-report',
    title: 'Personal Divine Energy Report',
    description: 'Your personalized spiritual blueprint with custom recommendations and affirmations.',
    type: 'guide',
    requiresMilestone: 'assessment_complete',
    content: {
      text: 'Download your personalized 12-page Divine Energy Assessment report.',
      downloadUrl: '/api/generate-energy-report'
    }
  },
  {
    id: 'premium-rituals',
    title: 'The Sacred Collection',
    description: 'Exclusive premium rituals and divine wisdom texts for advanced spiritual practice.',
    type: 'ritual',
    requiresMilestone: 'ritual_master',
    content: {
      text: 'Access to 21 premium divine rituals and sacred ceremonies.'
    }
  }
];

export default function DivineVault() {
  const { user } = useAuth();
  
  // Get user achievements to check what content is unlocked
  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const unlockedMilestones = achievements.map((a: any) => a.achievementType);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'meditation': return Heart;
      case 'guide': return Book;
      case 'ritual': return Crown;
      case 'prompts': return Star;
      default: return Lock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-soft-gray">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-deep-charcoal hover:text-divine-gold">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="font-playfair text-xl font-semibold text-divine-gold">
              The Divine Vault
            </h1>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Introduction */}
        <Card className="rounded-2xl shadow-lg border border-divine-gold/20 divine-shadow">
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 text-divine-gold mx-auto mb-4" />
            <h2 className="font-playfair text-2xl font-semibold text-divine-gold mb-3">
              Sacred Content Unlocked
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your spiritual journey has unlocked exclusive content. Continue evolving to access deeper wisdom and divine tools.
            </p>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="space-y-4">
          {vaultContent.map((content) => {
            const isUnlocked = unlockedMilestones.includes(content.requiresMilestone);
            const IconComponent = getContentIcon(content.type);
            
            return (
              <Card 
                key={content.id} 
                className={`rounded-2xl shadow-lg border transition-all duration-300 ${
                  isUnlocked 
                    ? 'border-divine-gold/30 divine-shadow bg-gradient-to-br from-white to-divine-gold/5' 
                    : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full ${
                      isUnlocked ? 'bg-divine-gold/10' : 'bg-gray-100'
                    }`}>
                      {isUnlocked ? (
                        <IconComponent className="w-6 h-6 text-divine-gold" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center">
                      {isUnlocked ? (
                        <Unlock className="w-5 h-5 text-divine-gold" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className={`font-playfair text-lg font-semibold mb-2 ${
                    isUnlocked ? 'text-divine-gold' : 'text-gray-500'
                  }`}>
                    {content.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed mb-4 ${
                    isUnlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {content.description}
                  </p>

                  {isUnlocked ? (
                    <div className="space-y-3">
                      <p className="text-sm text-divine-gold/80">
                        {content.content.text}
                      </p>
                      
                      {content.content.downloadUrl ? (
                        <Button className="w-full bg-gradient-to-r from-divine-gold to-divine-gold/90 hover:from-divine-gold/90 hover:to-divine-gold text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download Sacred Guide
                        </Button>
                      ) : content.type === 'prompts' ? (
                        <Button 
                          className="w-full bg-gradient-to-r from-divine-gold to-divine-gold/90 hover:from-divine-gold/90 hover:to-divine-gold text-white"
                          onClick={() => window.location.href = '/journal'}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Access VIP Prompts
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-divine-gold to-divine-gold/90 hover:from-divine-gold/90 hover:to-divine-gold text-white"
                          disabled
                        >
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">
                        Complete more milestones to unlock
                      </p>
                      <Button 
                        variant="outline" 
                        disabled
                        className="border-gray-300 text-gray-400"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Evolving CTA */}
        <Card className="rounded-2xl shadow-lg border border-divine-gold/20 divine-shadow">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-divine-gold mx-auto mb-3" />
            <h3 className="font-playfair text-lg font-semibold text-divine-gold mb-2">
              Continue Evolving
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Complete more divine practices to unlock additional sacred content.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-divine-gold to-divine-gold/90 hover:from-divine-gold/90 hover:to-divine-gold text-white">
                Return to Sacred Practice
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}