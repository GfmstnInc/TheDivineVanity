import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Star, Moon, Sun, Zap, Calendar, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface AstrologyReading {
  id: number;
  userId: string;
  type: 'daily' | 'monthly';
  date: string;
  sunSign: string;
  moonPhase: string;
  planetaryInfluences: string[];
  personalizedMessage: string;
  loveAndRelationships: string;
  careerAndFinances: string;
  healthAndWellness: string;
  spiritualGuidance: string;
  luckyNumbers: number[];
  luckyColors: string[];
  crystalRecommendation: string;
  affirmation: string;
  isPaid: boolean;
  paymentAmount: number;
  createdAt: string;
}

interface User {
  id: string;
  firstName?: string;
  birthDate?: string;
  subscriptionStatus: string;
}

const StarField = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; constellation?: string }>>([]);

  useEffect(() => {
    // Generate random stars and constellation patterns
    const generateStars = () => {
      const starArray = [];
      const constellations = ['Orion', 'Leo', 'Scorpio', 'Aquarius', 'Pisces', 'Gemini'];
      
      // Random stars
      for (let i = 0; i < 200; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
      
      // Constellation stars (connected patterns)
      constellations.forEach((constellation, index) => {
        const baseX = (index % 3) * 33 + 10;
        const baseY = Math.floor(index / 3) * 40 + 20;
        
        for (let j = 0; j < 5; j++) {
          starArray.push({
            id: 1000 + index * 10 + j,
            x: baseX + (Math.random() - 0.5) * 20,
            y: baseY + (Math.random() - 0.5) * 15,
            size: Math.random() * 2 + 2,
            opacity: 0.9,
            constellation
          });
        }
      });
      
      setStars(starArray);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full bg-white transition-all duration-1000 ${
              star.constellation ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: star.constellation 
                ? `0 0 ${star.size * 2}px rgba(255, 215, 0, 0.8)` 
                : `0 0 ${star.size}px rgba(255, 255, 255, 0.5)`
            }}
          />
        ))}
        
        {/* Shooting stars */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-60" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse opacity-40" />
        
        {/* Constellation lines (decorative) */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="constellation" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <line x1="10" y1="20" x2="30" y2="15" stroke="rgba(255,215,0,0.3)" strokeWidth="1" />
              <line x1="30" y1="15" x2="45" y2="35" stroke="rgba(255,215,0,0.3)" strokeWidth="1" />
              <line x1="45" y1="35" x2="20" y2="40" stroke="rgba(255,215,0,0.3)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#constellation)" />
        </svg>
      </div>
    </div>
  );
};

const PaymentForm = ({ onSuccess }: { onSuccess: (reading: AstrologyReading) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent?.status === 'succeeded') {
        const response = await apiRequest('POST', '/api/astrology/monthly-paid', {
          paymentIntentId: paymentIntent.id
        });

        if (response.ok) {
          const data = await response.json();
          toast({
            title: "Payment Successful",
            description: "Your personalized monthly astrology forecast is ready!",
          });
          onSuccess(data.reading);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="p-6 rounded-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-200 backdrop-blur-sm">
        <h3 className="font-playfair text-lg font-semibold text-indigo-800 mb-2 flex items-center">
          <Moon className="w-5 h-5 mr-2" />
          Your Monthly Cosmic Forecast
        </h3>
        <p className="text-indigo-700">
          Receive Vanessa's personalized monthly astrology reading based on your birth chart, 
          current planetary transits, and your unique spiritual journey.
        </p>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300"
      >
        {processing ? "Processing..." : "Get Monthly Forecast - $33"}
      </Button>
    </form>
  );
};

export default function DailyAstrology() {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [selectedReading, setSelectedReading] = useState<AstrologyReading | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user data
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  // Get today's astrology reading
  const { data: dailyReading } = useQuery<AstrologyReading>({
    queryKey: ['/api/astrology/daily'],
  });

  // Get monthly readings
  const { data: monthlyReadings } = useQuery<{ readings: AstrologyReading[] }>({
    queryKey: ['/api/astrology/monthly'],
  });

  // Create monthly forecast payment intent
  const createMonthlyPayment = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/astrology/create-monthly-payment', {});
      return response.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
    },
  });

  const handleMonthlyForecast = () => {
    if (!user?.birthDate) {
      toast({
        title: "Birth Date Required",
        description: "Please update your profile with your birth date for personalized astrology readings.",
        variant: "destructive",
      });
      return;
    }

    const isPremium = ['premium', 'active'].includes(user.subscriptionStatus);
    
    if (isPremium) {
      // Premium users get monthly forecast for free
      apiRequest('POST', '/api/astrology/monthly-free', {})
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setSelectedReading(data.reading);
            queryClient.invalidateQueries({ queryKey: ['/api/astrology/monthly'] });
            toast({
              title: "Monthly Forecast Ready",
              description: "Your personalized astrology forecast has been generated!",
            });
          }
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to generate forecast",
            variant: "destructive",
          });
        });
    } else {
      // Non-premium users need to pay
      createMonthlyPayment.mutate();
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const isPremium = user && ['premium', 'active'].includes(user.subscriptionStatus);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 min-h-screen p-4 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <Star className="w-5 h-5 text-yellow-300 mr-2" />
              <span className="text-white font-medium">Divine Astrology</span>
              <Star className="w-5 h-5 text-yellow-300 ml-2" />
            </div>
            <h1 className="font-playfair text-4xl font-bold text-white mb-2">
              Your Cosmic Journey
            </h1>
            <p className="text-white/80 text-lg">{currentDate}</p>
          </div>

          {/* Daily Astrology Reading */}
          {dailyReading && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl flex items-center">
                  <Sun className="w-6 h-6 text-yellow-300 mr-2" />
                  Today's Cosmic Guidance
                  <Badge className="ml-auto bg-yellow-500/20 text-yellow-300 border-yellow-300/30">
                    {dailyReading.sunSign}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {dailyReading.personalizedMessage}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-semibold text-pink-300 mb-2">💕 Love & Relationships</h3>
                      <p className="text-sm">{dailyReading.loveAndRelationships}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-semibold text-green-300 mb-2">💰 Career & Finances</h3>
                      <p className="text-sm">{dailyReading.careerAndFinances}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-300 mb-2">🌿 Health & Wellness</h3>
                      <p className="text-sm">{dailyReading.healthAndWellness}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-300 mb-2">✨ Spiritual Guidance</h3>
                      <p className="text-sm">{dailyReading.spiritualGuidance}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm">Lucky Numbers: {dailyReading.luckyNumbers?.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                    <span className="text-sm">Lucky Colors: {dailyReading.luckyColors?.join(', ')}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-4 border border-indigo-300/30">
                  <h3 className="font-semibold text-indigo-300 mb-2">🔮 Crystal Recommendation</h3>
                  <p className="text-sm mb-2">{dailyReading.crystalRecommendation}</p>
                  <div className="italic text-indigo-200 text-sm">
                    "{dailyReading.affirmation}"
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monthly Forecast Section */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="w-6 h-6 text-indigo-300 mr-2" />
                  Monthly Cosmic Forecast
                </div>
                {isPremium && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-300/30">
                    Premium
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-6">
                Get Vanessa's detailed monthly astrology forecast personalized to your birth chart, 
                current life circumstances, and spiritual journey. Each reading is unique and 
                tailored specifically for you.
              </p>
              
              <Button
                onClick={handleMonthlyForecast}
                disabled={createMonthlyPayment.isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
              >
                {createMonthlyPayment.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processing...
                  </div>
                ) : isPremium ? (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Get Free Monthly Forecast
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Get Monthly Forecast - $33
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Payment Modal */}
          {showPayment && clientSecret && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="max-w-md w-full bg-white">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-center text-deep-charcoal">
                    Monthly Astrology Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#6366F1',
                          colorBackground: '#FEFEFE',
                          colorText: '#1F2937',
                          borderRadius: '8px'
                        }
                      }
                    }}
                  >
                    <PaymentForm onSuccess={(reading) => {
                      setSelectedReading(reading);
                      setShowPayment(false);
                      queryClient.invalidateQueries({ queryKey: ['/api/astrology/monthly'] });
                    }} />
                  </Elements>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setShowPayment(false)}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Monthly Readings */}
          {monthlyReadings?.readings && monthlyReadings.readings.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="font-playfair text-xl">Your Monthly Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyReadings.readings.slice(0, 3).map((reading) => (
                    <div 
                      key={reading.id}
                      className="bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => setSelectedReading(reading)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">
                          {new Date(reading.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </h3>
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-300/30">
                          {reading.sunSign}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/80 line-clamp-2">
                        {reading.personalizedMessage}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Reading Modal */}
          {selectedReading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-white">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-center text-deep-charcoal flex items-center justify-between">
                    <span>Monthly Forecast</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedReading(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-800">
                  <div className="text-center">
                    <Badge className="bg-indigo-100 text-indigo-700">
                      {new Date(selectedReading.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })} - {selectedReading.sunSign}
                    </Badge>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed mb-6">
                      {selectedReading.personalizedMessage}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-pink-50 rounded-lg p-4">
                          <h3 className="font-semibold text-pink-700 mb-2">💕 Love & Relationships</h3>
                          <p className="text-sm text-pink-600">{selectedReading.loveAndRelationships}</p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4">
                          <h3 className="font-semibold text-green-700 mb-2">💰 Career & Finances</h3>
                          <p className="text-sm text-green-600">{selectedReading.careerAndFinances}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-700 mb-2">🌿 Health & Wellness</h3>
                          <p className="text-sm text-blue-600">{selectedReading.healthAndWellness}</p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h3 className="font-semibold text-purple-700 mb-2">✨ Spiritual Guidance</h3>
                          <p className="text-sm text-purple-600">{selectedReading.spiritualGuidance}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200 mt-6">
                      <h3 className="font-semibold text-indigo-700 mb-2">🔮 Crystal & Affirmation</h3>
                      <p className="text-sm text-indigo-600 mb-2">{selectedReading.crystalRecommendation}</p>
                      <div className="italic text-indigo-700">
                        "{selectedReading.affirmation}"
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}