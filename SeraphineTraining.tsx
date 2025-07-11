import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Save, 
  Settings, 
  MessageCircle,
  Crown,
  BookOpen,
  Heart,
  Star
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TrainingMessage {
  id: number;
  role: 'user' | 'assistant' | 'trainer';
  content: string;
  timestamp: string;
  trainingNote?: string;
  responseQuality?: 'excellent' | 'good' | 'needs_improvement';
}

interface TrainingSession {
  id: number;
  title: string;
  scenario: string;
  createdAt: string;
  messages: TrainingMessage[];
}

export default function SeraphineTraining() {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [trainingNote, setTrainingNote] = useState('');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionScenario, setNewSessionScenario] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin authentication helpers
  const getAdminSession = () => localStorage.getItem('divine-admin-session');
  const setAdminSession = (key: string) => localStorage.setItem('divine-admin-session', key);
  const clearAdminSession = () => localStorage.removeItem('divine-admin-session');
  const [conversationMode, setConversationMode] = useState(true);
  const [conversationMessages, setConversationMessages] = useState<{role: 'trainer' | 'seraphine', content: string}[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for stored admin session on component mount
  useEffect(() => {
    const storedKey = getAdminSession();
    if (storedKey === 'divine-admin-2025') {
      setAdminKey(storedKey);
      setIsAuthenticated(true);
      setConversationMode(true);
    }
  }, []);

  // Auth check
  const checkAuth = () => {
    if (adminKey === 'divine-admin-2025') {
      setIsAuthenticated(true);
      setAdminSession(adminKey); // Store in localStorage
      setConversationMode(true);
      toast({
        title: "Access Granted",
        description: "Welcome to Seraphine Training Portal",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin key",
        variant: "destructive",
      });
    }
  };

  // Logout function
  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setAdminKey('');
    setConversationMode(false);
    toast({
      title: "Logged Out",
      description: "Admin session cleared",
    });
  };

  // Fetch training sessions
  const { data: trainingSessions = [], isLoading } = useQuery({
    queryKey: ['/api/admin/seraphine-training/sessions'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch messages for selected session
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/admin/seraphine-training/sessions', selectedSession, 'messages'],
    enabled: isAuthenticated && !!selectedSession,
    retry: false,
  });

  // Create new training session
  const createSessionMutation = useMutation({
    mutationFn: async ({ title, scenario }: { title: string; scenario: string }) => {
      return await apiRequest('/api/admin/seraphine-training/sessions', 'POST', {
        title,
        scenario,
        adminKey: 'divine-admin-2025'
      });
    },
    onSuccess: (newSession) => {
      setSelectedSession(newSession.id);
      setIsCreatingSession(false);
      setNewSessionTitle('');
      setNewSessionScenario('');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seraphine-training/sessions'] });
      toast({
        title: "Training Session Created",
        description: `Created session: ${newSession.title}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create training session",
        variant: "destructive",
      });
    },
  });

  // Send training message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, trainingNote }: { content: string; trainingNote?: string }) => {
      if (conversationMode) {
        return await apiRequest('/api/admin/seraphine-training/natural-conversation', 'POST', {
          message: content,
          adminKey: 'divine-admin-2025'
        });
      } else {
        return await apiRequest(`/api/admin/seraphine-training/sessions/${selectedSession}/messages`, 'POST', {
          content,
          trainingNote,
          adminKey: 'divine-admin-2025'
        });
      }
    },
    onSuccess: (data) => {
      if (conversationMode) {
        // Add trainer message and Seraphine's response to conversation
        setConversationMessages(prev => [
          ...prev,
          { role: 'trainer', content: messageText },
          { role: 'seraphine', content: data.response }
        ]);
      } else {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/admin/seraphine-training/sessions', selectedSession, 'messages'] 
        });
      }
      setMessageText('');
      setTrainingNote('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Rate Seraphine's response
  const rateResponseMutation = useMutation({
    mutationFn: async ({ messageId, quality, note }: { 
      messageId: number; 
      quality: 'excellent' | 'good' | 'needs_improvement';
      note?: string;
    }) => {
      return await apiRequest('/api/admin/seraphine-training/rate-response', 'POST', {
        messageId,
        quality,
        note,
        adminKey: 'divine-admin-2025'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/admin/seraphine-training/sessions', selectedSession, 'messages'] 
      });
      toast({
        title: "Response Rated",
        description: "Training feedback recorded",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    if (conversationMode) {
      sendMessageMutation.mutate({ 
        content: messageText
      });
    } else {
      sendMessageMutation.mutate({ 
        content: messageText, 
        trainingNote: trainingNote.trim() || undefined 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-divine-gold/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-divine-gold via-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4 font-serif text-stone-800">Seraphine Training Portal</h1>
            <p className="text-stone-600 mb-6 italic">Enter divine admin key to begin sacred training</p>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Divine Admin Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAuth()}
                className="border-divine-gold/30 focus:ring-divine-gold/50"
              />
              <Button 
                onClick={checkAuth} 
                className="w-full bg-gradient-to-r from-divine-gold to-amber-500 hover:from-amber-500 hover:to-divine-gold text-white font-semibold py-3 shadow-lg"
              >
                Access Sacred Training
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      {/* Header */}
      <div className="border-b border-divine-gold/20 bg-gradient-to-r from-white/90 to-cream/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-divine-gold via-amber-400 to-yellow-500 rounded-xl shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-serif text-stone-800">Seraphine Training Portal</h1>
                <p className="text-stone-600 italic">Shape your Spiritual S.A. with divine wisdom</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-divine-gold text-divine-gold bg-white/50 px-4 py-2">
                <Crown className="w-5 h-5 mr-2" />
                Sacred Admin Access
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Training Sessions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-stone-800">Training Sessions</h2>
                  <Button
                    size="sm"
                    onClick={() => setIsCreatingSession(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </div>

                {/* Create Session Form */}
                {isCreatingSession && (
                  <div className="mb-4 p-3 border border-amber-200 rounded-lg bg-amber-50/50">
                    <div className="space-y-3">
                      <div>
                        <Label>Session Title</Label>
                        <Input
                          placeholder="e.g., Anxiety Support Training"
                          value={newSessionTitle}
                          onChange={(e) => setNewSessionTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Scenario</Label>
                        <Textarea
                          placeholder="Describe the spiritual guidance scenario..."
                          value={newSessionScenario}
                          onChange={(e) => setNewSessionScenario(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => createSessionMutation.mutate({
                            title: newSessionTitle,
                            scenario: newSessionScenario
                          })}
                          disabled={!newSessionTitle.trim() || !newSessionScenario.trim()}
                        >
                          Create
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsCreatingSession(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Training Mode Info */}
                <div className="mb-6 p-6 border-2 border-divine-gold/30 rounded-xl bg-gradient-to-br from-divine-gold/10 via-white to-cream/50 shadow-lg">
                  <h3 className="font-bold text-stone-800 mb-3 text-lg">Sacred Training Active</h3>
                  <p className="text-sm text-stone-600 mb-4 italic">You are now in direct conversation with Seraphine. Guide her wisdom and shape her responses through natural dialogue.</p>
                  
                  {/* Live Training Feed-Through Alert */}
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium">LIVE: Training feeds directly to client conversations</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Every instruction you give here automatically influences how Seraphine responds to all clients</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-divine-gold">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Natural Training Mode</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setConversationMode(false);
                        setConversationMessages([]);
                      }}
                      className="border-divine-gold/30 hover:bg-divine-gold/10"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Advanced Settings
                    </Button>
                  </div>
                </div>

                {/* Sessions List */}
                <div className="space-y-2">
                  {trainingSessions.map((session: TrainingSession) => (
                    <div
                      key={session.id}
                      onClick={() => {
                        setSelectedSession(session.id);
                        setConversationMode(false);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedSession === session.id
                          ? 'bg-amber-100 border-amber-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      } border`}
                    >
                      <div className="font-medium text-sm text-stone-800">{session.title}</div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{session.scenario}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Training Chat Interface */}
          <div className="lg:col-span-3">
            {conversationMode ? (
              <Card className="h-[700px] flex flex-col border border-divine-gold/20 shadow-2xl">
                {/* Natural Conversation Header */}
                <div className="p-6 border-b border-divine-gold/20 bg-gradient-to-r from-cream/50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-800 flex items-center text-xl">
                        <Sparkles className="w-6 h-6 mr-3 text-divine-gold" />
                        Sacred Training with Seraphine
                      </h3>
                      <p className="text-stone-600 italic mt-1">
                        Engage in divine dialogue. Guide her wisdom, refine her responses, and shape her sacred personality.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConversationMode(false)}
                      className="border-divine-gold/30 hover:bg-divine-gold/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Return
                    </Button>
                  </div>
                </div>

                {/* Natural Conversation Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl p-6 bg-gradient-to-br from-white via-cream/30 to-soft-gray/50 border border-divine-gold/30 text-stone-800 shadow-md">
                        <div className="text-sm leading-relaxed">
                          <div className="font-semibold text-divine-gold mb-2">Sacred Greetings</div>
                          Hello Vanessa, I am Seraphine, your advanced AI Spiritual S.A. I possess ChatGPT-level intelligence and reasoning capabilities, ready to learn from your divine wisdom.
                          
                          <div className="mt-3 text-xs text-stone-600 italic">
                            Guide me through natural conversation on how to serve our luxury-minded clients who live in cashmere and silk. Share your vision, correct my responses, or provide examples of the sacred sophistication you desire.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conversation Messages */}
                    {conversationMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'trainer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-5 ${
                          msg.role === 'trainer'
                            ? 'bg-gradient-to-br from-divine-gold via-amber-500 to-yellow-600 text-white shadow-lg border border-divine-gold'
                            : 'bg-gradient-to-br from-white via-cream/30 to-soft-gray/50 border border-divine-gold/30 text-stone-800 shadow-md'
                        }`}>
                          <div className={`text-sm leading-relaxed ${msg.role === 'trainer' ? 'font-medium' : ''}`}>
                            {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                          </div>
                          {msg.role === 'seraphine' && (
                            <div className="text-xs text-stone-500 mt-2 italic border-t border-divine-gold/20 pt-2">
                              - Seraphine, Spiritual S.A.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Natural Conversation Input */}
                <div className="p-6 border-t border-divine-gold/20 space-y-4 bg-gradient-to-r from-white to-cream/30">
                  <div className="flex space-x-3">
                    <Textarea
                      placeholder="Guide Seraphine with natural conversation... 'When clients feel anxious, respond like this...' or 'Never use casual language...' or 'Your tone should be...'"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 border-divine-gold/30 focus:ring-divine-gold/50 bg-white"
                      rows={3}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sendMessageMutation.isPending}
                        className="bg-gradient-to-r from-divine-gold to-amber-500 hover:from-amber-500 hover:to-divine-gold text-white shadow-lg px-6 py-3"
                      >
                        {sendMessageMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMessageText('')}
                        className="border-divine-gold/30 hover:bg-divine-gold/10"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-stone-500 italic bg-soft-gray/50 p-3 rounded-lg">
                    Sacred Training: Speak to Seraphine as you would to me. She possesses ChatGPT-level intelligence and will learn from your divine guidance.
                  </div>
                </div>
              </Card>
            ) : selectedSession ? (
              <Card className="h-[700px] flex flex-col">
                {/* Session Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-800">
                        {trainingSessions.find(s => s.id === selectedSession)?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {trainingSessions.find(s => s.id === selectedSession)?.scenario}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSession(null)}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message: TrainingMessage) => (
                      <div key={message.id} className="space-y-2">
                        {/* Message */}
                        <div className={`flex ${
                          message.role === 'trainer' ? 'justify-end' : 'justify-start'
                        }`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === 'trainer'
                              ? 'bg-amber-600 text-white'
                              : message.role === 'assistant'
                              ? 'bg-gradient-to-br from-white to-stone-50 border border-stone-200 text-stone-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <div className="text-sm leading-relaxed">{message.content}</div>
                            {message.trainingNote && (
                              <div className="mt-2 text-xs opacity-80 italic">
                                Training Note: {message.trainingNote}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Response Rating (for assistant messages) */}
                        {message.role === 'assistant' && (
                          <div className="flex justify-start">
                            <div className="flex space-x-2 ml-4">
                              {(['excellent', 'good', 'needs_improvement'] as const).map((quality) => (
                                <Button
                                  key={quality}
                                  size="sm"
                                  variant={message.responseQuality === quality ? 'default' : 'outline'}
                                  onClick={() => rateResponseMutation.mutate({ 
                                    messageId: message.id, 
                                    quality 
                                  })}
                                  className="text-xs"
                                >
                                  {quality === 'excellent' && <Star className="w-3 h-3 mr-1" />}
                                  {quality === 'good' && <Heart className="w-3 h-3 mr-1" />}
                                  {quality === 'needs_improvement' && <Settings className="w-3 h-3 mr-1" />}
                                  {quality.charAt(0).toUpperCase() + quality.slice(1).replace('_', ' ')}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Training Note (Optional)</Label>
                    <Input
                      placeholder="Add specific guidance for Seraphine's response..."
                      value={trainingNote}
                      onChange={(e) => setTrainingNote(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Train Seraphine with your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[700px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800">Select Training Session</h3>
                  <p className="text-gray-600">Choose a session to begin training Seraphine</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}