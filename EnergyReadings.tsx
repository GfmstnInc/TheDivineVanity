import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, CreditCard, Star, Gem, Wand2, Heart, Calendar } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface EnergyReading {
  id: number;
  prompt: string;
  insight: string;
  ritualRecommendation: string;
  crystalRecommendation: string;
  affirmation: string;
  isPaid: boolean;
  paymentAmount: number;
  createdAt: string;
}

interface MonthlyStatus {
  isPremium: boolean;
  hasMonthlyReading: boolean;
  readingsThisMonth: number;
  message: string;
}

const PaymentForm = ({ prompt, clientSecret, onSuccess }: { 
  prompt: string; 
  clientSecret: string; 
  onSuccess: (reading: EnergyReading) => void;
}) => {
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
        // Process the energy reading
        const response = await apiRequest('POST', '/api/energy-readings/paid', {
          prompt,
          paymentIntentId: paymentIntent.id
        });

        if (response.ok) {
          const data = await response.json();
          toast({
            title: "Payment Successful",
            description: "Your divine energy reading is ready!",
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
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <h3 className="font-playfair text-lg font-semibold text-purple-800 mb-2">
          Your Spiritual Inquiry
        </h3>
        <p className="text-purple-700 italic">"{prompt}"</p>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
      >
        {processing ? "Processing..." : "Complete Your Energy Reading - $33"}
      </Button>
    </form>
  );
};

export default function EnergyReadings() {
  const [prompt, setPrompt] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [selectedReading, setSelectedReading] = useState<EnergyReading | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get monthly status
  const { data: monthlyStatus } = useQuery<MonthlyStatus>({
    queryKey: ['/api/energy-readings/monthly-status'],
  });

  // Get user's reading history
  const { data: readingsData } = useQuery<{ readings: EnergyReading[] }>({
    queryKey: ['/api/energy-readings'],
  });

  // Create energy reading mutation
  const createReadingMutation = useMutation({
    mutationFn: async (data: { prompt: string }) => {
      const response = await apiRequest('POST', '/api/energy-readings', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Reading Complete",
          description: data.message,
        });
        setSelectedReading(data.reading);
        queryClient.invalidateQueries({ queryKey: ['/api/energy-readings'] });
        queryClient.invalidateQueries({ queryKey: ['/api/energy-readings/monthly-status'] });
      }
    },
    onError: async (error: any) => {
      const errorText = await error.response?.text();
      const errorData = errorText ? JSON.parse(errorText) : {};
      
      if (errorData.requiresPayment) {
        // Create payment intent
        const paymentResponse = await apiRequest('POST', '/api/energy-readings/payment-intent');
        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.clientSecret);
        setShowPayment(true);
      } else {
        toast({
          title: "Error",
          description: errorData.message || "Failed to create reading",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter your spiritual inquiry",
        description: "Share what guidance you're seeking from the universe",
        variant: "destructive",
      });
      return;
    }

    createReadingMutation.mutate({ prompt: prompt.trim() });
  };

  const handlePaymentSuccess = (reading: EnergyReading) => {
    setSelectedReading(reading);
    setShowPayment(false);
    setPrompt('');
    queryClient.invalidateQueries({ queryKey: ['/api/energy-readings'] });
    queryClient.invalidateQueries({ queryKey: ['/api/energy-readings/monthly-status'] });
  };

  if (showPayment && clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl font-bold text-purple-800 mb-4">
              Divine Energy Reading
            </h1>
            <p className="text-purple-600">Complete your payment to receive your personalized spiritual guidance</p>
          </div>

          <Card className="border-2 border-purple-200 shadow-xl">
            <CardContent className="p-8">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm 
                  prompt={prompt} 
                  clientSecret={clientSecret} 
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowPayment(false)}
              className="text-purple-600 border-purple-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedReading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl font-bold text-purple-800 mb-4">
              Your Divine Energy Reading
            </h1>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {selectedReading.isPaid ? 'Premium Reading' : 'Complimentary Reading'}
            </Badge>
          </div>

          <div className="grid gap-6">
            {/* Spiritual Inquiry */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Sparkles className="w-5 h-5" />
                  Your Spiritual Inquiry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="italic text-purple-700 text-lg">"{selectedReading.prompt}"</p>
              </CardContent>
            </Card>

            {/* Divine Insight */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Star className="w-5 h-5" />
                  Divine Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{selectedReading.insight}</p>
              </CardContent>
            </Card>

            {/* Sacred Ritual */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Wand2 className="w-5 h-5" />
                  Sacred Ritual Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{selectedReading.ritualRecommendation}</p>
              </CardContent>
            </Card>

            {/* Crystal Guidance */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Gem className="w-5 h-5" />
                  Crystal Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{selectedReading.crystalRecommendation}</p>
              </CardContent>
            </Card>

            {/* Divine Affirmation */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Heart className="w-5 h-5" />
                  Your Divine Affirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                  <p className="text-purple-800 font-semibold text-lg text-center italic">
                    "{selectedReading.affirmation}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => setSelectedReading(null)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Request Another Reading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-purple-800 mb-4">
            Divine Energy Readings
          </h1>
          <p className="text-purple-600 text-lg">
            Receive personalized spiritual insights and divine guidance
          </p>
        </div>

        {/* Premium Status */}
        {monthlyStatus && (
          <Card className="mb-8 border-2 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-800">
                    {monthlyStatus.isPremium ? 'Premium Member Benefits' : 'Reading Pricing'}
                  </h3>
                  <p className="text-purple-600">{monthlyStatus.message}</p>
                </div>
                <div className="text-right">
                  {monthlyStatus.isPremium ? (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Premium
                    </Badge>
                  ) : (
                    <span className="text-2xl font-bold text-purple-800">$33</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Reading Form */}
        <Card className="mb-8 border-2 border-purple-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-purple-800 font-playfair text-2xl">
              Request Your Divine Energy Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-purple-800 font-semibold mb-3">
                  What spiritual guidance are you seeking?
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Share your question, challenge, or area where you seek divine clarity..."
                  className="min-h-[120px] border-purple-200 focus:border-purple-400"
                />
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={createReadingMutation.isPending || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
              >
                {createReadingMutation.isPending ? (
                  "Channeling Divine Wisdom..."
                ) : monthlyStatus?.isPremium && !monthlyStatus.hasMonthlyReading ? (
                  "Receive Your Complimentary Reading"
                ) : (
                  "Request Reading - $33"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reading History */}
        {readingsData && readingsData.readings.length > 0 && (
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Calendar className="w-5 h-5" />
                Your Previous Readings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readingsData.readings.slice(0, 3).map((reading) => (
                  <div
                    key={reading.id}
                    onClick={() => setSelectedReading(reading)}
                    className="p-4 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={reading.isPaid ? "default" : "secondary"}>
                        {reading.isPaid ? "Paid" : "Complimentary"}
                      </Badge>
                      <span className="text-sm text-purple-600">
                        {new Date(reading.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2 italic">"{reading.prompt}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}