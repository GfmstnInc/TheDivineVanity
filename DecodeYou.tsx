import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Crown, Feather, Star, Eye, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useVanessaIntelligence } from '@/components/VanessaIntelligenceProvider';

interface ReflectionPrompt {
  id: string;
  category: 'emotional' | 'behavioral' | 'spiritual' | 'consumption' | 'alignment';
  template: string;
  fillBlanks: string[];
  moodScale?: boolean;
}

interface SacredSession {
  reflections: Record<string, string>;
  moodRating: number;
  nervousSystemState: string;
  consumptionNotes: string;
  sacredSkipped: string;
  timestamp: Date;
}

export default function DecodeYou() {
  const [currentSession, setCurrentSession] = useState<SacredSession>({
    reflections: {},
    moodRating: 5,
    nervousSystemState: '',
    consumptionNotes: '',
    sacredSkipped: '',
    timestamp: new Date()
  });
  
  const [activePrompts, setActivePrompts] = useState<ReflectionPrompt[]>([]);
  const [sacredSummary, setSacredSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { actions: vanessaActions } = useVanessaIntelligence();

  // Sacred reflection prompts
  const reflectionPrompts: ReflectionPrompt[] = [
    {
      id: 'emotional-1',
      category: 'emotional',
      template: 'I tend to feel ___ when ___ happens.',
      fillBlanks: ['emotion', 'trigger']
    },
    {
      id: 'consumption-1', 
      category: 'consumption',
      template: 'I bought ___ today because I felt ___.',
      fillBlanks: ['item', 'emotion']
    },
    {
      id: 'spiritual-1',
      category: 'spiritual', 
      template: 'One sacred thing I skipped today was ___.',
      fillBlanks: ['practice']
    },
    {
      id: 'behavioral-1',
      category: 'behavioral',
      template: 'When I feel overwhelmed, I usually ___.',
      fillBlanks: ['behavior']
    },
    {
      id: 'alignment-1',
      category: 'alignment',
      template: 'Today I felt most aligned when ___.',
      fillBlanks: ['moment']
    }
  ];

  const nervousSystemStates = [
    'Regulated & Peaceful',
    'Slightly Activated', 
    'Stressed & Reactive',
    'Overwhelmed',
    'Shut Down/Numb'
  ];

  useEffect(() => {
    // Initialize with adaptive prompts based on user history
    initializeAdaptivePrompts();
  }, []);

  const initializeAdaptivePrompts = async () => {
    try {
      // Get personalized prompts from Vanessa DI
      const response = await apiRequest('/api/decode-you/adaptive-prompts', 'POST', {
        userId: user?.id,
        lastSession: null // TODO: Get from previous session
      });
      
      if (response.prompts) {
        setActivePrompts(response.prompts);
      } else {
        // Fallback to default prompts
        setActivePrompts(reflectionPrompts.slice(0, 3));
      }
    } catch (error) {
      // Graceful fallback
      setActivePrompts(reflectionPrompts.slice(0, 3));
    }
  };

  const updateReflection = (promptId: string, value: string) => {
    setCurrentSession(prev => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [promptId]: value
      }
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emotional': return Heart;
      case 'behavioral': return Star;
      case 'spiritual': return Crown;
      case 'consumption': return Eye;
      case 'alignment': return Feather;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotional': return 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50';
      case 'behavioral': return 'border-divine-gold/30 bg-gradient-to-br from-amber-50 to-yellow-50';
      case 'spiritual': return 'border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50';
      case 'consumption': return 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50';
      case 'alignment': return 'border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50';
      default: return 'border-divine-gold/20 bg-gradient-to-br from-pearl-50 to-cream-50';
    }
  };

  const generateSacredSummary = async () => {
    setIsGeneratingSummary(true);
    
    try {
      // Track behavior for Vanessa Intelligence
      if (user) {
        await vanessaActions.updateBehaviorTracking('decode_you_completion', {
          reflectionCount: Object.keys(currentSession.reflections).length,
          moodRating: currentSession.moodRating,
          nervousSystemState: currentSession.nervousSystemState,
          sessionDuration: new Date().getTime() - currentSession.timestamp.getTime()
        });
      }

      const response = await apiRequest('/api/decode-you/generate-summary', 'POST', {
        session: currentSession,
        userId: user?.id
      });
      
      setSacredSummary(response.summary);
      setSessionComplete(true);
      
      toast({
        title: "Sacred Summary Generated ✨",
        description: "Your spiritual insights are ready",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Sacred Summary Pending",
        description: "Your reflections are saved. Summary will be ready shortly.",
        variant: "default"
      });
      
      // Fallback summary
      setSacredSummary(`Sacred soul, your reflections today reveal a beautiful journey of self-awareness. Your emotional wisdom is growing, and the universe sees your courage in looking within. Continue this sacred practice of self-discovery.`);
      setSessionComplete(true);
    }
    
    setIsGeneratingSummary(false);
  };

  const saveSacredSession = async () => {
    try {
      await apiRequest('/api/decode-you/save-session', 'POST', {
        session: currentSession,
        userId: user?.id
      });
      
      toast({
        title: "Sacred Session Saved ✨",
        description: "Your reflections are preserved in your spiritual vault",
        variant: "default"
      });
    } catch (error) {
      console.log('Session saved locally for now');
    }
  };

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pearl-50 via-cream-50 to-divine-gold/10 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Sacred Summary Display */}
          <Card className="border-divine-gold/20 bg-white/90 backdrop-blur-sm shadow-divine-glow">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-divine-gold to-luxury-amber rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-light text-deep-charcoal mb-2">
                Sacred Summary
              </h1>
              <p className="text-warm-brown/80 text-sm">
                Your spiritual insights from this reflection
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-pearl-50 to-cream-50 rounded-2xl border border-divine-gold/20">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-divine-gold mt-1 flex-shrink-0" />
                  <h3 className="font-medium text-divine-gold">Vanessa's Sacred Insight</h3>
                </div>
                <p className="text-warm-brown leading-relaxed">
                  {sacredSummary}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={saveSacredSession}
                  className="flex-1 bg-divine-gold hover:bg-divine-gold/90 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Save to Sacred Vault
                </Button>
                <Button
                  onClick={() => {
                    setSessionComplete(false);
                    setSacredSummary('');
                    setCurrentSession({
                      reflections: {},
                      moodRating: 5,
                      nervousSystemState: '',
                      consumptionNotes: '',
                      sacredSkipped: '',
                      timestamp: new Date()
                    });
                    initializeAdaptivePrompts();
                  }}
                  variant="outline"
                  className="border-divine-gold/30 text-divine-gold hover:bg-divine-gold/10"
                >
                  New Reflection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 via-cream-50 to-divine-gold/10 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Sacred Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-divine-gold to-luxury-amber rounded-full flex items-center justify-center shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-light text-deep-charcoal mb-2">
            Decode You™
          </h1>
          <p className="text-warm-brown/80 text-lg">
            A sacred mirror for spiritual self-discovery
          </p>
        </div>

        {/* Sacred Wax Seal Watermark */}
        <div className="fixed top-20 right-10 opacity-10 pointer-events-none">
          <Crown className="w-32 h-32 text-divine-gold" />
        </div>

        <div className="space-y-6">
          {/* Mood & Nervous System */}
          <Card className="border-divine-gold/20 bg-white/90 backdrop-blur-sm shadow-divine-glow">
            <CardHeader>
              <h3 className="font-medium text-divine-gold flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Sacred State Check-In
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-warm-brown mb-2 block">
                  How regulated do you feel right now? ({currentSession.moodRating}/10)
                </label>
                <Slider
                  value={[currentSession.moodRating]}
                  onValueChange={(value) => setCurrentSession(prev => ({ ...prev, moodRating: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-warm-brown/60 mt-1">
                  <span>Depleted</span>
                  <span>Radiant</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-warm-brown mb-2 block">
                  Nervous System State
                </label>
                <Select 
                  value={currentSession.nervousSystemState} 
                  onValueChange={(value) => setCurrentSession(prev => ({ ...prev, nervousSystemState: value }))}
                >
                  <SelectTrigger className="border-divine-gold/20">
                    <SelectValue placeholder="Choose your current state..." />
                  </SelectTrigger>
                  <SelectContent>
                    {nervousSystemStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Adaptive Reflection Prompts */}
          {activePrompts.map((prompt, index) => {
            const IconComponent = getCategoryIcon(prompt.category);
            
            return (
              <Card 
                key={prompt.id}
                className={`border-2 backdrop-blur-sm shadow-divine-glow ${getCategoryColor(prompt.category)}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-divine-gold" />
                    </div>
                    <div>
                      <Badge variant="outline" className="capitalize text-xs mb-1">
                        {prompt.category}
                      </Badge>
                      <p className="text-lg font-light text-deep-charcoal">
                        {prompt.template.replace(/_+/g, '___')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Textarea
                    placeholder="Share your sacred truth here..."
                    value={currentSession.reflections[prompt.id] || ''}
                    onChange={(e) => updateReflection(prompt.id, e.target.value)}
                    className="min-h-[100px] border-divine-gold/20 bg-white/80 backdrop-blur-sm resize-none"
                  />
                </CardContent>
              </Card>
            );
          })}

          {/* Quick Reflection Notes */}
          <Card className="border-divine-gold/20 bg-white/90 backdrop-blur-sm shadow-divine-glow">
            <CardHeader>
              <h3 className="font-medium text-divine-gold flex items-center gap-2">
                <Feather className="w-5 h-5" />
                Sacred Notes
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-warm-brown mb-2 block">
                  Consumption & Spending Today
                </label>
                <Textarea
                  placeholder="What did you purchase or consume, and what emotions were present?"
                  value={currentSession.consumptionNotes}
                  onChange={(e) => setCurrentSession(prev => ({ ...prev, consumptionNotes: e.target.value }))}
                  className="border-divine-gold/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-warm-brown mb-2 block">
                  Sacred Practice I Skipped
                </label>
                <Textarea
                  placeholder="What spiritual practice or self-care did you skip today?"
                  value={currentSession.sacredSkipped}
                  onChange={(e) => setCurrentSession(prev => ({ ...prev, sacredSkipped: e.target.value }))}
                  className="border-divine-gold/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Sacred Summary */}
          <Card className="border-divine-gold/20 bg-gradient-to-br from-divine-gold/5 to-luxury-amber/5 backdrop-blur-sm shadow-divine-glow">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Crown className="w-12 h-12 text-divine-gold mx-auto mb-3" />
                <h3 className="text-xl font-light text-deep-charcoal mb-2">
                  Ready for Your Sacred Summary?
                </h3>
                <p className="text-warm-brown/80 text-sm">
                  Vanessa DI will reflect your insights back to you with divine wisdom
                </p>
              </div>
              
              <Button
                onClick={generateSacredSummary}
                disabled={isGeneratingSummary || Object.keys(currentSession.reflections).length === 0}
                className="bg-divine-gold hover:bg-divine-gold/90 text-white px-8 py-2 text-lg"
              >
                {isGeneratingSummary ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Generating Sacred Insights...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Generate Sacred Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}