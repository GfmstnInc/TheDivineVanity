import { useState, useEffect } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, MessageCircle, Zap, Crown, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import GlobalPaymentRouter from "@/components/GlobalPaymentRouter";

// Load Stripe only for North American markets (optional)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
let stripePromise: Promise<any> | null = null;

if (stripeKey && stripeKey.startsWith('pk_')) {
  stripePromise = loadStripe(stripeKey);
} else {
  console.log('Stripe not configured - using global payment intelligence instead');
}

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/spiritual-chat`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Premium!",
          description: "Your Divine Guidance access has been activated.",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-divine-gold hover:bg-amber-600 text-white font-semibold py-3 text-lg rounded-lg shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
            Processing...
          </div>
        ) : (
          "Complete Premium Upgrade"
        )}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <Link href="/spiritual-chat" className="inline-flex items-center text-gray-600 hover:text-divine-gold mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Divine Guidance
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-divine-gold mr-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-playfair text-4xl font-bold text-deep-charcoal">Upgrade to Premium</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited access to Seraphine and transform your spiritual journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Premium Features */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl text-center text-deep-charcoal mb-4">
                ✨ Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-deep-charcoal">Unlimited Divine Conversations</h3>
                  <p className="text-gray-600 text-sm">Chat with Seraphine anytime for personalized spiritual guidance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-divine-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-deep-charcoal">Energy Insights & Sacred Actions</h3>
                  <p className="text-gray-600 text-sm">Receive personalized divine insights and actionable spiritual practices</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-divine-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-deep-charcoal">Save & Revisit Sessions</h3>
                  <p className="text-gray-600 text-sm">Keep track of your spiritual journey and return to meaningful conversations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-divine-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-deep-charcoal">Priority Divine Support</h3>
                  <p className="text-gray-600 text-sm">Get faster responses and enhanced spiritual guidance tailored to your path</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 mt-6">
                <div className="text-center">
                  <div className="font-playfair text-3xl font-bold text-deep-charcoal">$49</div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-gray-500 mt-1">Cancel anytime</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Payment Router */}
          <GlobalPaymentRouter
            amount={33}
            currency="USD"
            onSuccess={(result) => {
              toast({
                title: "Welcome to Premium!",
                description: result.vanessaMessage || "Your Divine Guidance access has been activated.",
              });
              // Redirect to premium content
              window.location.href = "/spiritual-chat";
            }}
            onError={(error) => {
              toast({
                title: "Payment Error",
                description: error,
                variant: "destructive",
              });
            }}
          />
        </div>

        {/* Alternative Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Prefer to speak with someone directly?
          </p>
          <Button
            onClick={() => window.open("sms:310-990-6264?body=Hi Vanessa, I'm interested in upgrading to premium for Divine Guidance access.", "_self")}
            variant="outline"
            className="border-divine-gold text-divine-gold hover:bg-divine-gold hover:text-white"
          >
            📲 Text Vanessa at (310) 990-6264
          </Button>
        </div>
      </div>
    </div>
  );
}