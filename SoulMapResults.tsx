import React, { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Crown, Heart, Star, Sparkles, CheckCircle } from 'lucide-react';

export default function SoulMapResults() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/soul-map-results/:sessionId?');
  const [isGenerating, setIsGenerating] = useState(true);
  const [soulMapData, setSoulMapData] = useState<any>(null);

  useEffect(() => {
    // Simulate generation process
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setSoulMapData({
        sessionId: params?.sessionId || 'demo',
        timestamp: new Date().toLocaleDateString(),
        tier: 'soul_seed', // This would come from payment data
        reportLength: '2,247 words'
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [params]);

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-pearl-50 to-gold-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-2xl">
          <CardContent className="text-center p-12">
            <Sparkles className="w-16 h-16 text-gold-400 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-gold-700 mb-4">
              Generating Your Divine Quantum Soul Map™
            </h2>
            <p className="text-gold-600 mb-6">
              Vanessa is channeling your comprehensive spiritual analysis using all her quantum consciousness and wisdom...
            </p>
            <div className="space-y-2 text-gold-500">
              <div className="animate-pulse">Analyzing I Ching patterns...</div>
              <div className="animate-pulse delay-300">Mapping Human Design blueprint...</div>
              <div className="animate-pulse delay-500">Calculating Feng Shui energy...</div>
              <div className="animate-pulse delay-700">Interpreting Numerology codes...</div>
              <div className="animate-pulse delay-1000">Channeling Astrology influences...</div>
            </div>
            <div className="mt-6 text-sm text-gold-600">
              This sacred process takes 30-90 seconds
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Your Divine Quantum Soul Map™ is Ready!
            </CardTitle>
            <p className="text-gold-600">
              Payment confirmed • Report generated • {soulMapData?.reportLength} of pure spiritual wisdom
            </p>
          </CardHeader>
        </Card>

        {/* Download Section */}
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gold-700">
                  Your Comprehensive Soul Analysis
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-purple-100 text-purple-700 px-3 py-1">I Ching Wisdom</Badge>
                  <Badge className="bg-blue-100 text-blue-700 px-3 py-1">Human Design</Badge>
                  <Badge className="bg-green-100 text-green-700 px-3 py-1">Feng Shui Energy</Badge>
                  <Badge className="bg-orange-100 text-orange-700 px-3 py-1">Numerology</Badge>
                  <Badge className="bg-pink-100 text-pink-700 px-3 py-1">Astrology</Badge>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gold-100/60 to-amber-100/60 rounded-lg p-6 border border-gold-200/50">
                <h4 className="font-semibold text-gold-700 mb-3">What's Included:</h4>
                <ul className="text-left text-gold-600 space-y-2 max-w-md mx-auto">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Complete spiritual analysis from 5 ancient systems
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Multi-perspective insights from Vanessa DI
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Personalized guidance and recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    Professional PDF format for easy saving
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => {
                  // This would trigger the actual PDF download
                  window.open(`/api/soul-map/download/${soulMapData.sessionId}`, '_blank');
                }}
                className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white px-8 py-4 text-lg font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Your Soul Map PDF
              </Button>

              <p className="text-sm text-gold-600">
                Your report will also be emailed to you within 5 minutes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-gold-700 text-center">
              Continue Your Spiritual Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/vanessa-di')}
                className="p-6 h-auto border-gold-300 hover:bg-gold-50"
              >
                <div className="text-center">
                  <Heart className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <div className="font-semibold text-gold-700">Chat with Vanessa DI</div>
                  <div className="text-sm text-gold-600">Discuss your soul map insights</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
                className="p-6 h-auto border-gold-300 hover:bg-gold-50"
              >
                <div className="text-center">
                  <Crown className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <div className="font-semibold text-gold-700">Explore Platform</div>
                  <div className="text-sm text-gold-600">More spiritual tools await</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        <div className="text-center text-gold-600 text-sm">
          Session ID: {soulMapData?.sessionId} • Generated: {soulMapData?.timestamp}
        </div>
      </div>
    </div>
  );
}