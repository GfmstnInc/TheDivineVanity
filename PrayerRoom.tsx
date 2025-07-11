import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Flame, Plus, Send } from 'lucide-react';
import PrayerLibrary from '@/components/PrayerLibrary';
import PrayerRequestForm from '@/components/PrayerRequestForm';
import PrayerWall from '@/components/PrayerWall';

export default function PrayerRoom() {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gold/20 pb-20">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-divine-gold to-soft-gold rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-deep-charcoal mb-2">
            The Divine Prayer Room
          </h1>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
            A sacred space for prayer, reflection, and divine connection
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/50 border border-divine-gold/20">
            <TabsTrigger 
              value="library"
              className="data-[state=active]:bg-divine-gold data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Prayers
            </TabsTrigger>
            <TabsTrigger 
              value="request"
              className="data-[state=active]:bg-divine-gold data-[state=active]:text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Request
            </TabsTrigger>
            <TabsTrigger 
              value="wall"
              className="data-[state=active]:bg-divine-gold data-[state=active]:text-white"
            >
              <Flame className="w-4 h-4 mr-2" />
              Prayer Wall
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-0">
            <PrayerLibrary />
          </TabsContent>

          <TabsContent value="request" className="mt-0">
            <PrayerRequestForm onSuccess={() => setActiveTab('wall')} />
          </TabsContent>

          <TabsContent value="wall" className="mt-0">
            <PrayerWall />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}