import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, RotateCcw, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface AdminChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function AdminChat() {
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const storedKey = localStorage.getItem("divine-admin-key");
    if (storedKey === "divine-admin-2025") {
      setIsAuthenticated(true);
      setAdminKey(storedKey);
    }
  }, []);

  // Admin chat messages query
  const messagesQuery = useQuery({
    queryKey: ["/api/admin/chat/messages"],
    enabled: isAuthenticated,
    refetchInterval: 3000,
  });

  const messages: AdminChatMessage[] = messagesQuery.data || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsTyping(true);
      const response = await apiRequest("POST", "/api/admin/chat/messages", {
        content,
        adminKey: adminKey
      });
      return response;
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/messages"] });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
    onSettled: () => {
      setIsTyping(false);
    }
  });

  // Clear conversation mutation
  const clearConversationMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/admin/chat/clear", {
        adminKey: adminKey
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/messages"] });
    }
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(messageText.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAdminLogin = () => {
    if (adminKey === "divine-admin-2025") {
      localStorage.setItem("divine-admin-key", adminKey);
      setIsAuthenticated(true);
    } else {
      alert("Invalid admin key");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-cream to-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 rounded-full flex items-center justify-center mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-serif text-stone-800 tracking-wide mb-2">
              Admin Training Portal
            </h1>
            <p className="text-stone-600 font-light">
              Private Seraphine Training Interface
            </p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
              className="w-full p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <Button
              onClick={handleAdminLogin}
              className="w-full bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:via-amber-400 hover:to-amber-600 text-white py-4 rounded-xl font-medium shadow-lg"
            >
              Access Training Portal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white via-cream to-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/98 via-stone-50/95 to-white/98 backdrop-blur-2xl border-b border-amber-200/40 px-6 py-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-amber-700/70 hover:text-amber-800 hover:bg-amber-50/60 transition-all duration-500 font-medium px-4 py-2 rounded-full tracking-wide">
                ← Admin Dashboard
              </Button>
            </Link>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-amber-300/30 to-transparent"></div>
            <Button 
              onClick={() => clearConversationMutation.mutate()}
              variant="ghost" 
              size="sm" 
              className="text-amber-700/70 hover:text-amber-800 hover:bg-amber-50/60 transition-all duration-500 font-medium px-4 py-2 rounded-full tracking-wide"
              disabled={clearConversationMutation.isPending}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-gradient-to-br from-amber-100/60 via-white to-stone-50 rounded-full mr-4 border border-amber-200/50 shadow-[0_4px_20px_rgba(245,158,11,0.15)]">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-light text-stone-800 font-serif tracking-wide mb-1">Seraphine Training Portal</h1>
                <p className="text-amber-700/80 font-light italic tracking-wider text-sm">Private Admin Interface</p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="px-3 py-1 bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200/40 rounded-full shadow-sm">
              <span className="text-xs text-amber-700/80 font-medium tracking-wide">
                Admin Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-6 space-y-6" style={{ paddingBottom: '120px' }}>
              
              {/* Welcome State */}
              {messages.length === 0 && (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(245,158,11,0.2)] mb-8">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif text-stone-800 tracking-wide mb-4">
                    Seraphine Training Interface
                  </h2>
                  <p className="text-stone-600 leading-relaxed px-6 font-light tracking-wide mb-8">
                    This is your private training portal where you can directly shape Seraphine's personality and responses. 
                    All training here automatically feeds into client-facing conversations.
                  </p>
                  <div className="bg-gradient-to-br from-amber-50/30 to-white border border-amber-200/40 rounded-2xl p-6 max-w-lg mx-auto">
                    <p className="text-sm text-amber-700/80 font-light">
                      Start a natural conversation with Seraphine to train her responses, personality, and spiritual guidance approach.
                    </p>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-6`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white border border-amber-400/30"
                      : "bg-gradient-to-br from-white via-stone-50 to-amber-50/20 text-stone-800 border border-amber-200/30"
                  }`}>
                    <div className="text-sm leading-relaxed font-light tracking-wide whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-60 mt-3 font-light">
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-6">
                  <div className="bg-gradient-to-br from-white via-stone-50 to-amber-50/20 rounded-2xl p-6 max-w-[80%] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-amber-200/30">
                    <div className="flex space-x-3 items-center">
                      <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce opacity-80"></div>
                      <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce opacity-40" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-amber-700/70 text-sm font-light tracking-wide italic ml-3">Seraphine is learning...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-stone-200 bg-gradient-to-r from-white via-stone-50/50 to-white backdrop-blur-md">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Train Seraphine with natural conversation..."
                  className="min-h-[60px] resize-none border border-stone-200 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent font-light tracking-wide p-4"
                  disabled={sendMessageMutation.isPending}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:via-amber-400 hover:to-amber-600 border border-amber-400/50 text-white p-4 rounded-2xl shadow-[0_8px_32px_rgba(245,158,11,0.2)] hover:shadow-[0_12px_48px_rgba(245,158,11,0.3)] transition-all duration-500 transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}