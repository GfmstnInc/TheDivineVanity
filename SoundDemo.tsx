import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Crown, Heart, Sparkles } from "lucide-react";
import { useLuxurySounds, type SoundOption } from "@/hooks/useLuxurySounds";

export default function SoundDemo() {
  const [selectedSound, setSelectedSound] = useState<SoundOption>('gentle-chime');
  const [volume, setVolume] = useState(0.3);
  const [audioStatus, setAudioStatus] = useState<string>('Ready');
  
  const sounds = useLuxurySounds({ volume, soundOption: selectedSound });

  const testSound = async (soundFn: () => Promise<void>, soundName: string) => {
    try {
      setAudioStatus(`Playing ${soundName}...`);
      await soundFn();
      setAudioStatus('Audio played successfully');
      setTimeout(() => setAudioStatus('Ready'), 2000);
    } catch (error) {
      setAudioStatus(`Error: ${error.message || error}`);
      setTimeout(() => setAudioStatus('Ready'), 3000);
    }
  };

  const soundOptions = [
    {
      id: 'gentle-chime' as SoundOption,
      name: 'Gentle Divine Chime',
      description: 'Soft, warm chime with golden overtones - perfect for sacred interactions',
      icon: Heart,
      color: 'from-divine-gold to-soft-gold'
    },
    {
      id: 'soft-bell' as SoundOption,
      name: 'Elegant Sacred Bell',
      description: 'Refined bell sound with divine resonance - ideal for navigation',
      icon: Crown,
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'crystal-tap' as SoundOption,
      name: 'Crystal Clarity Tap',
      description: 'Crystal-like tap with spiritual clarity - great for confirmations',
      icon: Sparkles,
      color: 'from-blue-400 to-cyan-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      {/* Header */}
      <header className="glass-effect border-b border-soft-gray sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 divine-gradient rounded-full flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-playfair text-xl font-semibold text-deep-charcoal">
                Luxury Sound Options
              </h1>
              <p className="text-sm text-gray-600">Choose your divine audio experience</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Audio Setup Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-800">Audio Setup Required</h3>
            </div>
            <p className="text-sm text-blue-700">
              Click any sound button below to enable audio. Some browsers require user interaction to play sounds.
              Open your browser's developer console (F12) to see detailed audio debugging information.
            </p>
          </div>
          {/* Volume Control */}
          <Card className="mb-8 border-divine-gold/20">
            <CardHeader>
              <CardTitle className="font-playfair text-deep-charcoal flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Volume Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Quiet</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-soft-gold/30 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-600">Louder</span>
                <span className="text-sm font-medium text-divine-gold w-12">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Sound Options Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {soundOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedSound === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    isSelected 
                      ? 'border-divine-gold ring-2 ring-divine-gold/20 bg-divine-gold/5' 
                      : 'border-divine-gold/20 hover:border-divine-gold/40'
                  }`}
                  onClick={() => setSelectedSound(option.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-playfair text-lg font-semibold text-deep-charcoal mb-2">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {option.description}
                    </p>
                    {isSelected && (
                      <div className="inline-flex items-center text-xs text-divine-gold font-medium">
                        <Crown className="w-3 h-3 mr-1" />
                        Selected
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Test Buttons */}
          <Card className="border-divine-gold/20">
            <CardHeader>
              <CardTitle className="font-playfair text-deep-charcoal text-center">
                Test Your Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {/* Audio Status */}
              <div className="mb-4 p-3 bg-soft-gold/10 rounded-lg text-center">
                <p className="text-sm font-medium text-deep-charcoal">
                  Status: <span className="text-divine-gold">{audioStatus}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => testSound(sounds.playGentleChime, 'Gentle Chime')}
                  variant={selectedSound === 'gentle-chime' ? 'default' : 'outline'}
                  className={selectedSound === 'gentle-chime' ? 'divine-gradient text-white' : 'border-divine-gold text-divine-gold hover:bg-divine-gold/10'}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Test Gentle Chime
                </Button>
                
                <Button
                  onClick={() => testSound(sounds.playSoftBell, 'Sacred Bell')}
                  variant={selectedSound === 'soft-bell' ? 'default' : 'outline'}
                  className={selectedSound === 'soft-bell' ? 'divine-gradient text-white' : 'border-divine-gold text-divine-gold hover:bg-divine-gold/10'}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Test Sacred Bell
                </Button>
                
                <Button
                  onClick={() => testSound(sounds.playCrystalTap, 'Crystal Tap')}
                  variant={selectedSound === 'crystal-tap' ? 'default' : 'outline'}
                  className={selectedSound === 'crystal-tap' ? 'divine-gradient text-white' : 'border-divine-gold text-divine-gold hover:bg-divine-gold/10'}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Test Crystal Tap
                </Button>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={() => testSound(sounds.playClickSound, `Selected (${selectedSound.replace('-', ' ')})`)}
                  size="lg"
                  className="divine-gradient text-white px-8 py-3 font-medium"
                >
                  Play Selected Sound ({selectedSound.replace('-', ' ')})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card className="mt-8 border-divine-gold/20 bg-gradient-to-r from-divine-gold/5 to-cream/30">
            <CardContent className="p-6">
              <h3 className="font-playfair text-lg font-semibold text-deep-charcoal mb-3">
                Sound Characteristics
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Gentle Divine Chime:</strong> Warm, nurturing tones perfect for daily interactions and sacred moments</p>
                <p><strong>Elegant Sacred Bell:</strong> Refined and sophisticated, ideal for navigation and menu selections</p>
                <p><strong>Crystal Clarity Tap:</strong> Crisp and precise, excellent for confirmations and important actions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}