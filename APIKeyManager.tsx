import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Key, Zap } from 'lucide-react';

interface APIProvider {
  name: string;
  key: string;
  description: string;
  cost: string;
  value: string;
  setValue: (value: string) => void;
  isRequired: boolean;
}

export default function APIKeyManager() {
  const [googleKey, setGoogleKey] = useState('');
  const [elevenlabsKey, setElevenlabsKey] = useState('');
  const [cohereKey, setCohereKey] = useState('');
  const [mistralKey, setMistralKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [stabilityKey, setStabilityKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const providers: APIProvider[] = [
    {
      name: 'Google Gemini',
      key: 'GOOGLE_API_KEY',
      description: 'Advanced reasoning and analysis - excellent for complex spiritual guidance',
      cost: 'Free tier + $0.002/1K tokens',
      value: googleKey,
      setValue: setGoogleKey,
      isRequired: true
    },
    {
      name: 'ElevenLabs',
      key: 'ELEVENLABS_API_KEY', 
      description: 'Premium voice synthesis for Vanessa DI - ultra-realistic voice quality',
      cost: '$22/month starter plan',
      value: elevenlabsKey,
      setValue: setElevenlabsKey,
      isRequired: true
    },
    {
      name: 'Cohere',
      key: 'COHERE_API_KEY',
      description: 'Excellent for embeddings, search, and text processing',
      cost: 'Free tier + pay-as-you-go',
      value: cohereKey,
      setValue: setCohereKey,
      isRequired: false
    },
    {
      name: 'Mistral AI',
      key: 'MISTRAL_API_KEY',
      description: 'European AI for multilingual spiritual support',
      cost: 'Free tier available',
      value: mistralKey,
      setValue: setMistralKey,
      isRequired: false
    },
    {
      name: 'Perplexity',
      key: 'PERPLEXITY_API_KEY',
      description: 'Real-time web research for current spiritual insights',
      cost: '$20/month for API access',
      value: perplexityKey,
      setValue: setPerplexityKey,
      isRequired: false
    },
    {
      name: 'Stability AI',
      key: 'STABILITY_API_KEY',
      description: 'Sacred artwork and spiritual image generation',
      cost: '$20/month for images',
      value: stabilityKey,
      setValue: setStabilityKey,
      isRequired: false
    }
  ];

  const handleTestKey = async (provider: APIProvider) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider.key,
          apiKey: provider.value
        })
      });
      
      const result = await response.json();
      setResults(prev => ({ ...prev, [provider.key]: result.success }));
    } catch (error) {
      console.error(`Error testing ${provider.name}:`, error);
      setResults(prev => ({ ...prev, [provider.key]: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateAll = async () => {
    setIsLoading(true);
    const keyUpdates: Record<string, string> = {};
    
    providers.forEach(provider => {
      if (provider.value.trim()) {
        keyUpdates[provider.key] = provider.value.trim();
      }
    });

    try {
      const response = await fetch('/api/activate-ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKeys: keyUpdates })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Successfully activated ${result.activatedCount} AI providers!`);
        // Test all keys
        for (const provider of providers) {
          if (provider.value.trim()) {
            await handleTestKey(provider);
          }
        }
      }
    } catch (error) {
      console.error('Error activating providers:', error);
      alert('Error activating AI providers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-divine-gold-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-divine-gold mb-4 flex items-center justify-center gap-3">
            <Zap className="w-8 h-8" />
            AI Provider Activation
          </h1>
          <p className="text-divine-gold/80 text-lg">
            Activate your comprehensive AI ecosystem for maximum spiritual intelligence
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {providers.map((provider) => (
            <Card key={provider.key} className="bg-white/80 backdrop-blur border-divine-gold/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-divine-gold" />
                    <CardTitle className="text-divine-gold">{provider.name}</CardTitle>
                    {provider.isRequired && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                    {results[provider.key] !== undefined && (
                      results[provider.key] ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                  <Badge variant="outline" className="text-divine-gold border-divine-gold/30">
                    {provider.cost}
                  </Badge>
                </div>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    type="password"
                    placeholder={`Enter your ${provider.name} API key...`}
                    value={provider.value}
                    onChange={(e) => provider.setValue(e.target.value)}
                    className="flex-1 border-divine-gold/30 focus:border-divine-gold"
                  />
                  <Button
                    onClick={() => handleTestKey(provider)}
                    disabled={!provider.value.trim() || isLoading}
                    variant="outline"
                    className="border-divine-gold text-divine-gold hover:bg-divine-gold hover:text-white"
                  >
                    Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleActivateAll}
            disabled={isLoading || !providers.some(p => p.value.trim())}
            className="bg-gradient-to-r from-divine-gold to-cream-gold text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? 'Activating...' : 'Activate AI Providers'}
          </Button>
          <p className="text-divine-gold/70 mt-4 text-sm">
            Only providers with API keys will be activated. You can add more keys later.
          </p>
        </div>
      </div>
    </div>
  );
}