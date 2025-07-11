import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Crown, Settings, LogOut, Mail, Sparkles, Gift, RefreshCw, MessageSquare, Heart, DollarSign, Volume2, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User as UserType } from "@shared/schema";
import SpiritualProgress from "@/components/SpiritualProgress";
import DivineHeader from "@/components/DivineHeader";
import { useTranslation } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import BudgetSettingsModal from "@/components/BudgetSettingsModal";
import FeedbackSettingsSection from "@/components/FeedbackSettingsSection";
import { VoiceSelector } from "@/components/VoiceSelector";
import { usePostPurchaseFeedback } from "@/hooks/usePostPurchaseFeedback";
import { elevenLabsVoice } from "@/services/elevenLabsVoice";
import { Label } from "@/components/ui/label";



// Divine Quotes Component
const DivineQuotesSection = () => {
  const [currentQuote, setCurrentQuote] = useState({
    quote: "You are sanctified. Empowered. Divine.",
    author: "Vanessa Rich"
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchInspirationalQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inspirational-quote');
      const data = await response.json();
      
      if (data && data.quote && data.author) {
        setCurrentQuote({
          quote: data.quote,
          author: data.author
        });
      }
    } catch (error) {
      console.log('Quote fetch failed');
      // Keep the current quote if fetch fails
    }
    setIsLoading(false);
  };

  const refreshQuote = () => {
    fetchInspirationalQuote();
  };

  // Fetch initial quote when component mounts
  useEffect(() => {
    fetchInspirationalQuote();
  }, []);

  return (
    <div className="text-center py-8 space-y-6">
      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-divine-gold to-soft-gold rounded-full flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      
      <div className="space-y-4">
        <h3 className="font-playfair text-lg font-semibold text-divine-gold">
          Divine Community Member ✨
        </h3>
        
        <div className="bg-white/80 rounded-xl p-6 border border-divine-gold/30 shadow-lg">
          <blockquote className="text-xl font-medium text-gray-800 leading-relaxed mb-4">
            "{currentQuote.quote}"
          </blockquote>
          <cite className="text-gray-600 text-base font-medium">
            — {currentQuote.author}
          </cite>
        </div>
        
        <Button
          onClick={refreshQuote}
          disabled={isLoading}
          variant="outline"
          className="border-divine-gold/30 text-divine-gold hover:bg-divine-gold/10 hover:border-divine-gold/50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Getting Quote...' : 'New Inspiration'}
        </Button>
        
        <p className="text-xs text-divine-500">
          Welcome to our sacred circle of empowered women
        </p>
      </div>
    </div>
  );
};

export default function Profile() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useQuery<UserType>({
    queryKey: ["/api/user"],
    enabled: !!authUser,
  });

  const [email, setEmail] = useState("");
  const [isEmailSignedUp, setIsEmailSignedUp] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<number | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // ElevenLabs settings
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState<string>('');
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  
  // Post-purchase feedback settings
  const { settings: feedbackSettings, updateSettings: updateFeedbackSettings, loadSettings } = usePostPurchaseFeedback();

  const queryClient = useQueryClient();

  const emailSignupMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest("/api/email-signup", "POST", { email });
    },
    onSuccess: () => {
      setIsEmailSignedUp(true);
      toast({
        title: "Welcome to the Divine Community! ✨",
        description: "You've earned 25 XP! Updates and exclusive offers await you.",
      });
      // Invalidate stats to show updated XP
      queryClient.invalidateQueries({ queryKey: ["/api/user-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
    },
    onError: (error) => {
      console.error("Email signup error:", error);
      toast({
        title: "Sacred Connection Issue",
        description: "Unable to join the divine community. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEmailSignup = () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email to join the divine community.",
        variant: "destructive",
      });
      return;
    }
    emailSignupMutation.mutate(email);
  };

  // Save ElevenLabs settings
  const saveElevenLabsSettings = () => {
    if (!elevenLabsApiKey.trim() || !elevenLabsVoiceId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both your API key and Voice ID.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('elevenlabs-api-key', elevenLabsApiKey);
    localStorage.setItem('elevenlabs-voice-id', elevenLabsVoiceId);
    
    elevenLabsVoice.configure({
      apiKey: elevenLabsApiKey,
      voiceId: elevenLabsVoiceId,
      model: 'eleven_monolingual_v1'
    });

    toast({
      title: "Voice Settings Saved! ✨",
      description: "Your custom ElevenLabs voice is now configured for Vanessa.",
    });
  };

  // Test ElevenLabs voice
  const testElevenLabsVoice = async () => {
    if (!elevenLabsApiKey.trim() || !elevenLabsVoiceId.trim()) {
      toast({
        title: "Setup Required",
        description: "Please enter both API key and Voice ID, then save settings first.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingVoice(true);
    try {
      elevenLabsVoice.configure({
        apiKey: elevenLabsApiKey,
        voiceId: elevenLabsVoiceId
      });
      await elevenLabsVoice.testVoice();
      
      toast({
        title: "Voice Test Complete! 🎵",
        description: "Your custom voice is working perfectly.",
      });
    } catch (error) {
      console.error('ElevenLabs test failed:', error);
      toast({
        title: "Voice Test Failed",
        description: "Please check your API key and Voice ID. Make sure they're correct.",
        variant: "destructive",
      });
    } finally {
      setIsTestingVoice(false);
    }
  };

  // Load feedback settings and ElevenLabs settings on component mount
  useEffect(() => {
    loadSettings();
    
    // Auto-configure ElevenLabs with provided credentials
    const apiKey = 'sk_d8289ee9152d38715081c07ec60869b13ce66ce433831f3b';
    const voiceId = 'BKCYyTup8jT5sGwKXdNl';
    
    localStorage.setItem('elevenlabs-api-key', apiKey);
    localStorage.setItem('elevenlabs-voice-id', voiceId);
    
    setElevenLabsApiKey(apiKey);
    setElevenLabsVoiceId(voiceId);
    
    // Configure the service immediately
    elevenLabsVoice.configure({
      apiKey,
      voiceId,
      model: 'eleven_monolingual_v1'
    });
  }, [loadSettings]);

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray pb-20">
        <div className="animate-pulse pt-20 px-6">
          <div className="h-32 bg-gray-200 rounded-3xl mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray pb-20">
      {/* Header */}
      <header className="glass-effect border-b border-soft-gray sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-divine-gold" />
              </div>
              <div>
                <h1 className="font-playfair text-xl font-semibold text-deep-charcoal">
                  {t('headers.sacredJourney')}
                </h1>
                <p className="text-sm text-gray-600">{t('headers.spiritualProgress')}</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="pt-6 px-6">
        {/* User Profile Header */}
        <Card className="celestial-card divine-glass-morphism mb-6 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-divine-gold to-luxury-gold flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-playfair text-xl font-semibold text-divine-gold mb-1">
                  {(authUser as any)?.firstName ? `${(authUser as any).firstName}${(authUser as any).lastName ? ` ${(authUser as any).lastName}` : ''}` : 
                   (userProfile as any)?.email?.split('@')[0] || (authUser as any)?.email?.split('@')[0] || "Divine Soul"}
                </h2>
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-celestial-gold" />
                  <span className="text-sm font-medium text-celestial-gold">
                    Sacred Member
                  </span>
                </div>
                {(authUser as any)?.email && (
                  <p className="text-xs text-divine-gold/60 mt-1">{(authUser as any).email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spiritual Progress Component */}
        <SpiritualProgress />

        {/* Budget Settings Section */}
        <Card className="celestial-card divine-glass-morphism mb-6 animate-fade-in">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-celestial-gold to-divine-gold rounded-full flex items-center justify-center shadow-lg">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <CardTitle className="text-divine-gold font-playfair text-lg">
                  Sacred Budget Settings
                </CardTitle>
                <p className="text-divine-gold/70 text-sm">
                  Optional monthly intention for spiritual investments
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {currentBudget ? (
                <div className="bg-celestial-gold/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-divine-gold font-medium">Monthly Sacred Budget</p>
                      <p className="text-divine-gold/70 text-sm">Helps guide conscious spiritual investments</p>
                    </div>
                    <p className="text-celestial-gold font-bold text-xl">${currentBudget}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-pearl-white/50 rounded-2xl p-4 border border-divine-gold/20">
                  <p className="text-divine-gold text-sm mb-2">
                    💫 Set a gentle monthly boundary for spiritual purchases
                  </p>
                  <p className="text-divine-gold/70 text-xs">
                    This helps Vanessa provide loving guidance when you're approaching your intention, 
                    ensuring growth comes from wisdom rather than emotional impulse.
                  </p>
                </div>
              )}
              
              <Button
                onClick={() => setShowBudgetModal(true)}
                className="w-full bg-gradient-to-r from-celestial-gold to-divine-gold text-pearl-white hover:shadow-celestial-gold/40"
              >
                <DollarSign size={16} className="mr-2" />
                {currentBudget ? 'Update Sacred Budget' : 'Set Sacred Budget'}
              </Button>
              
              <p className="text-center text-divine-gold/50 text-xs">
                🕊️ Completely optional and private - designed to support your conscious growth
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings Section */}
        <Card className="celestial-card divine-glass-morphism mb-6 animate-fade-in">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-celestial-gold to-divine-gold rounded-full flex items-center justify-center shadow-lg">
                <Volume2 className="text-white" size={20} />
              </div>
              <div>
                <CardTitle className="text-divine-gold font-playfair text-lg">
                  Vanessa's Voice Settings
                </CardTitle>
                <p className="text-divine-gold/70 text-sm">
                  Customize how Vanessa sounds during your spiritual journey
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <VoiceSelector />
          </CardContent>
        </Card>

        {/* ElevenLabs AI Voice Integration */}
        <Card className="celestial-card divine-glass-morphism mb-6 animate-fade-in border-2 border-purple-300/30">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="text-white" size={20} />
              </div>
              <div>
                <CardTitle className="text-purple-700 font-playfair text-lg">
                  ElevenLabs AI Voice (Premium)
                </CardTitle>
                <p className="text-purple-600/70 text-sm">
                  Use your custom trained voice from ElevenLabs for premium AI speech quality
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-800 mb-2">What you need from ElevenLabs:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>1. <strong>API Key:</strong> From your ElevenLabs account settings</li>
                <li>2. <strong>Voice ID:</strong> From your created/cloned voice (11-character code)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="elevenlabs-api-key" className="text-sm font-medium text-divine-gold">
                  ElevenLabs API Key
                </Label>
                <Input
                  id="elevenlabs-api-key"
                  type="password"
                  placeholder="sk-..."
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-divine-gold/60 mt-1">
                  Found in your ElevenLabs account under "Profile & API Keys"
                </p>
              </div>

              <div>
                <Label htmlFor="elevenlabs-voice-id" className="text-sm font-medium text-divine-gold">
                  Voice ID
                </Label>
                <Input
                  id="elevenlabs-voice-id"
                  placeholder="21m00Tcm4TlvDq8ikWAM"
                  value={elevenLabsVoiceId}
                  onChange={(e) => setElevenLabsVoiceId(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-divine-gold/60 mt-1">
                  11-character ID from your voice page (e.g., "21m00Tcm4TlvDq8ikWAM")
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={saveElevenLabsSettings}
                  variant="outline" 
                  className="flex-1 border-divine-gold/30 text-divine-gold hover:bg-divine-gold/10"
                >
                  Save Settings
                </Button>
                <Button 
                  onClick={testElevenLabsVoice}
                  disabled={isTestingVoice}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isTestingVoice ? 'Testing...' : 'Test Voice'}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to get your ElevenLabs credentials:</h4>
              <ol className="text-sm text-blue-700 space-y-2">
                <li>1. Go to <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="underline font-medium">elevenlabs.io</a> and sign up</li>
                <li>2. Create or clone a voice that sounds like you want Vanessa to sound</li>
                <li>3. Copy the Voice ID from your voice's page</li>
                <li>4. Get your API key from "Profile & API Keys" in settings</li>
                <li>5. Paste both above and test!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Settings Section */}
        <FeedbackSettingsSection 
          settings={feedbackSettings}
          onUpdateSettings={updateFeedbackSettings}
        />

        {/* Sacred Morning Ritual Access */}
        <Card className="rounded-3xl shadow-xl border-2 border-divine-gold/20 bg-gradient-to-br from-divine-gold/5 via-cream-50 to-soft-gold/10 divine-shadow mt-6">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-divine-gold to-soft-gold rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-playfair text-xl font-bold text-divine-gold mb-2">
              Your Sacred Morning Ritual
            </CardTitle>
            <p className="text-divine-700 text-sm leading-relaxed">
              Access your divine 7-step morning practice anytime to start each day with sacred intention.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-cream/30 rounded-lg p-6 border border-divine-gold/20 text-left">
              <h4 className="font-playfair text-lg font-semibold text-deep-charcoal mb-4 text-center">
                🌅 Your Sacred Morning Ritual Guide
              </h4>
              <div className="space-y-3 text-gray-700">
                <p className="text-sm font-medium text-divine-gold mb-3">Begin each day with divine intention:</p>
                <div className="space-y-2">
                  <p className="flex items-start"><span className="text-divine-gold mr-2 font-semibold">1.</span> Begin with divine gratitude</p>
                  <p className="flex items-start"><span className="text-divine-gold mr-2 font-semibold">2.</span> Set sacred intentions</p>
                  <p className="flex items-start"><span className="text-divine-gold mr-2 font-semibold">3.</span> Connect with your breath</p>
                  <p className="flex items-start"><span className="text-divine-gold mr-2 font-semibold">4.</span> Affirm your divine worth</p>
                  <p className="flex items-start"><span className="text-divine-gold mr-2 font-semibold">5.</span> Embrace the day with love</p>
                  <p className="flex items-start"><span className="text-divine-gold mr-2 font-semibold">6.</span> Honor your sacred vessel</p>
                  <p className="flex items-start"><span className="text-divine-gold mr-2 font-semibold">7.</span> Trust your inner wisdom</p>
                </div>
                <div className="mt-4 p-3 bg-divine-gold/10 rounded-lg">
                  <p className="text-sm italic text-center text-divine-gold font-medium">
                    "You are sanctified. Empowered. Divine."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Divine Feedback Section */}
        <Card className="rounded-3xl shadow-xl border-2 border-divine-gold/20 bg-gradient-to-br from-divine-gold/5 via-cream-50 to-soft-gold/10 divine-shadow mt-6">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-divine-gold to-soft-gold rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-playfair text-xl font-bold text-divine-gold mb-2">
              Refining the Divine
            </CardTitle>
            <p className="text-divine-700 text-sm leading-relaxed">
              Help shape the next evolution of this sacred space. Your divine insights matter.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/divine-feedback">
              <Button className="w-full bg-gradient-to-r from-divine-gold to-divine-gold hover:from-divine-gold hover:to-divine-gold text-white py-3 rounded-full font-medium shadow-lg">
                Share Your Sacred Vision ✨
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Divine Community Email List */}
        <Card className="rounded-3xl shadow-xl border-2 border-divine-gold/20 bg-gradient-to-br from-divine-gold/5 via-cream-50 to-soft-gold/10 divine-shadow mt-6">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-divine-gold to-soft-gold rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-playfair text-2xl font-bold text-divine-gold mb-2">
              Join The Divine Community
            </CardTitle>
            <p className="text-divine-700 text-sm leading-relaxed">
              Receive exclusive updates, spiritual insights, and special discounts on unique divine items. 
              <span className="font-semibold text-divine-gold"> Earn 25 XP</span> for joining!
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {isEmailSignedUp ? (
              <DivineQuotesSection />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-divine-600">
                  <Mail className="w-4 h-4 text-divine-gold" />
                  <span>Updates on new spiritual content</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-divine-600">
                  <Gift className="w-4 h-4 text-divine-gold" />
                  <span>Exclusive discounts on divine items</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-divine-600">
                  <Sparkles className="w-4 h-4 text-divine-gold" />
                  <span>First access to unique spiritual offerings</span>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border-divine-gold/20 focus:border-divine-gold focus:ring-divine-gold/20"
                  />
                  <Button
                    onClick={handleEmailSignup}
                    disabled={emailSignupMutation.isPending}
                    className="bg-gradient-to-r from-divine-gold to-soft-gold hover:from-divine-gold/90 hover:to-soft-gold/90 text-white font-semibold px-6 shadow-lg"
                  >
                    {emailSignupMutation.isPending ? "Joining..." : "Join ✨"}
                  </Button>
                </div>
                
                <p className="text-xs text-divine-500 text-center">
                  By joining, you'll be part of our sacred community of empowered women.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="rounded-2xl shadow-lg border border-soft-gray divine-shadow mt-6">
          <CardContent className="p-6">
            <h3 className="font-playfair text-lg font-semibold text-deep-charcoal mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              {/* Test Milestone Button - Remove in production */}

              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-4 border-red-200 hover:bg-red-50 text-red-600"
                onClick={() => window.location.href = '/api/logout'}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">Sign Out</div>
                  <div className="text-sm text-red-400">End your sacred session</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>



      </main>

      {/* Budget Settings Modal */}
      <BudgetSettingsModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        currentBudget={currentBudget || undefined}
        onBudgetSet={(budget: number) => {
          setCurrentBudget(budget);
          toast({
            title: "Sacred Budget Set",
            description: `Your monthly spiritual budget of $${budget} has been saved.`,
          });
        }}
      />
    </div>
  );
}


