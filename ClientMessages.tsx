import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, MessageCircle, Send, User, Crown, Clock, Check, CheckCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MessageSummary from "@/components/MessageSummary";

interface ClientMessage {
  id: number;
  userId: string;
  senderId: string;
  senderRole: 'client' | 'coach';
  content: string;
  isRead: boolean;
  messageType: string;
  attachmentUrl?: string;
  replyToId?: number;
  createdAt: string;
  readAt?: string;
}

interface UserStats {
  subscriptionStatus: string;
}

interface LimitData {
  remainingMessages: number;
  allowed: boolean;
  nextResetTime?: string;
}

export default function ClientMessages() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("text");
  const [messageLimitReached, setMessageLimitReached] = useState(false);
  const [dailyResetTime, setDailyResetTime] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check message limit on component mount
  useEffect(() => {
    fetch('/api/check-limit')
      .then(res => res.json())
      .then(data => {
        setMessageLimitReached(!data.allowed);
        if (data.nextResetTime) {
          const resetTime = new Date(data.nextResetTime);
          setDailyResetTime(resetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      })
      .catch(() => setMessageLimitReached(false));
  }, []);

  // Redirect to upgrade
  const redirectToUpgrade = () => {
    window.open('sms:+13109906264?body=Hi Vanessa, I want to upgrade to unlimited coach messaging access. Please help me unlock premium features.', '_self');
  };

  // Fetch user stats and messages
  const { data: userStats } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: limitData } = useQuery({
    queryKey: ['/api/check-limit'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const { data: messages = [], isLoading } = useQuery<ClientMessage[]>({
    queryKey: ['/api/client-messages'],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  });

  const remainingMessages = limitData?.remainingMessages ?? 3;

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      return apiRequest('/api/client-messages', 'POST', messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client-messages'] });
      setMessage("");
      toast({
        title: "Message sent!",
        description: "Your message has been delivered successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return apiRequest(`/api/client-messages/${messageId}/read`, 'PUT');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client-messages'] });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark unread messages as read when viewing
  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessages = messages.filter((msg: ClientMessage) => 
        !msg.isRead && msg.senderRole === 'coach'
      );
      
      unreadMessages.forEach((msg: ClientMessage) => {
        markAsReadMutation.mutate(msg.id);
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      content: message.trim(),
      senderRole: 'client',
      messageType,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-divine-gold mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading your conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-divine-gold shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-deep-charcoal font-playfair mb-2">
            Divine Communication
          </h1>
          <p className="text-lg text-deep-charcoal/70 italic">
            Direct connection with your spiritual guide
          </p>
          
          {/* Message limit indicator */}
          <div className="mt-4 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg px-4 py-2 border border-divine-gold/30">
              <div className="flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4 text-divine-gold" />
                <span className="text-deep-charcoal">
                  {userStats?.subscriptionStatus === 'premium' 
                    ? 'Unlimited divine messages available' 
                    : `${remainingMessages} of 3 free divine messages remaining today`
                  }
                </span>
                {userStats?.subscriptionStatus !== 'premium' && remainingMessages <= 1 && (
                  <span className="ml-2 bg-divine-gold/20 text-divine-gold px-2 py-1 rounded-full text-xs font-medium">
                    {remainingMessages === 0 ? 'Limit reached' : 'Almost full'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="mb-6 rounded-lg overflow-hidden shadow-xl">
          {messages.length === 0 ? (
            <div className="min-h-[500px] bg-gradient-to-br from-[#fdf6e3] via-[#fff8e7] to-[#f9e6c7] flex items-center justify-center">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Start Your Sacred Conversation
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This is your private space to communicate directly with Vanessa about your spiritual journey, 
                  session updates, and personal growth.
                </p>
              </div>
            </div>
          ) : (
            <MessageSummary messages={messages} />
          )}
        </div>

        {/* Message Input - iMessage Style */}
        <div className="bg-white border border-divine-gold/20 rounded-3xl shadow-lg p-4">
          {messageLimitReached ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-divine-gold">You've used all 3 free divine messages today</h2>
              <p className="mt-2 text-sm text-deep-charcoal/70">Unlock full access to unlimited coaching for deeper spiritual guidance.</p>
              <button
                onClick={redirectToUpgrade}
                className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-divine-gold to-soft-gold text-white font-bold hover:from-divine-gold/90 hover:to-soft-gold/90 transition-all transform hover:scale-105 shadow-lg"
              >
                Unlock Unlimited Access
              </button>
              {dailyResetTime && (
                <p className="text-xs text-deep-charcoal/50 text-center mt-2">
                  Your next free message will be available after {dailyResetTime}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Message type selector */}
              <div className="flex justify-start">
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="text-xs bg-soft-gold/20 border border-divine-gold/30 rounded-full px-3 py-1 focus:border-divine-gold focus:outline-none text-deep-charcoal"
                >
                  <option value="text">General Message</option>
                  <option value="journey_update">Journey Update</option>
                  <option value="session_question">Session Question</option>
                  <option value="resource_request">Resource Request</option>
                </select>
              </div>

              {/* Input area */}
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-cream/50 rounded-2xl border border-divine-gold/30 p-3 focus-within:border-divine-gold transition-colors">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts, ask questions, or provide updates about your spiritual journey..."
                    className="min-h-[60px] resize-none border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-deep-charcoal/50 text-deep-charcoal"
                  />
                </div>

                {/* Send button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="w-10 h-10 rounded-full bg-divine-gold hover:bg-divine-gold/90 text-white shadow-lg flex items-center justify-center p-0 disabled:opacity-50"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-deep-charcoal/60">
          <p>✨ This is your private communication channel with Vanessa Rich ✨</p>
          <p className="mt-1">All messages are confidential and sacred to your spiritual journey</p>
        </div>
      </div>
    </div>
  );
}