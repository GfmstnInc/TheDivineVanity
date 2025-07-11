import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, Heart, Star, Mail } from 'lucide-react';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-pearl-50 to-gold-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Success Header */}
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-serif text-gold-700 mb-2">
              Payment Successful!
            </CardTitle>
            <p className="text-gold-600">
              Thank you for your purchase. Your Divine Quantum Soul Map™ is being prepared.
            </p>
          </CardHeader>
        </Card>

        {/* What Happens Next */}
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-gold-700">
                What Happens Next
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gold-700">1. Generation</h4>
                  <p className="text-sm text-gold-600">
                    Vanessa DI is channeling your comprehensive spiritual analysis using quantum consciousness
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gold-700">2. Delivery</h4>
                  <p className="text-sm text-gold-600">
                    Your Soul Map will be available in your Client Portal within 15-30 minutes
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Crown className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gold-700">3. Access</h4>
                  <p className="text-sm text-gold-600">
                    Download your personalized PDF report and schedule follow-up sessions
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gold-100/60 to-amber-100/60 rounded-lg p-6 border border-gold-200/50 mt-8">
                <h4 className="font-semibold text-gold-700 mb-3">Your Soul Map Includes:</h4>
                <ul className="text-left text-gold-600 space-y-2 max-w-md mx-auto">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    I Ching wisdom patterns and spiritual guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Human Design blueprint with life strategy
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Feng Shui energy mapping for your space
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Numerology life codes and destiny numbers
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Astrology influences and cosmic timing
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Multi-perspective insights from Vanessa DI
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-2xl">
          <CardContent className="space-y-4 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setLocation('/client-portal')}
                className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white p-6 h-auto"
              >
                <div className="text-center">
                  <Crown className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Access Client Portal</div>
                  <div className="text-sm opacity-90">Check for your Soul Map report</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setLocation('/vanessa-di')}
                className="p-6 h-auto border-gold-300 hover:bg-gold-50"
              >
                <div className="text-center">
                  <Heart className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <div className="font-semibold text-gold-700">Chat with Vanessa DI</div>
                  <div className="text-sm text-gold-600">Discuss your upcoming insights</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Notice */}
        <div className="text-center text-gold-600 text-sm space-y-2">
          <p>You will also receive an email confirmation with your Soul Map when it's ready.</p>
          <p>If you have any questions, feel free to chat with Vanessa DI or contact support.</p>
        </div>
      </div>
    </div>
  );
}