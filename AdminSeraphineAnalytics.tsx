import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Clock, 
  Target, 
  Heart,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface SeraphineAnalysis {
  id: number;
  userId: string;
  coachId: string;
  emotionalState: string;
  keyThemes: string[];
  spiritualNeeds: string[];
  recommendedActions: string[];
  suggestedSessions: string[];
  journeyStage: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  summary: string;
  messagesAnalyzed: number;
  createdAt: string;
}

interface SeraphineInsight {
  id: number;
  userId: string;
  coachId: string;
  originalMessage: string;
  insight: string;
  createdAt: string;
}

interface SeraphineCheckin {
  id: number;
  userId: string;
  personalizedMessage: string;
  reflectionQuestions: string[];
  spiritualFocus: string;
  energyAssessment: string;
  sentAt: string;
  respondedAt?: string;
  response?: string;
}

export default function AdminSeraphineAnalytics() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClientName, setSelectedClientName] = useState('');
  const [quickInsightMessage, setQuickInsightMessage] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sample client data - in production, this would come from your user database
  const clients = [
    { id: '1751766692911', name: 'Vanessa Rich' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Emily Chen' },
    { id: '4', name: 'Jessica Martinez' }
  ];

  // Fetch analyses for selected client
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['seraphine-analyses', selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      const response = await apiRequest(`/api/seraphine/analyses/${selectedClientId}`);
      return response.analyses || [];
    },
    enabled: !!selectedClientId
  });

  // Fetch check-ins for selected client
  const { data: checkins, isLoading: checkinsLoading } = useQuery({
    queryKey: ['seraphine-checkins', selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      const response = await apiRequest(`/api/seraphine/checkins/${selectedClientId}`);
      return response.checkins || [];
    },
    enabled: !!selectedClientId
  });

  // Create new analysis
  const analyzeMessagesMutation = useMutation({
    mutationFn: async ({ clientUserId, clientName }: { clientUserId: string; clientName: string }) => {
      return await apiRequest('POST', '/api/seraphine/analyze-messages', {
        clientUserId,
        clientName
      });
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "New sacred message analysis has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ['seraphine-analyses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to analyze messages",
        variant: "destructive",
      });
    }
  });

  // Send weekly check-in
  const sendCheckInMutation = useMutation({
    mutationFn: async ({ clientUserId, clientName }: { clientUserId: string; clientName: string }) => {
      return await apiRequest('POST', '/api/seraphine/send-weekly-checkin', {
        clientUserId,
        clientName
      });
    },
    onSuccess: () => {
      toast({
        title: "Check-in Sent",
        description: "Weekly spiritual check-in has been sent to client.",
      });
      queryClient.invalidateQueries({ queryKey: ['seraphine-checkins'] });
    },
    onError: (error: any) => {
      toast({
        title: "Check-in Error",
        description: error.message || "Failed to send check-in",
        variant: "destructive",
      });
    }
  });

  // Get quick insight
  const quickInsightMutation = useMutation({
    mutationFn: async ({ message, clientName, clientUserId }: { message: string; clientName: string; clientUserId: string }) => {
      return await apiRequest('POST', '/api/seraphine/quick-insight', {
        message,
        clientName,
        clientUserId
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Quick Insight Generated",
        description: "Spiritual insight has been generated for this message.",
      });
      setQuickInsightMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "Insight Error",
        description: error.message || "Failed to generate insight",
        variant: "destructive",
      });
    }
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-divine-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-divine-gold/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-divine-gold" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-deep-charcoal">Seraphine Analytics</h1>
          </div>
          <p className="text-divine-600 text-lg">
            Sacred AI insights and client spiritual journey analysis
          </p>
        </div>

        {/* Client Selection */}
        <Card className="mb-8 border-divine-200 shadow-divine">
          <CardHeader className="bg-gradient-to-r from-divine-50 to-cream-50 border-b border-divine-200">
            <CardTitle className="flex items-center gap-2 text-divine-900">
              <Users className="h-5 w-5" />
              Select Client
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-divine-900 mb-2">
                  Choose Client
                </label>
                <Select value={selectedClientId} onValueChange={(value) => {
                  setSelectedClientId(value);
                  const client = clients.find(c => c.id === value);
                  setSelectedClientName(client?.name || '');
                }}>
                  <SelectTrigger className="border-divine-200 focus:border-divine-gold">
                    <SelectValue placeholder="Select a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={() => selectedClientId && selectedClientName && analyzeMessagesMutation.mutate({ 
                    clientUserId: selectedClientId, 
                    clientName: selectedClientName 
                  })}
                  disabled={!selectedClientId || analyzeMessagesMutation.isPending}
                  className="bg-divine-gold hover:bg-divine-gold/90 text-white"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {analyzeMessagesMutation.isPending ? 'Analyzing...' : 'Analyze Messages'}
                </Button>
                <Button
                  onClick={() => selectedClientId && selectedClientName && sendCheckInMutation.mutate({ 
                    clientUserId: selectedClientId, 
                    clientName: selectedClientName 
                  })}
                  disabled={!selectedClientId || sendCheckInMutation.isPending}
                  variant="outline"
                  className="border-divine-gold text-divine-gold hover:bg-divine-gold/10"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {sendCheckInMutation.isPending ? 'Sending...' : 'Send Check-in'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedClientId && (
          <Tabs defaultValue="analyses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-divine-50 border border-divine-200">
              <TabsTrigger value="analyses" className="data-[state=active]:bg-divine-gold data-[state=active]:text-white">
                Sacred Analyses
              </TabsTrigger>
              <TabsTrigger value="checkins" className="data-[state=active]:bg-divine-gold data-[state=active]:text-white">
                Weekly Check-ins
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-divine-gold data-[state=active]:text-white">
                Quick Insights
              </TabsTrigger>
            </TabsList>

            {/* Sacred Analyses Tab */}
            <TabsContent value="analyses" className="space-y-6">
              {analysesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-divine-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-divine-600">Loading sacred analyses...</p>
                </div>
              ) : analyses?.length === 0 ? (
                <Card className="border-divine-200 shadow-divine">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-divine-300 mx-auto mb-4" />
                      <p className="text-divine-600">No analyses yet. Click "Analyze Messages" to generate insights.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {analyses?.map((analysis: SeraphineAnalysis) => (
                    <Card key={analysis.id} className="border-divine-200 shadow-divine">
                      <CardHeader className="bg-gradient-to-r from-divine-50 to-cream-50 border-b border-divine-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-divine-gold/20 rounded-lg">
                              <Star className="h-5 w-5 text-divine-gold" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-divine-900">
                                {analysis.journeyStage}
                              </CardTitle>
                              <p className="text-sm text-divine-600">
                                {new Date(analysis.createdAt).toLocaleDateString()} • {analysis.messagesAnalyzed} messages analyzed
                              </p>
                            </div>
                          </div>
                          <Badge className={`${getUrgencyColor(analysis.urgencyLevel)} font-medium`}>
                            {analysis.urgencyLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-divine-900 mb-2 flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              Emotional State
                            </h4>
                            <p className="text-divine-700 bg-divine-50 p-3 rounded-lg">
                              {analysis.emotionalState}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-divine-900 mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Key Themes
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.keyThemes.map((theme, i) => (
                                <Badge key={i} variant="secondary" className="bg-cream-100 text-divine-800">
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-divine-900 mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Spiritual Needs
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.spiritualNeeds.map((need, i) => (
                                <Badge key={i} variant="outline" className="border-divine-gold text-divine-gold">
                                  {need}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-divine-900 mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Recommended Actions
                            </h4>
                            <ul className="space-y-1">
                              {analysis.recommendedActions.map((action, i) => (
                                <li key={i} className="text-divine-700 flex items-start gap-2">
                                  <ArrowRight className="h-4 w-4 mt-0.5 text-divine-gold flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-divine-900 mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Suggested Sessions
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.suggestedSessions.map((session, i) => (
                                <Badge key={i} className="bg-divine-gold text-white">
                                  {session}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-divine-900 mb-2">Sacred Summary</h4>
                            <p className="text-divine-700 bg-gradient-to-r from-divine-50 to-cream-50 p-4 rounded-lg italic">
                              "{analysis.summary}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Weekly Check-ins Tab */}
            <TabsContent value="checkins" className="space-y-6">
              {checkinsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-divine-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-divine-600">Loading check-ins...</p>
                </div>
              ) : checkins?.length === 0 ? (
                <Card className="border-divine-200 shadow-divine">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-divine-300 mx-auto mb-4" />
                      <p className="text-divine-600">No check-ins sent yet. Click "Send Check-in" to create one.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {checkins?.map((checkin: SeraphineCheckin) => (
                    <Card key={checkin.id} className="border-divine-200 shadow-divine">
                      <CardHeader className="bg-gradient-to-r from-divine-50 to-cream-50 border-b border-divine-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-divine-gold/20 rounded-lg">
                              <Clock className="h-5 w-5 text-divine-gold" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-divine-900">
                                Weekly Check-in
                              </CardTitle>
                              <p className="text-sm text-divine-600">
                                Sent: {new Date(checkin.sentAt).toLocaleDateString()}
                                {checkin.respondedAt && ` • Responded: ${new Date(checkin.respondedAt).toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          <Badge className={checkin.respondedAt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {checkin.respondedAt ? 'Responded' : 'Pending'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-divine-900 mb-2">Personalized Message</h4>
                            <p className="text-divine-700 bg-divine-50 p-3 rounded-lg">
                              {checkin.personalizedMessage}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-divine-900 mb-2">Spiritual Focus</h4>
                            <Badge variant="outline" className="border-divine-gold text-divine-gold">
                              {checkin.spiritualFocus}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-medium text-divine-900 mb-2">Reflection Questions</h4>
                            <ul className="space-y-1">
                              {checkin.reflectionQuestions.map((question, i) => (
                                <li key={i} className="text-divine-700 flex items-start gap-2">
                                  <span className="text-divine-gold font-medium">{i + 1}.</span>
                                  {question}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {checkin.response && (
                            <div>
                              <h4 className="font-medium text-divine-900 mb-2">Client Response</h4>
                              <p className="text-divine-700 bg-gradient-to-r from-divine-50 to-cream-50 p-4 rounded-lg">
                                {checkin.response}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Quick Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <Card className="border-divine-200 shadow-divine">
                <CardHeader className="bg-gradient-to-r from-divine-50 to-cream-50 border-b border-divine-200">
                  <CardTitle className="flex items-center gap-2 text-divine-900">
                    <TrendingUp className="h-5 w-5" />
                    Generate Quick Insight
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-divine-900 mb-2">
                        Client Message
                      </label>
                      <Textarea
                        placeholder="Enter a client message to get quick spiritual insight..."
                        value={quickInsightMessage}
                        onChange={(e) => setQuickInsightMessage(e.target.value)}
                        rows={4}
                        className="border-divine-200 focus:border-divine-gold"
                      />
                    </div>
                    <Button
                      onClick={() => selectedClientName && quickInsightMessage && quickInsightMutation.mutate({
                        message: quickInsightMessage,
                        clientName: selectedClientName,
                        clientUserId: selectedClientId
                      })}
                      disabled={!quickInsightMessage || quickInsightMutation.isPending}
                      className="bg-divine-gold hover:bg-divine-gold/90 text-white"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      {quickInsightMutation.isPending ? 'Generating...' : 'Get Insight'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {quickInsightMutation.data && (
                <Card className="border-divine-200 shadow-divine">
                  <CardHeader className="bg-gradient-to-r from-divine-50 to-cream-50 border-b border-divine-200">
                    <CardTitle className="flex items-center gap-2 text-divine-900">
                      <Sparkles className="h-5 w-5" />
                      Seraphine's Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-divine-700 bg-gradient-to-r from-divine-50 to-cream-50 p-4 rounded-lg italic">
                      "{quickInsightMutation.data.insight}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}