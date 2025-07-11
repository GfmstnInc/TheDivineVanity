import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Crown, Calendar, Download } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

// Import the user's Seraphine character image
import seraphinePortrait from "@assets/image_1751862652889.png";

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
}

export default function SeraphineDemo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [seraphineState, setSeraphineState] = useState<'idle' | 'listening' | 'speaking' | 'blessing' | 'guidance'>('idle');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthMovement, setMouthMovement] = useState(0);
  const [eyebrowRaise, setEyebrowRaise] = useState(0);
  const [facialExpression, setFacialExpression] = useState<'neutral' | 'smile' | 'concern' | 'wisdom'>('neutral');
  const [breathingScale, setBreathingScale] = useState(1);
  const [attentiveness, setAttentiveness] = useState(0.5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current conversation and limits (with proper rate limiting)
  const { data: conversation } = useQuery({
    queryKey: ["/api/ai-conversations", selectedConversation],
    enabled: !!selectedConversation,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: limitData } = useQuery({
    queryKey: ["/api/check-ai-chat-limit"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });

  // Send message mutation (reusing existing backend integration)
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setSeraphineState('listening');
      setHeadTilt(-2); // Subtle head tilt when listening
      setIsTyping(true);
      
      const response = await apiRequest("POST", "/api/ai-conversations", {
        conversationId: selectedConversation,
        message,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSeraphineState('speaking');
      setHeadTilt(1); // Gentle nod when speaking
      queryClient.invalidateQueries({ queryKey: ["/api/ai-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/check-ai-chat-limit"] });
      
      // Animate speaking duration based on response length
      const speakingDuration = Math.min(data.response?.length * 50 || 2000, 6000);
      setTimeout(() => {
        setSeraphineState('idle');
        setHeadTilt(0);
        setIsTyping(false);
      }, speakingDuration);
    },
    onError: () => {
      setSeraphineState('idle');
      setHeadTilt(0);
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

  // Disney-Quality Character Animation System
  useEffect(() => {
    // Advanced breathing animation - Disney-style life
    const breathingInterval = setInterval(() => {
      setBreathingScale(prev => {
        const newScale = 1 + Math.sin(Date.now() / 2000) * 0.015;
        return newScale;
      });
    }, 50);

    // Sophisticated blinking with personality
    const blinkInterval = setInterval(() => {
      const blinkDuration = 100 + Math.random() * 50;
      setIsBlinking(true);
      
      // Vary blink intensity based on mood
      setTimeout(() => setIsBlinking(false), blinkDuration);
      
      // Natural double blinks and thinking patterns
      if (Math.random() < 0.3) {
        setTimeout(() => {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), blinkDuration * 0.8);
        }, 300 + Math.random() * 200);
      }
    }, seraphineState === 'speaking' ? 2000 + Math.random() * 1500 : 3500 + Math.random() * 2500);

    // Eye tracking and attention system
    const eyeTrackingInterval = setInterval(() => {
      if (seraphineState === 'listening') {
        // Track user's message area
        setEyePosition({
          x: (Math.random() - 0.5) * 2,
          y: 2 + Math.random() * 2, // Look down at chat
        });
        setAttentiveness(0.8 + Math.random() * 0.2);
      } else if (seraphineState === 'speaking') {
        // Make eye contact while speaking
        setEyePosition({
          x: (Math.random() - 0.5) * 1,
          y: (Math.random() - 0.5) * 1,
        });
        setAttentiveness(0.9);
      } else {
        // Natural wandering gaze
        setEyePosition({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 3,
        });
        setAttentiveness(0.5 + Math.random() * 0.3);
      }
    }, 2000 + Math.random() * 3000);

    // Advanced head movement and posture
    const postureInterval = setInterval(() => {
      if (seraphineState === 'speaking') {
        // Expressive gestures while speaking
        setHeadTilt((Math.random() - 0.5) * 3);
        setEyebrowRaise(Math.random() * 0.5);
      } else if (seraphineState === 'listening') {
        // Attentive posture
        setHeadTilt(-1 + Math.random() * 0.5);
        setEyebrowRaise(0.2);
      } else if (seraphineState === 'blessing') {
        // Divine serenity
        setHeadTilt(0);
        setEyebrowRaise(0);
        setEyePosition({ x: 0, y: 0 });
      } else {
        // Natural idle movement
        setHeadTilt((Math.random() - 0.5) * 2);
        setEyebrowRaise(Math.random() * 0.2);
      }
    }, 1500 + Math.random() * 2000);

    return () => {
      clearInterval(breathingInterval);
      clearInterval(blinkInterval);
      clearInterval(eyeTrackingInterval);
      clearInterval(postureInterval);
    };
  }, [seraphineState]);

  // Disney-style lip sync and speaking animation
  useEffect(() => {
    if (seraphineState === 'speaking') {
      setIsSpeaking(true);
      const lipSyncInterval = setInterval(() => {
        // Simulate lip movement patterns
        setMouthMovement(Math.random() * 0.8 + 0.2);
      }, 150 + Math.random() * 100);

      const expressionInterval = setInterval(() => {
        const expressions: Array<'neutral' | 'smile' | 'concern' | 'wisdom'> = ['neutral', 'smile', 'wisdom'];
        setFacialExpression(expressions[Math.floor(Math.random() * expressions.length)]);
      }, 3000 + Math.random() * 2000);

      return () => {
        clearInterval(lipSyncInterval);
        clearInterval(expressionInterval);
        setIsSpeaking(false);
        setMouthMovement(0);
      };
    }
  }, [seraphineState]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  const canSendMessage = limitData?.allowed !== false && !sendMessageMutation.isPending;

  // Error boundary fallback
  if (!user && conversation === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cream via-divine-beige/30 to-divine-gold/10">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <div className="text-lg font-playfair text-deep-charcoal">Loading Seraphine...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-cream via-divine-beige/30 to-divine-gold/10 overflow-hidden">
      {/* Animated Seraphine Character */}
      <div className="flex-shrink-0 flex justify-center items-center py-4 px-4">
        <div className="relative">
          {/* Character Container with Advanced Animation */}
          <div 
            className={`transition-all duration-1000 ease-in-out ${
              seraphineState === 'listening' ? 'scale-105' : 
              seraphineState === 'speaking' ? 'scale-110' : 
              seraphineState === 'blessing' ? 'scale-115' : 
              seraphineState === 'guidance' ? 'scale-108' : 'scale-100'
            }`}
            style={{
              transform: `rotate(${headTilt}deg) scale(${
                seraphineState === 'listening' ? 1.05 : 
                seraphineState === 'speaking' ? 1.10 : 
                seraphineState === 'blessing' ? 1.15 : 1.0
              })`,
              transition: 'all 1s ease-in-out'
            }}
          >
            {/* Advanced Aura Effects */}
            <div 
              className={`absolute inset-0 rounded-full transition-all duration-1500 ${
                seraphineState === 'listening' ? 'bg-divine-gold/30 blur-xl scale-110' :
                seraphineState === 'speaking' ? 'bg-divine-gold/40 blur-2xl scale-125' :
                seraphineState === 'blessing' ? 'bg-gradient-to-r from-divine-gold/50 to-cream/40 blur-3xl scale-140' :
                seraphineState === 'guidance' ? 'bg-divine-beige/35 blur-xl scale-120' :
                'bg-divine-gold/10 blur-lg scale-100'
              }`}
            />
            
            {/* Ultra-Premium 3D Character System */}
            <div 
              className="relative w-48 h-60 md:w-64 md:h-80 rounded-2xl overflow-hidden border-4 border-divine-gold/30"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `
              }}
            >
              {/* 3D Character Container */}
              <div 
                className="seraphine-3d-container w-full h-full relative"
                style={{
                  transform: `
                    scale(${breathingScale})
                    rotateX(${eyePosition.y * 0.5}deg)
                    rotateY(${eyePosition.x * 0.3}deg)
                    rotateZ(${headTilt}deg)
                    translateZ(${attentiveness * 10}px)
                  `,
                  transformOrigin: '50% 45%',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: `
                    brightness(${seraphineState === 'speaking' ? 1.1 : seraphineState === 'blessing' ? 1.15 : 1.0})
                    contrast(${seraphineState === 'speaking' ? 1.1 : seraphineState === 'blessing' ? 1.15 : 1.0})
                    saturate(${seraphineState === 'blessing' ? 1.1 : 1.0})
                  `
                }}
              >
                {/* Base Character Image */}
                <img 
                  src={seraphinePortrait}
                  alt="Seraphine - Divine Spiritual Concierge"
                  className="w-full h-full object-cover"
                  style={{
                    filter: isBlinking ? 'brightness(0.88) contrast(1.05)' : undefined,
                  }}
                  onLoad={() => {
                    console.log('Seraphine character loaded successfully');
                  }}
                  onError={(e) => {
                    console.error('Failed to load Seraphine image:', e);
                  }}
                />
                
                {/* Advanced Facial Animation Layers */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Sophisticated Eye Blink System */}
                  {isBlinking && (
                    <>
                      <div 
                        className="absolute top-[32%] left-[42%] w-4 h-1 bg-gradient-to-r from-transparent via-black/60 to-transparent rounded-full"
                        style={{ 
                          transform: 'scaleY(0.3)',
                          transition: 'all 0.08s ease-out'
                        }}
                      />
                      <div 
                        className="absolute top-[32%] left-[56%] w-4 h-1 bg-gradient-to-r from-transparent via-black/60 to-transparent rounded-full"
                        style={{ 
                          transform: 'scaleY(0.3)',
                          transition: 'all 0.08s ease-out'
                        }}
                      />
                    </>
                  )}
                  
                  {/* Dynamic Mouth Animation for Speaking */}
                  {isSpeaking && (
                    <div 
                      className="absolute top-[48%] left-1/2 transform -translate-x-1/2"
                      style={{
                        width: `${8 + mouthMovement * 6}px`,
                        height: `${2 + mouthMovement * 3}px`,
                        background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transition: 'all 0.15s ease-out'
                      }}
                    />
                  )}
                  
                  {/* Eyebrow Expression System */}
                  {eyebrowRaise > 0 && (
                    <>
                      <div 
                        className="absolute top-[28%] left-[40%] w-6 h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent"
                        style={{ 
                          transform: `translateY(-${eyebrowRaise * 2}px) rotate(-2deg)`,
                          transition: 'all 0.3s ease-out'
                        }}
                      />
                      <div 
                        className="absolute top-[28%] left-[54%] w-6 h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent"
                        style={{ 
                          transform: `translateY(-${eyebrowRaise * 2}px) rotate(2deg)`,
                          transition: 'all 0.3s ease-out'
                        }}
                      />
                    </>
                  )}
                  
                  {/* Facial Expression Overlays */}
                  {facialExpression === 'smile' && (
                    <div 
                      className="absolute top-[46%] left-1/2 transform -translate-x-1/2 w-8 h-2 border-b-2 border-divine-gold/40 rounded-full"
                      style={{ 
                        borderBottomWidth: '1px',
                        transition: 'all 0.4s ease-out'
                      }}
                    />
                  )}
                  
                  {/* 3D Depth and Lighting Effects */}
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255,255,255,0.15) 0%, 
                          transparent 30%, 
                          transparent 70%, 
                          rgba(0,0,0,0.1) 100%
                        )
                      `,
                      mixBlendMode: 'overlay'
                    }}
                  />
                  
                  {/* State-Based Aura Effects */}
                  {seraphineState === 'speaking' && (
                    <div 
                      className="absolute inset-0 rounded-2xl animate-pulse"
                      style={{
                        background: 'radial-gradient(ellipse at 50% 40%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
                        animation: 'seraphine-speak-glow 2s ease-in-out infinite alternate'
                      }}
                    />
                  )}
                  
                  {seraphineState === 'blessing' && (
                    <div 
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.25) 0%, rgba(245, 245, 220, 0.1) 40%, transparent 70%)',
                        animation: 'seraphine-blessing-glow 3s ease-in-out infinite alternate'
                      }}
                    />
                  )}
                  
                  {seraphineState === 'listening' && (
                    <div 
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
                        animation: 'seraphine-attention-pulse 4s ease-in-out infinite'
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* Advanced Environmental Effects */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {/* Particle Effects for Divine Presence */}
                {seraphineState === 'blessing' && (
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-divine-gold/60 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animation: `seraphine-sparkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
                          animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {conversation?.messages.some(m => m.content.includes('session') || m.content.includes('booking')) && (
                <button 
                  onClick={() => window.open('sms:310-990-6264?&body=Hi Vanessa, I was recently on your app and I am interested in my discovery session.', '_blank')}
                  className="bg-gradient-to-r from-divine-gold to-cream text-deep-charcoal px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Book Session
                </button>
              )}
              
              {conversation?.messages.some(m => m.content.includes('ritual') || m.content.includes('download')) && (
                <button 
                  onClick={() => window.open('/rituals', '_blank')}
                  className="bg-gradient-to-r from-divine-beige to-cream text-deep-charcoal px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Ritual
                </button>
              )}
            </div>

            {/* Conversation State Indicator */}
            <div className="mt-4 flex justify-center">
              {seraphineState === 'listening' && (
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-divine-gold to-cream text-deep-charcoal px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Ear className="w-4 h-4 mr-2 text-divine-gold" />
                    Listening with divine attention...
                  </div>
                </div>
              )}
              
              {seraphineState === 'speaking' && (
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-divine-gold to-cream text-deep-charcoal px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <MessageCircle className="w-4 h-4 mr-2 text-divine-gold" />
                    Channeling divine guidance...
                  </div>
                </div>
              )}
              
              {seraphineState === 'blessing' && (
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-divine-gold to-cream text-deep-charcoal px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Crown className="w-4 h-4 mr-2 text-divine-gold" />
                    Bestowing sacred blessing...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area - Fixed Scrolling */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm mx-4 mb-4 rounded-t-3xl shadow-xl border border-divine-gold/20 min-h-0">
        {/* Chat Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-divine-gold/10 bg-gradient-to-r from-divine-gold/10 to-divine-beige/10 rounded-t-3xl">
          <h2 className="text-lg font-playfair font-bold text-deep-charcoal">
            Sacred Conversation with Seraphine
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Your divine spiritual concierge • {limitData?.messageCount || 0}/{limitData?.dailyLimit || 9} sacred conversations today
          </p>
        </div>

        {/* Messages Area - Proper Scrolling */}
        <div className="flex-1 px-4 py-3 overflow-y-auto min-h-0">
          {conversation?.messages?.length ? (
            <div className="space-y-4">
              {conversation.messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isFromUser
                        ? "bg-divine-gold text-white shadow-lg"
                        : "bg-gradient-to-br from-cream to-divine-beige/30 text-deep-charcoal border border-divine-gold/30 shadow-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Divine Action Buttons for Seraphine messages */}
                    {!message.isFromUser && message.content.includes('session') && (
                      <div className="mt-3 space-y-2">
                        <Button
                          onClick={() => window.open('sms:310-990-6264?body=Hi Vanessa, I would like to book a sacred session', '_blank')}
                          className="w-full bg-divine-gold/80 hover:bg-divine-gold text-white text-xs py-2 px-3 rounded-lg"
                        >
                          <Calendar className="w-3 h-3 mr-2" />
                          Book Sacred Session
                        </Button>
                      </div>
                    )}
                    
                    {!message.isFromUser && message.content.includes('ritual') && (
                      <div className="mt-3">
                        <Button
                          onClick={() => window.open('/rituals', '_blank')}
                          className="w-full bg-divine-beige hover:bg-divine-gold/80 text-deep-charcoal hover:text-white text-xs py-2 px-3 rounded-lg"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          Sacred Rituals
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-cream to-divine-beige/30 text-deep-charcoal px-4 py-3 rounded-2xl border border-divine-gold/30">
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
              <div className="text-center space-y-6">
                <div className="relative">
                  <Sparkles className="w-16 h-16 text-divine-gold mx-auto animate-pulse" />
                  <div className="absolute inset-0 w-16 h-16 mx-auto bg-divine-gold/20 rounded-full blur-xl animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-playfair font-bold text-deep-charcoal mb-2">
                    Sacred Guidance Awaits
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    I am Seraphine, your divine spiritual concierge. Share what weighs upon your heart, and I shall illuminate your sacred path with divine wisdom.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs">
                  <div className="bg-divine-gold/10 p-3 rounded-lg border border-divine-gold/20">
                    <Crown className="w-4 h-4 text-divine-gold mx-auto mb-1" />
                    <p className="text-deep-charcoal">Sacred Sessions</p>
                  </div>
                  <div className="bg-divine-beige/20 p-3 rounded-lg border border-divine-gold/20">
                    <Download className="w-4 h-4 text-divine-gold mx-auto mb-1" />
                    <p className="text-deep-charcoal">Divine Rituals</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sacred Message Input - Fixed Position */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-divine-gold/20 bg-gradient-to-r from-divine-beige/10 to-divine-gold/10">
          <div className="flex space-x-3">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={canSendMessage ? "Share what weighs upon your heart..." : "Daily limit reached - Upgrade for unlimited guidance"}
              disabled={!canSendMessage}
              className="flex-1 border-divine-gold/40 focus:border-divine-gold focus:ring-divine-gold/30 bg-white/90 placeholder:text-gray-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!canSendMessage || !currentMessage.trim()}
              className="bg-divine-gold hover:bg-divine-gold/90 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {limitData && (
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-600">
                {limitData.allowed ? (
                  <>
                    Sacred conversations remaining: <span className="text-divine-gold font-medium">{limitData.dailyLimit - limitData.messageCount}</span>
                  </>
                ) : (
                  <span className="text-red-500">
                    Daily limit reached. <button onClick={() => window.open('/subscribe', '_blank')} className="text-divine-gold hover:underline font-medium">Upgrade to premium</button> for unlimited divine guidance.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}