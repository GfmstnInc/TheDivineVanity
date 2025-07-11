import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Coffee, Moon, Sparkles, Smile, Frown, Zap, CloudRain, Timer, Play, Pause, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import BottomNavigation from "@/components/BottomNavigation";

interface Mood {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  category: string;
  createdAt: string;
}

interface Meditation {
  id: number;
  title: string;
  description: string;
  duration: number;
  type: string;
  content: {
    introduction: string;
    steps: string[];
    conclusion: string;
  };
  difficulty: string;
  targetMoods: string[];
  tags: string[];
  audioUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const getMoodIcon = (mood: Mood) => {
  const iconMap: { [key: string]: React.ElementType } = {
    "😰": Frown,
    "😤": Zap,
    "😢": CloudRain,
    "🤩": Sparkles,
    "😌": Moon,
    "🙏": Heart,
  };
  return iconMap[mood.icon] || Brain;
};

const getMoodColor = (category: string) => {
  return category === "positive" ? "text-green-600" : "text-amber-600";
};

export default function Meditation() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const queryClient = useQueryClient();

  // Fetch all moods from API
  const { data: moods = [], isLoading: moodsLoading } = useQuery<Mood[]>({
    queryKey: ['/api/moods'],
  });

  // Fetch meditations for selected mood
  const { data: meditations = [], isLoading } = useQuery<Meditation[]>({
    queryKey: ['/api/meditations/mood', selectedMood?.id],
    enabled: !!selectedMood,
  });

  const sessionMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/meditation-sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meditation-sessions'] });
    },
  });

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setSelectedMeditation(null);
    setIsPlaying(false);
  };

  const handleMeditationSelect = (meditation: Meditation) => {
    setSelectedMeditation(meditation);
    setCurrentStep(0);
    setTimeRemaining(meditation.duration * 60); // Convert minutes to seconds
  };

  const handleStartMeditation = () => {
    setIsPlaying(true);
    setIsTimerActive(true);
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setIsTimerActive(false);
          handleCompleteMeditation();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);
  };

  const handlePauseMeditation = () => {
    setIsPlaying(false);
    setIsTimerActive(false);
  };

  const handleCompleteMeditation = () => {
    if (selectedMeditation && selectedMood) {
      sessionMutation.mutate({
        meditationId: selectedMeditation.id,
        duration: selectedMeditation.duration,
        preMoodId: selectedMood.id,
        completed: true,
      });
    }
    
    setIsPlaying(false);
    setSelectedMeditation(null);
    setSelectedMood(null);
    setCurrentStep(0);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setSelectedMeditation(null);
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeRemaining(null);
    setIsTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Mood Selection
  if (!selectedMood) {
    if (moodsLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-white pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-700">Loading sacred moods...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-white pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl font-light text-deep-charcoal mb-4">
              Sacred Meditation Journey
            </h1>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              How are you feeling right now? Choose your current emotional state to receive personalized meditation recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moods.map((mood) => {
              const IconComponent = getMoodIcon(mood);
              const colorClass = getMoodColor(mood.category);
              
              return (
                <Card 
                  key={mood.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-amber-200 hover:border-amber-300 cursor-pointer"
                  onClick={() => handleMoodSelect(mood)}
                >
                  <div className="text-center">
                    <IconComponent className={`w-12 h-12 mx-auto mb-4 ${colorClass}`} />
                    <h3 className="font-playfair text-xl font-medium text-deep-charcoal mb-2">
                      {mood.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {mood.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Step 2: Meditation Selection
  if (selectedMood && !selectedMeditation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-white pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center mb-8">
            <Button 
              onClick={handleReset}
              variant="outline" 
              className="mb-4 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              ← Choose Different Mood
            </Button>
            <h1 className="text-4xl font-light text-amber-900 mb-2">
              Perfect Meditations for {selectedMood.name}
            </h1>
            <p className="text-lg text-amber-700">
              These divine practices are specifically chosen to support your current emotional state.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-divine-gold border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-divine-gold">Finding your perfect meditations...</p>
            </div>
          ) : meditations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-divine-gold text-lg">No meditations available for this mood yet.</p>
              <Button onClick={handleReset} className="mt-4 bg-divine-gold hover:bg-divine-gold/90 text-white">
                Choose Different Mood
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {meditations.map((meditation: Meditation) => (
                <Card 
                  key={meditation.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-divine-gold/30 hover:border-divine-gold/50"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-medium text-deep-charcoal">
                        {meditation.title}
                      </h3>
                      <div className="flex items-center text-divine-gold text-sm">
                        <Timer className="w-4 h-4 mr-1" />
                        {meditation.duration} min
                      </div>
                    </div>
                    <p className="text-deep-charcoal/70 mb-4 leading-relaxed">
                      {meditation.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-divine-gold/80 capitalize">
                        {meditation.difficulty} • {meditation.type}
                      </span>
                      <Button 
                        onClick={() => handleMeditationSelect(meditation)}
                        className="bg-divine-gold hover:bg-divine-gold/90 text-white"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Step 3: Meditation Player
  if (selectedMeditation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-white pb-20">
        <div className="max-w-2xl mx-auto p-4">
          <div className="text-center mb-8">
            <Button 
              onClick={handleReset}
              variant="outline" 
              className="mb-4 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              ← Back to Moods
            </Button>
            <h1 className="text-3xl font-light text-amber-900 mb-2">
              {selectedMeditation.title}
            </h1>
            {timeRemaining !== null && (
              <div className="text-2xl font-light text-amber-700">
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          <Card className="p-8 bg-white/80 backdrop-blur-sm border-amber-200">
            {!isPlaying ? (
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-6 text-amber-600" />
                <p className="text-lg text-gray-800 mb-8 leading-relaxed">
                  {selectedMeditation.content.introduction}
                </p>
                <Button
                  onClick={handleStartMeditation}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin Meditation
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="animate-pulse mb-6">
                  <Sparkles className="w-16 h-16 mx-auto text-amber-600" />
                </div>
                <p className="text-lg text-gray-800 mb-8 leading-relaxed">
                  {selectedMeditation.content.steps[currentStep % selectedMeditation.content.steps.length]}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handlePauseMeditation}
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    onClick={handleCompleteMeditation}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Complete
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {timeRemaining !== null && (
            <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-amber-700">Progress</span>
                <span className="text-sm text-amber-700">
                  {Math.round(((selectedMeditation.duration * 60 - timeRemaining) / (selectedMeditation.duration * 60)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((selectedMeditation.duration * 60 - timeRemaining) / (selectedMeditation.duration * 60)) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return null;
}