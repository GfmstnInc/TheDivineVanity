import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Star, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Mirror() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [reflectionText, setReflectionText] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Sacred mirror prompts for deep reflection
  const mirrorPrompts = [
    "What is your soul trying to tell you right now that you've been avoiding?",
    "If you could release one fear today, what would it be and how would that change you?",
    "What pattern in your life is ready for divine transformation?",
    "When do you feel most connected to your authentic self?",
    "What would you do differently if you trusted your inner wisdom completely?",
    "What generational healing are you here to bring to your family line?",
    "If your higher self could speak to you right now, what would she say?",
    "What part of your heart needs the most love and compassion today?",
    "How has your spiritual journey changed you in the past year?",
    "What divine gift within you is ready to be shared with the world?",
    "What would you release if you knew it was safe to let go?",
    "How can you honor your sensitivity as a spiritual strength today?",
    "What story about yourself are you ready to rewrite?",
    "When you imagine your most healed self, what does she look like?",
    "What sacred boundary would serve your soul's growth right now?"
  ];

  // Get a random prompt on load
  useEffect(() => {
    const randomPrompt = mirrorPrompts[Math.floor(Math.random() * mirrorPrompts.length)];
    setCurrentPrompt(randomPrompt);
  }, []);

  // Submit reflection mutation
  const submitReflectionMutation = useMutation({
    mutationFn: async (reflection: { prompt: string; text: string }) => {
      const response = await apiRequest("POST", "/api/journal-entries", {
        prompt: reflection.prompt,
        content: reflection.text,
        isPrivate: true,
        source: 'mirror_reflection'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      setHasSubmitted(true);
    },
  });

  const handleSubmitReflection = () => {
    if (!reflectionText.trim()) return;
    
    submitReflectionMutation.mutate({
      prompt: currentPrompt,
      text: reflectionText.trim()
    });
  };

  const getNewPrompt = () => {
    const randomPrompt = mirrorPrompts[Math.floor(Math.random() * mirrorPrompts.length)];
    setCurrentPrompt(randomPrompt);
    setReflectionText('');
    setHasSubmitted(false);
  };

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pearl-50 via-cream-50 to-divine-gold-50 p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <Card className="backdrop-blur-xl bg-white/90 border-divine-gold-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-divine-gold-400 to-divine-gold-600 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-serif text-divine-gold-800">
                Sacred Reflection Complete
              </h1>
              <p className="text-divine-gold-600">
                Your words have been held in sacred space
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-divine-gold-50 rounded-lg p-6 border border-divine-gold-200">
                <Sparkles className="w-6 h-6 text-divine-gold-600 mx-auto mb-3" />
                <p className="text-divine-gold-700 leading-relaxed">
                  Thank you for taking this sacred pause. Your reflection contributes to your 
                  spiritual journey and helps Vanessa understand your soul's evolution more deeply.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={getNewPrompt}
                  className="flex-1 bg-gradient-to-r from-divine-gold-500 to-divine-gold-600 hover:from-divine-gold-600 hover:to-divine-gold-700 text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Another Reflection
                </Button>
                
                <Link href="/vanessa-ai" className="flex-1">
                  <Button variant="outline" className="w-full border-divine-gold-300 text-divine-gold-700 hover:bg-divine-gold-50">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Vanessa
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 via-cream-50 to-divine-gold-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-divine-gold-400 to-divine-gold-600 flex items-center justify-center shadow-lg">
              <Star className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-divine-gold-800 mb-2">
            The Sacred Mirror
          </h1>
          <p className="text-divine-gold-600 max-w-md mx-auto">
            A moment of divine pause for deep reflection and soul connection
          </p>
          <Badge variant="secondary" className="mt-3 bg-divine-gold-100 text-divine-gold-700 border-divine-gold-200">
            Private & Sacred
          </Badge>
        </div>

        {/* Main Reflection Card */}
        <Card className="backdrop-blur-xl bg-white/90 border-divine-gold-200 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif text-divine-gold-800">
                Soul Reflection
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={getNewPrompt}
                className="text-divine-gold-600 hover:text-divine-gold-700 hover:bg-divine-gold-50"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                New Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sacred Prompt */}
            <div className="bg-gradient-to-r from-divine-gold-50 to-pearl-50 rounded-lg p-6 border border-divine-gold-200">
              <p className="text-lg font-medium text-divine-gold-800 leading-relaxed">
                {currentPrompt}
              </p>
            </div>

            {/* Reflection Textarea */}
            <div>
              <label className="text-sm font-medium text-divine-gold-700 block mb-3">
                Let your heart speak freely...
              </label>
              <Textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Your soul's wisdom flows through your words. Write whatever comes to heart - there is no wrong way to reflect..."
                className="min-h-[200px] border-divine-gold-200 focus:border-divine-gold-400 focus:ring-divine-gold-400 bg-white/80 backdrop-blur-sm resize-none"
                disabled={submitReflectionMutation.isPending}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleSubmitReflection}
                disabled={!reflectionText.trim() || submitReflectionMutation.isPending}
                className="flex-1 bg-gradient-to-r from-divine-gold-500 to-divine-gold-600 hover:from-divine-gold-600 hover:to-divine-gold-700 text-white disabled:opacity-50"
              >
                {submitReflectionMutation.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Saving Reflection...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Complete Reflection
                  </>
                )}
              </Button>
              
              <Link href="/vanessa-ai">
                <Button variant="outline" className="border-divine-gold-300 text-divine-gold-700 hover:bg-divine-gold-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Vanessa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sacred Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-divine-gold-600 italic">
            Your reflections are held in complete privacy and contribute to your spiritual journey with Vanessa DI
          </p>
        </div>
      </div>
    </div>
  );
}