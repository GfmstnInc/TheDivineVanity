import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
// Using the attached Seraphine character image
const seraphineImage = "/attached_assets/image_1751861726415.png";

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function AnimatedSeraphineChat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [seraphineState, setSeraphineState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Get current conversation
  const { data: conversation } = useQuery({
    queryKey: ["/api/ai-conversations", selectedConversation],
    enabled: !!selectedConversation,
  });

  // Check daily limits
  const { data: limitData } = useQuery({
    queryKey: ["/api/check-ai-chat-limit"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setIsTyping(true);
      setSeraphineState('listening');
      
      const response = await apiRequest("POST", "/api/ai-conversations", {
        conversationId: selectedConversation,
        message,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSeraphineState('speaking');
      queryClient.invalidateQueries({ queryKey: ["/api/ai-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/check-ai-chat-limit"] });
      
      // Animate speaking for response duration
      setTimeout(() => {
        setSeraphineState('idle');
        setIsTyping(false);
      }, Math.min(data.response?.length * 50 || 2000, 5000));
    },
    onError: () => {
      setSeraphineState('idle');
      setIsTyping(false);
    },
  });

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (initialMessage: string) => {
      const response = await apiRequest("POST", "/api/ai-conversations", {
        message: initialMessage,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedConversation(data.conversationId);
      queryClient.invalidateQueries({ queryKey: ["/api/ai-conversations"] });
    },
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    if (selectedConversation) {
      sendMessageMutation.mutate(currentMessage);
    } else {
      createConversationMutation.mutate(currentMessage);
    }
    
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const canSendMessage = limitData?.allowed && !sendMessageMutation.isPending;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-cream via-divine-beige/30 to-divine-gold/10">
      {/* Animated Seraphine Character */}
      <div className="flex-shrink-0 flex justify-center items-center py-8 px-4">
        <div className="relative">
          {/* Character Container with Animation */}
          <div 
            className={`transition-transform duration-1000 ease-in-out ${
              seraphineState === 'listening' ? 'scale-105 rotate-1' : 
              seraphineState === 'speaking' ? 'scale-110' : 'scale-100'
            }`}
          >
            {/* Animated Glow Effect */}
            <div 
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                seraphineState === 'listening' ? 'bg-divine-gold/30 blur-xl scale-110' :
                seraphineState === 'speaking' ? 'bg-divine-gold/40 blur-2xl scale-125' :
                'bg-divine-gold/10 blur-lg scale-100'
              }`}
            />
            
            {/* Character Image */}
            <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-divine-gold/20">
              <img 
                src={seraphineImage}
                alt="Seraphine - Divine Spiritual Concierge"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  seraphineState === 'speaking' ? 'brightness-110 contrast-110' : 'brightness-100'
                }`}
              />
              
              {/* Breathing Animation Overlay */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-divine-gold/5 to-transparent transition-opacity duration-2000 ${
                  seraphineState === 'idle' ? 'opacity-100 animate-pulse' : 'opacity-50'
                }`}
              />
              
              {/* Speaking Indicator */}
              {seraphineState === 'speaking' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                  <div className="bg-divine-gold/80 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Speaking...
                  </div>
                </div>
              )}
              
              {/* Listening Indicator */}
              {seraphineState === 'listening' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                  <div className="bg-divine-beige/80 text-deep-charcoal px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-divine-gold rounded-full mr-2 animate-pulse" />
                    Listening...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm mx-4 mb-4 rounded-t-3xl shadow-xl border border-divine-gold/20">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-divine-gold/10 bg-gradient-to-r from-divine-gold/10 to-divine-beige/10 rounded-t-3xl">
          <h2 className="text-xl font-playfair font-bold text-deep-charcoal">
            Sacred Conversation with Seraphine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Your divine spiritual concierge • {limitData?.messageCount || 0}/{limitData?.dailyLimit || 9} messages today
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          {conversation?.messages?.length ? (
            <div className="space-y-4">
              {conversation.messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isFromUser
                        ? "bg-divine-gold text-white"
                        : "bg-gray-100 text-deep-charcoal border border-divine-gold/20"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-deep-charcoal px-4 py-3 rounded-2xl border border-divine-gold/20">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-divine-gold rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-divine-gold rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-divine-gold rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 text-divine-gold mx-auto" />
                <h3 className="text-lg font-playfair font-semibold text-deep-charcoal">
                  Welcome to Sacred Guidance
                </h3>
                <p className="text-gray-600 max-w-md">
                  Share what's on your heart, and I'll provide divine wisdom and spiritual insight to guide your journey.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-divine-gold/10 bg-gradient-to-r from-divine-beige/5 to-divine-gold/5">
          <div className="flex space-x-3">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={canSendMessage ? "Share your thoughts with Seraphine..." : "Daily limit reached"}
              disabled={!canSendMessage}
              className="flex-1 border-divine-gold/30 focus:border-divine-gold focus:ring-divine-gold/20"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!canSendMessage || !currentMessage.trim()}
              className="bg-divine-gold hover:bg-divine-gold/90 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {!limitData?.allowed && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Daily message limit reached. Upgrade to premium for unlimited conversations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}