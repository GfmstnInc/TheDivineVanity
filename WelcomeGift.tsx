import { useState } from "react";
import { Download, Heart, ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function WelcomeGift() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showJournalChallenge, setShowJournalChallenge] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const welcomeGiftMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/welcome-gift', 'POST');
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast({
        title: "✨ Sacred Gift Claimed",
        description: "You've earned 75 divine points! Your sacred journey begins now.",
      });

      // Show journal challenge after 2 seconds
      setTimeout(() => {
        setShowJournalChallenge(true);
      }, 2000);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
    },
    onError: (error) => {
      toast({
        title: "Divine Connection Issue",
        description: "Please try again in a moment, beautiful soul.",
        variant: "destructive",
      });
    }
  });

  const handleDownload = async () => {
    welcomeGiftMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      {/* Header */}
      <header className="glass-effect border-b border-soft-gray">
        <div className="px-6 py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="font-playfair text-xl font-semibold text-deep-charcoal">
            Your Sacred Welcome Gift
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="divine-shadow border-divine-gold/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 divine-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>

              <h2 className="font-playfair text-2xl font-semibold text-deep-charcoal mb-4">
                Sacred Morning Ritual Guide
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Begin each day with divine intention. This beautiful guide contains 
                5 sacred practices to align your energy and connect with your highest self.
              </p>

              {!isSubmitted ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleDownload}
                    disabled={welcomeGiftMutation.isPending}
                    className="w-full bg-divine-gold hover:bg-divine-gold/90 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    <Download className="w-5 h-5" />
                    <span>{welcomeGiftMutation.isPending ? "Claiming..." : "Claim Your Sacred Gift"}</span>
                  </Button>
                  
                  <div className="mt-6 p-4 bg-divine-gold/10 rounded-lg border border-divine-gold/20">
                    <h4 className="font-medium text-deep-charcoal mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-divine-gold" />
                      Divine Point Opportunities
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>• Claim Welcome Gift</span>
                        <span className="text-divine-gold font-medium">75 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Complete Daily Journal</span>
                        <span className="text-divine-gold font-medium">25 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Divine Energy Assessment</span>
                        <span className="text-divine-gold font-medium">50 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Complete Daily Ritual</span>
                        <span className="text-divine-gold font-medium">30 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !showJournalChallenge ? (
                <div className="space-y-6">
                  <div className="w-16 h-16 divine-gradient rounded-full flex items-center justify-center mx-auto animate-pulse-gentle">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-deep-charcoal">
                    Sacred Gift Claimed! ✨
                  </h3>
                  <div className="bg-divine-gold/10 rounded-lg p-4 border border-divine-gold/20">
                    <p className="text-divine-gold font-medium text-lg">
                      +75 Divine Points Earned!
                    </p>
                  </div>

                  {/* Sacred Morning Ritual Guide Content */}
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
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-divine-gold rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-deep-charcoal mb-3">
                      Your Sacred Journey Continues
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Beautiful soul, you've taken the first divine step. Now, let us unlock 
                      your next sacred gift through the power of reflection.
                    </p>
                  </div>

                  <Card className="bg-gradient-to-r from-purple-50 to-divine-gold/10 border-divine-gold/30">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-deep-charcoal mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-purple-600" />
                        Sacred 3-Day Journey Challenge
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Journal for 3 consecutive days and unlock your next divine ritual absolutely free.
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <div className="w-6 h-6 bg-divine-gold rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-xs">1</span>
                          </div>
                          <span className="text-gray-600">Today: Begin your sacred reflection (+25 pts)</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-500 font-bold text-xs">2</span>
                          </div>
                          <span className="text-gray-500">Tomorrow: Continue your divine practice</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-500 font-bold text-xs">3</span>
                          </div>
                          <span className="text-gray-500">Day 3: Unlock your next free ritual</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => window.location.href = '/journal'}
                        className="w-full bg-gradient-to-r from-purple-600 to-divine-gold hover:from-purple-700 hover:to-divine-gold/90 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Begin Sacred Journaling</span>
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Continue earning divine points through daily practices and spiritual growth
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-soft-gray">
                <p className="text-xs text-gray-500">
                  By claiming your gift, you're joining a sacred community of divine souls 
                  committed to spiritual growth and transformation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}