import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Plus, MessageCircle, Heart, Zap, Star, Save, RotateCcw, CheckCircle, Crown, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useLuxurySounds } from "@/hooks/useLuxurySounds";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  energyInsight?: string;
  sacredAction?: string;
  ritualUrl?: string;
  createdAt: string;
}

interface ChatConversation {
  id: number;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SpiritualChat() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const [showSeraphineOptions, setShowSeraphineOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { playGentleChime } = useLuxurySounds();

  // Check if user is premium (assume true for vanessa.rich@aol.com)
  const isPremiumUser = user?.email === "vanessa.rich@aol.com" || user?.subscriptionStatus === "premium";
  const dailyLimit = isPremiumUser ? 50 : 9;

  // Fetch conversations
  const { data: conversations = [] } = useQuery<ChatConversation[]>({
    queryKey: ["/api/chat/conversations"],
    retry: false,
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery<ChatMessage[]>({
    queryKey: [`/api/chat/conversations/${selectedConversation}/messages`],
    enabled: !!selectedConversation,
    retry: false,
  });



  // Create new conversation - automatically shows Seraphine's greeting with options
  const createConversationMutation = useMutation({
    mutationFn: async (title?: string) => {
      return await apiRequest(`/api/chat/conversations`, "POST", { title });
    },
    onSuccess: (newConversation) => {
      playGentleChime();
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${newConversation.id}/messages`] });
      setSelectedConversation(newConversation.id);
      // Options will automatically show when Seraphine's greeting loads
    },
  });

  // Reset to fresh Seraphine greeting
  const resetConversation = async () => {
    try {
      await apiRequest('/api/chat/conversations/reset', 'DELETE');
      setSelectedConversation(null);
      setShowSeraphineOptions(false);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      playGentleChime();
    } catch (error) {
      console.error('Error resetting conversations:', error);
    }
  };

  // Handle Seraphine option selection
  const handleSeraphineOption = (option: string) => {
    setMessageText("");
    sendMessageMutation.mutate({ content: option });
    setShowSeraphineOptions(false);
    playGentleChime();
  };



  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!selectedConversation) {
        throw new Error("No conversation selected");
      }
      
      if (dailyMessageCount >= dailyLimit) {
        throw new Error("You've reached today's message limit. You may return tomorrow or begin a Sacred Energy Check-In for deeper guidance.");
      }
      
      const result = await apiRequest(`/api/chat/conversations/${selectedConversation}/messages`, "POST", { content });
      return result;
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data) => {
      playGentleChime();
      setMessageText("");
      setIsTyping(false);
      setDailyMessageCount(prev => prev + 1);
      queryClient.invalidateQueries({ 
        queryKey: [`/api/chat/conversations/${selectedConversation}/messages`] 
      });
    },
    onError: (error) => {
      console.error("Message send failed:", error);
      setIsTyping(false);
    },
  });

  // Show Seraphine options when new conversation starts
  useEffect(() => {
    if (messages && messages.length > 0) {
      const assistantMessages = messages.filter(m => m.role === "assistant");
      const userMessages = messages.filter(m => m.role === "user");
      
      // Show buttons if there are assistant messages but no user messages yet
      const shouldShow = userMessages.length === 0 && assistantMessages.length >= 1;
      setShowSeraphineOptions(shouldShow);
    } else {
      setShowSeraphineOptions(false);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  // Update activity timestamp on user interaction
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem('lastActivityTimestamp', Date.now().toString());
    };
    
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    
    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      return;
    }
    
    if (sendMessageMutation.isPending) {
      return;
    }
    
    sendMessageMutation.mutate({ content: messageText });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Show paywall for non-premium users
  if (!isPremiumUser) {
    return (
      <div className="min-h-screen bg-cream pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-divine-gold mr-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Divine Guidance</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock personalized spiritual wisdom with your AI spiritual companion
            </p>
          </div>

          <Card className="border-0 shadow-2xl" style={{
            background: "linear-gradient(135deg, #FEFEFE 0%, #FEF7ED 100%)",
            boxShadow: "0 25px 50px rgba(217, 119, 6, 0.15)"
          }}>
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="p-6 rounded-full mx-auto w-fit mb-6" style={{
                  background: "linear-gradient(135deg, #F59E0B, #EC4899)",
                  boxShadow: "0 20px 40px rgba(217, 119, 6, 0.3)"
                }}>
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  Premium Feature
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                  Divine Guidance with Seraphine is available exclusively for premium subscribers. 
                  Unlock personalized spiritual wisdom, divine insights, and sacred guidance tailored to your journey.
                </p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-cream rounded-lg p-6 mb-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">✨ Premium Features Include:</h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <Heart className="w-4 h-4 text-rose-500 mr-3" />
                    Unlimited conversations with Seraphine
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-amber-500 mr-3" />
                    Personalized energy insights and sacred actions
                  </li>
                  <li className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-purple-500 mr-3" />
                    Save and revisit your spiritual sessions
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="w-4 h-4 text-divine-gold mr-3" />
                    Divine guidance tailored to your spiritual journey
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <Link href="/subscribe">
                  <Button className="w-full bg-divine-gold hover:bg-amber-600 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-300">
                    💳 Upgrade to Premium Now
                  </Button>
                </Link>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Or contact Vanessa directly:</p>
                  <Button
                    onClick={() => window.open("sms:310-990-6264?body=Hi Vanessa, I'm interested in upgrading to premium for Divine Guidance access.", "_self")}
                    variant="outline"
                    className="border-divine-gold text-divine-gold hover:bg-divine-gold hover:text-white"
                  >
                    Text (310) 990-6264
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Celestial Satin Background - Hermès meets Sacred */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-cream to-stone-50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-stone-100/60 via-transparent to-amber-50/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent"></div>
      {/* Subtle marble texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E\")"}}></div>
      
      {/* Sacred Sophistication Header */}
      <div className="relative z-10 bg-gradient-to-r from-white/98 via-stone-50/95 to-white/98 backdrop-blur-2xl border-b border-amber-200/40 px-8 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-amber-700/70 hover:text-amber-800 hover:bg-amber-50/60 transition-all duration-500 font-medium px-6 py-3 rounded-full tracking-wide">
                ← Lounge
              </Button>
            </Link>

            <Button 
              onClick={resetConversation}
              variant="ghost" 
              size="sm" 
              className="text-amber-700/70 hover:text-amber-800 hover:bg-amber-50/60 transition-all duration-500 font-medium px-6 py-3 rounded-full tracking-wide"
            >
              <RotateCcw className="w-5 h-5 mr-3" />
              New Sacred Session
            </Button>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-gradient-to-br from-amber-100/60 via-white to-stone-50 rounded-full mr-5 border border-amber-200/50 shadow-[0_4px_20px_rgba(245,158,11,0.15)]">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-light text-stone-800 font-serif tracking-wide mb-1">The Divine Vanity™</h1>
                <p className="text-amber-700/80 font-light italic tracking-wider text-sm">Spiritual Concierge Lounge</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200/40 rounded-full shadow-sm">
              <span className="text-xs text-amber-700/80 font-medium tracking-wide">
                {dailyLimit - dailyMessageCount} remaining today
              </span>
            </div>
            {isPremiumUser && <Crown className="w-6 h-6 text-amber-600" />}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-br from-cream/80 via-divine-beige/40 to-divine-gold/10 backdrop-blur-sm">
        {!selectedConversation ? (
          /* Sacred Welcome Interface with Four Options */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-lg w-full space-y-8 text-center">

              


              {/* Four Sacred Options */}
              <div className="space-y-6">
                {/* Option 1: Daily Check-in */}
                <Button
                  onClick={() => {
                    createConversationMutation.mutate("Daily Check-in Session");
                  }}
                  className="w-full bg-gradient-to-r from-divine-gold/25 via-cream/40 to-divine-beige/30 border-2 border-divine-gold/40 hover:border-divine-gold/60 hover:bg-gradient-to-r hover:from-divine-gold/35 hover:via-cream/50 hover:to-divine-beige/40 text-deep-charcoal py-5 px-7 rounded-2xl font-semibold text-left flex items-center justify-between shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Heart className="w-6 h-6 mr-4 text-divine-gold" />
                    <span className="text-lg">Daily Check-in</span>
                  </div>
                  <span className="text-sm opacity-70 font-light">3 questions</span>
                </Button>

                {/* Option 2: Personalized Ritual */}
                <Button
                  onClick={() => {
                    createConversationMutation.mutate("Personalized Ritual Session");
                  }}
                  className="w-full bg-gradient-to-r from-divine-gold/25 via-cream/40 to-divine-beige/30 border-2 border-divine-gold/40 hover:border-divine-gold/60 hover:bg-gradient-to-r hover:from-divine-gold/35 hover:via-cream/50 hover:to-divine-beige/40 text-deep-charcoal py-5 px-7 rounded-2xl font-semibold text-left flex items-center justify-between shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Star className="w-6 h-6 mr-4 text-divine-gold" />
                    <span className="text-lg">Personalized Ritual</span>
                  </div>
                  <span className="text-sm opacity-70 font-light">Custom guidance</span>
                </Button>

                {/* Option 3: Thorough Energy Check-in */}
                <Button
                  onClick={() => {
                    createConversationMutation.mutate("Thorough Energy Assessment");
                  }}
                  className="w-full bg-gradient-to-r from-divine-gold/25 via-cream/40 to-divine-beige/30 border-2 border-divine-gold/40 hover:border-divine-gold/60 hover:bg-gradient-to-r hover:from-divine-gold/35 hover:via-cream/50 hover:to-divine-beige/40 text-deep-charcoal py-5 px-7 rounded-2xl font-semibold text-left flex items-center justify-between shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Zap className="w-6 h-6 mr-4 text-divine-gold" />
                    <span className="text-lg">Thorough Energy Check-in</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm opacity-70 font-light">10 questions</span>
                    {!isPremiumUser && (
                      <span className="text-xs bg-divine-gold/30 text-divine-gold px-3 py-1 rounded-full font-medium border border-divine-gold/20">$33</span>
                    )}
                    {isPremiumUser && (
                      <span className="text-xs bg-divine-gold/30 text-divine-gold px-3 py-1 rounded-full flex items-center font-medium border border-divine-gold/20">
                        <Crown className="w-3 h-3 mr-1" />
                        FREE
                      </span>
                    )}
                  </div>
                </Button>

                {/* Option 4: I Just Need to Talk */}
                <Button
                  onClick={() => {
                    createConversationMutation.mutate("Sacred Conversation");
                  }}
                  className="w-full bg-gradient-to-r from-divine-gold/25 via-cream/40 to-divine-beige/30 border-2 border-divine-gold/40 hover:border-divine-gold/60 hover:bg-gradient-to-r hover:from-divine-gold/35 hover:via-cream/50 hover:to-divine-beige/40 text-deep-charcoal py-5 px-7 rounded-2xl font-semibold text-left flex items-center justify-between shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <MessageCircle className="w-6 h-6 mr-4 text-divine-gold" />
                    <span className="text-lg">I Just Need to Talk</span>
                  </div>
                  <span className="text-sm opacity-70 font-light">{dailyLimit - dailyMessageCount} messages left</span>
                </Button>
              </div>


            </div>
          </div>
        ) : (
          /* Regular Chat Interface */
          <div className="flex-1 flex flex-col bg-white">
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="max-w-lg mx-auto p-4 space-y-4" style={{ paddingBottom: '140px' }}>


                  {/* Chat Messages - Hide Seraphine's greeting when showing buttons */}
                  {messages.map((message) => {
                    // Hide the first assistant message (greeting) when showing option buttons
                    if (message.role === "assistant" && showSeraphineOptions && messages.filter(m => m.role === "user").length === 0) {
                      return null;
                    }
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        } mb-4`}
                      >
                        <div className={`max-w-[85%] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white border border-amber-400/30"
                            : "bg-gradient-to-br from-white via-stone-50 to-amber-50/20 text-stone-800 border border-amber-200/30"
                        }`}>
                          <div className="text-sm leading-relaxed font-light tracking-wide whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex justify-start mb-6">
                      <div className="bg-gradient-to-br from-white via-stone-50 to-amber-50/20 rounded-[1.5rem] p-6 max-w-[85%] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-amber-200/30">
                        <div className="flex space-x-3 items-center">
                          <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce opacity-80"></div>
                          <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce opacity-40" style={{ animationDelay: '0.4s' }}></div>
                          <span className="text-amber-700/70 text-sm font-light tracking-wide italic ml-3">Seraphine is composing your sacred guidance...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Seraphine Option Buttons - Show after greeting */}

                  {showSeraphineOptions && (
                    <div className="flex justify-start mb-6">
                      <div className="bg-gradient-to-br from-white via-stone-50 to-amber-50/20 rounded-[1.5rem] p-4 max-w-[85%] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-amber-200/30">
                        <div className="text-amber-700/70 mb-3 font-serif italic text-sm tracking-wide text-center">
                          Choose what serves your soul today
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {/* Daily Check-in Option */}
                          <button 
                            onClick={() => handleSeraphineOption("Daily Check-in")}
                            className="group p-3 text-center bg-gradient-to-br from-amber-50/50 to-white hover:from-amber-100/60 hover:to-amber-50 rounded-xl border border-amber-200/40 hover:border-amber-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <Heart className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                            <div className="font-medium text-stone-800 text-xs mb-1">Daily Check-in</div>
                            <div className="text-amber-700/60 text-xs">3 questions</div>
                          </button>

                          {/* Personalized Ritual Option */}
                          <button 
                            onClick={() => handleSeraphineOption("Personalized Ritual")}
                            className="group p-3 text-center bg-gradient-to-br from-amber-50/50 to-white hover:from-amber-100/60 hover:to-amber-50 rounded-xl border border-amber-200/40 hover:border-amber-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <Star className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                            <div className="font-medium text-stone-800 text-xs mb-1">Personalized Ritual</div>
                            <div className="text-amber-700/60 text-xs">Custom guidance</div>
                          </button>

                          {/* Thorough Energy Check-in Option */}
                          <button 
                            onClick={() => handleSeraphineOption("Thorough Energy Check-in")}
                            className="group p-3 text-center bg-gradient-to-br from-amber-50/50 to-white hover:from-amber-100/60 hover:to-amber-50 rounded-xl border border-amber-200/40 hover:border-amber-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <Zap className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                            <div className="font-medium text-stone-800 text-xs mb-1 flex items-center justify-center gap-1">
                              Thorough Energy
                              {!isPremiumUser && <Crown className="w-3 h-3 text-amber-600" />}
                            </div>
                            <div className="text-amber-700/60 text-xs">
                              {!isPremiumUser ? "$33" : "FREE"}
                            </div>
                          </button>

                          {/* Just Need to Talk Option */}
                          <button 
                            onClick={() => handleSeraphineOption("I just need to talk")}
                            className="group p-3 text-center bg-gradient-to-br from-amber-50/50 to-white hover:from-amber-100/60 hover:to-amber-50 rounded-xl border border-amber-200/40 hover:border-amber-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <MessageCircle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                            <div className="font-medium text-stone-800 text-xs mb-1">Just Need to Talk</div>
                            <div className="text-amber-700/60 text-xs">Open conversation</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Luxurious Sacred Input Area */}
            <div className="bg-gradient-to-r from-white/98 via-stone-50/95 to-white/98 backdrop-blur-xl border-t border-amber-200/40 p-8 pb-10 mb-16 md:mb-4 safe-area-inset-bottom shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
              <div className="flex gap-4 max-w-4xl mx-auto">
                <div className="flex-1">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what moves your spirit today..."
                    className="w-full border border-amber-200/50 focus:border-amber-400/60 rounded-full bg-gradient-to-r from-white via-stone-50/30 to-white text-stone-800 px-8 py-5 focus:ring-2 focus:ring-amber-200/40 transition-all duration-500 shadow-[0_4px_20px_rgba(245,158,11,0.08)] font-light tracking-wide placeholder:text-amber-700/50 placeholder:italic text-lg"
                    disabled={sendMessageMutation.isPending}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  className="bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:via-amber-400 hover:to-amber-600 border border-amber-400/50 text-white p-5 rounded-full shadow-[0_8px_32px_rgba(245,158,11,0.2)] hover:shadow-[0_12px_48px_rgba(245,158,11,0.3)] transition-all duration-500 transform hover:scale-105"
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}