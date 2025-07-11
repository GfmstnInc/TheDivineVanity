/**
 * NEURAL PATTERN LEARNING INTERFACE
 * Advanced unconscious pattern analysis and behavioral prediction dashboard
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Users,
  Clock,
  ArrowRight,
  Lightbulb,
  Heart,
  Compass
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface NeuralPattern {
  pattern: string;
  frequency: number;
  strength: number;
  triggers: string[];
  outcomes: string[];
  category: 'behavioral' | 'emotional' | 'spiritual' | 'relational';
}

interface PatternPrediction {
  pattern: string;
  probability: number;
  timeframe: string;
  intervention: string;
  prevention: string;
}

interface UnconsciousProfile {
  userId: string;
  deepPatterns: NeuralPattern[];
  behavioralTriggers: Map<string, number>;
  emotionalSignatures: string[];
  spiritualBlocks: string[];
  growthPotentials: string[];
  lastAnalysis: string;
}

export default function NeuralPatterns() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [scenario, setScenario] = useState('');
  const [timeframe, setTimeframe] = useState('7d');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [emotionalState, setEmotionalState] = useState('');
  const [targetPattern, setTargetPattern] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  
  const queryClient = useQueryClient();

  // Unconscious Analysis
  const analysisMutation = useMutation({
    mutationFn: async () => {
      // Mock data for demonstration - in production this would use real user data
      const behaviorData = [
        { action: 'meditation', timestamp: new Date().toISOString(), duration: 20 },
        { action: 'journaling', timestamp: new Date().toISOString(), mood: 'reflective' },
        { action: 'social_interaction', timestamp: new Date().toISOString(), type: 'avoided' }
      ];
      
      const communicationData = [
        { message: 'I feel overwhelmed lately', sentiment: 'negative', timestamp: new Date().toISOString() },
        { message: 'Trying to stay positive', sentiment: 'mixed', timestamp: new Date().toISOString() }
      ];
      
      const journalEntries = [
        { content: 'Feeling stuck in old patterns', date: new Date().toISOString() },
        { content: 'Want to break free from limiting beliefs', date: new Date().toISOString() }
      ];

      const response = await fetch('/api/neural/unconscious-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ behaviorData, communicationData, journalEntries })
      });
      return response.json();
    }
  });

  // Behavioral Prediction
  const predictionMutation = useMutation({
    mutationFn: async (data: { scenario: string; timeframe: string }) => {
      const response = await fetch('/api/neural/behavioral-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  });

  // Pattern Interruption
  const interruptionMutation = useMutation({
    mutationFn: async (data: { currentBehavior: string; emotionalState: string }) => {
      const response = await fetch('/api/neural/pattern-interruption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  });

  // Neural Rewiring
  const rewiringMutation = useMutation({
    mutationFn: async (data: { targetPattern: string; desiredOutcome: string }) => {
      const response = await fetch('/api/neural/neural-rewiring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  });

  // Collective Patterns
  const { data: collectiveData } = useQuery({
    queryKey: ['collective-patterns'],
    queryFn: async () => {
      const response = await fetch('/api/neural/collective-patterns');
      return response.json();
    }
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavioral': return <Activity className="w-4 h-4" />;
      case 'emotional': return <Heart className="w-4 h-4" />;
      case 'spiritual': return <Compass className="w-4 h-4" />;
      case 'relational': return <Users className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Brain className="w-12 h-12 text-indigo-600 animate-pulse" />
              <Activity className="w-6 h-6 text-pink-500 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Neural Pattern Learning
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced unconscious pattern analysis, behavioral prediction, and neural pathway rewiring for spiritual evolution
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Prediction
            </TabsTrigger>
            <TabsTrigger value="interruption" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Interruption
            </TabsTrigger>
            <TabsTrigger value="rewiring" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Rewiring
            </TabsTrigger>
            <TabsTrigger value="collective" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Collective
            </TabsTrigger>
          </TabsList>

          {/* Unconscious Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  Deep Unconscious Pattern Analysis
                </CardTitle>
                <CardDescription>
                  Analyze hidden patterns from your behavior, communication, and spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    This analysis uses your existing platform data including journal entries, behavior patterns, and communication to identify unconscious patterns.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={() => analysisMutation.mutate()}
                  disabled={analysisMutation.isPending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {analysisMutation.isPending ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing Unconscious Patterns...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Perform Deep Analysis
                    </>
                  )}
                </Button>

                {analysisMutation.data && (
                  <div className="space-y-6">
                    {/* Unconscious Profile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Deep Patterns
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            {analysisMutation.data.unconsciousProfile?.deepPatterns?.length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Identified patterns</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Growth Areas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">
                            {analysisMutation.data.unconsciousProfile?.growthPotentials?.length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Opportunities</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {analysisMutation.data.insights?.length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Key insights</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pattern Details */}
                    {analysisMutation.data.unconsciousProfile?.deepPatterns && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Identified Neural Patterns</h3>
                        <div className="grid gap-4">
                          {analysisMutation.data.unconsciousProfile.deepPatterns.map((pattern: NeuralPattern, idx: number) => (
                            <Card key={idx} className="border border-gray-200 dark:border-gray-700">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {getCategoryIcon(pattern.category)}
                                    <span className="font-medium">{pattern.pattern}</span>
                                  </div>
                                  <Badge variant="outline" className="capitalize">
                                    {pattern.category}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Frequency</Label>
                                    <Progress value={pattern.frequency * 100} className="h-2 mt-1" />
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {(pattern.frequency * 100).toFixed(0)}%
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Strength</Label>
                                    <Progress value={pattern.strength * 100} className="h-2 mt-1" />
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {(pattern.strength * 100).toFixed(0)}%
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Triggers</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {pattern.triggers.map((trigger, i) => (
                                        <Badge key={i} variant="destructive" className="text-xs">
                                          {trigger}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Outcomes</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {pattern.outcomes.map((outcome, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {outcome}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Insights & Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {analysisMutation.data.insights && (
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-blue-600" />
                              Key Insights
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {analysisMutation.data.insights.map((insight: string, idx: number) => (
                                <div key={idx} className="text-sm p-2 bg-white dark:bg-gray-800 rounded border">
                                  {insight}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {analysisMutation.data.recommendations && (
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Target className="w-4 h-4 text-green-600" />
                              Recommendations
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {analysisMutation.data.recommendations.map((rec: string, idx: number) => (
                                <div key={idx} className="text-sm p-2 bg-white dark:bg-gray-800 rounded border">
                                  {rec}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavioral Prediction Tab */}
          <TabsContent value="prediction" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Behavioral Pattern Prediction
                </CardTitle>
                <CardDescription>
                  Predict future behaviors and patterns based on unconscious analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scenario">Scenario or situation</Label>
                    <Textarea
                      id="scenario"
                      placeholder="Describe a situation, challenge, or environment you want predictions for..."
                      value={scenario}
                      onChange={(e) => setScenario(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Prediction timeframe</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Next 24 hours</SelectItem>
                        <SelectItem value="7d">Next 7 days</SelectItem>
                        <SelectItem value="30d">Next 30 days</SelectItem>
                        <SelectItem value="90d">Next 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => predictionMutation.mutate({ scenario, timeframe })}
                  disabled={!scenario.trim() || predictionMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {predictionMutation.isPending ? (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                      Generating Predictions...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Generate Behavioral Predictions
                    </>
                  )}
                </Button>

                {predictionMutation.data && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="text-center">
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold text-purple-600">
                            {predictionMutation.data.predictions?.length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Predictions</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="text-center">
                        <CardContent className="pt-4">
                          <div className="text-lg font-semibold">
                            {predictionMutation.data.riskAssessment?.includes('High') ? (
                              <span className="text-red-600">High Risk</span>
                            ) : predictionMutation.data.riskAssessment?.includes('Moderate') ? (
                              <span className="text-yellow-600">Moderate</span>
                            ) : (
                              <span className="text-green-600">Low Risk</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">Risk Level</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="text-center">
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold text-blue-600">
                            {predictionMutation.data.interventions?.length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Interventions</div>
                        </CardContent>
                      </Card>
                    </div>

                    {predictionMutation.data.predictions && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pattern Predictions</h3>
                        <div className="grid gap-4">
                          {predictionMutation.data.predictions.map((prediction: PatternPrediction, idx: number) => (
                            <Card key={idx} className="border border-gray-200 dark:border-gray-700">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-medium">{prediction.pattern}</h4>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-100 text-blue-800">
                                      {(prediction.probability * 100).toFixed(0)}%
                                    </Badge>
                                    <Badge variant="outline">
                                      {prediction.timeframe}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Progress value={prediction.probability * 100} className="h-2" />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                                      <Label className="text-xs text-orange-600">Intervention</Label>
                                      <p className="mt-1">{prediction.intervention}</p>
                                    </div>
                                    <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                                      <Label className="text-xs text-green-600">Prevention</Label>
                                      <p className="mt-1">{prediction.prevention}</p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with other tabs... Pattern Interruption, Neural Rewiring, Collective Patterns */}
          
        </Tabs>
      </div>
    </div>
  );
}