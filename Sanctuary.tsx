import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLuxurySounds } from '@/hooks/useLuxurySounds';
import { Heart, MessageSquare, TrendingUp, Award, Send, Star, Sparkles, Crown } from 'lucide-react';

interface DailyCheckIn {
  mood: string;
  moodIntensity: number;
  energyLevel: number;
  intention: string;
  currentFocus?: string;
  challengesToday?: string;
  gratefulFor?: string;
  needsSupport?: string;
  journeyReflection?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  subscriptionStatus: string;
  isPermanentPremium: boolean;
}

const Sanctuary: React.FC = () => {
  const [checkInData, setCheckInData] = useState<DailyCheckIn>({
    mood: '',
    moodIntensity: 5,
    energyLevel: 5,
    intention: '',
    currentFocus: '',
    challengesToday: '',
    gratefulFor: '',
    needsSupport: '',
    journeyReflection: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { playGentleChime, playClickSound } = useLuxurySounds();
  const queryClient = useQueryClient();

  // Get current user data
  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    staleTime: 5 * 60 * 1000,
  });

  // Check if user is premium
  const isPremium = user?.subscriptionStatus === 'premium' || user?.isPermanentPremium || user?.email === 'vanessa.rich@aol.com';
  
  // Get daily check-in status
  const { data: todayCheckin } = useQuery({
    queryKey: ['/api/daily-checkin/today'],
    staleTime: 5 * 60 * 1000,
  });

  // Get message usage
  const { data: messageUsage } = useQuery({
    queryKey: ['/api/client-message-usage'],
    staleTime: 1 * 60 * 1000,
  });

  // Get Decode You reflection results
  const { data: reflectionResults } = useQuery({
    queryKey: ['/api/reflection-sessions'],
    staleTime: 5 * 60 * 1000,
  });

  // Submit daily check-in
  const submitCheckIn = useMutation({
    mutationFn: (data: DailyCheckIn) => 
      apiRequest('POST', '/api/client-daily-checkin', {
        ...data,
        checkinDate: new Date().toISOString().split('T')[0]
      }),
    onSuccess: () => {
      playGentleChime();
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/daily-checkin'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/daily-checkins'] });
    },
    onError: (error) => {
      console.error('Error submitting check-in:', error);
      alert('Error submitting your sacred check-in. Please try again.');
    }
  });

  // Submit message
  const sendMessage = useMutation({
    mutationFn: (content: string) =>
      apiRequest('POST', '/api/client-messages', {
        content,
        type: 'general'
      }),
    onSuccess: () => {
      playGentleChime();
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/client-messages'] });
    }
  });

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    submitCheckIn.mutate(checkInData);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const dailyLimit = isPremium ? 10 : 1;
    const currentCount = messageUsage?.messageCount || 0;
    
    if (currentCount >= dailyLimit) {
      alert(`You've reached your daily message limit of ${dailyLimit}. ${!isPremium ? 'Upgrade to premium for unlimited messages!' : ''}`);
      return;
    }
    
    playClickSound();
    sendMessage.mutate(newMessage);
  };

  const moodOptions = [
    { value: 'Radiant', emoji: '✨', description: 'Glowing with divine energy' },
    { value: 'Blessed', emoji: '🙏', description: 'Feeling deeply grateful' },
    { value: 'Peaceful', emoji: '🕊️', description: 'Centered and calm' },
    { value: 'Reflective', emoji: '🌙', description: 'In contemplation' },
    { value: 'Powerful', emoji: '⚡', description: 'Strong and confident' },
    { value: 'Grateful', emoji: '💝', description: 'Heart full of appreciation' },
    { value: 'Overwhelmed', emoji: '🌊', description: 'Feeling the weight' },
    { value: 'Uncertain', emoji: '🌫️', description: 'Seeking clarity' }
  ];

  if (todayCheckin && !submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-divine-gold/10 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🏛️</div>
            <h1 className="text-4xl md:text-5xl font-playfair text-deep-charcoal mb-4">
              The Divine Sanctuary
            </h1>
            <p className="text-deep-charcoal/70 text-lg">Your sacred space for daily check-ins and divine guidance</p>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-cream/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-divine-gold/40 text-center">
            <div className="text-6xl mb-6">🕊️</div>
            <h2 className="text-2xl font-playfair text-deep-charcoal mb-4">Sacred Check-In Complete</h2>
            <p className="text-deep-charcoal/70 mb-6">You've already completed your divine check-in for today. Your sacred energy has been lovingly recorded.</p>
            <div className="text-divine-gold font-medium">✨ Sanctified • Empowered • Divine ✨</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pearl-white to-divine-gold/10 flex flex-col">
      {/* Saint Regis Glass Morphism Container */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
            
            {/* Luxury Header with Glass Effect */}
            <div className="p-8 bg-gradient-to-br from-divine-gold/10 via-cream/20 to-pearl-white/30 backdrop-blur-sm border-b border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-divine-gold/20 to-luxury-gold/30 rounded-full mb-6 backdrop-blur-sm border border-divine-gold/30">
                  <span className="text-2xl">🏛️</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-serif text-divine-gold mb-3 tracking-wide">
                  The Divine Sanctuary
                </h1>
                <p className="text-luxury-gold/80 text-lg font-light mb-6">Your sacred space for daily connection and divine guidance</p>
                
                {/* Premium Badge - Enhanced Glass Morphism */}
                {isPremium && (
                  <div className="inline-flex items-center space-x-3 bg-white/30 backdrop-blur-xl border border-divine-gold/40 text-divine-gold px-6 py-3 rounded-2xl shadow-xl">
                    <Crown className="w-5 h-5 text-divine-gold" />
                    <span className="font-semibold tracking-wide">Premium Sacred Member</span>
                    <Sparkles className="w-5 h-5 text-luxury-gold" />
                  </div>
                )}
              </div>
            </div>

            {!submitted ? (
              /* Daily Check-In Form - Saint Regis Glass Morphism */
              <div className="p-8 bg-gradient-to-br from-white/20 via-cream/10 to-pearl-white/20 backdrop-blur-xl border-b border-white/20">
                <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8">
                  <h2 className="text-2xl font-serif text-divine-gold mb-8 text-center tracking-wide">Sacred Daily Check-In</h2>
                  
                  <form onSubmit={handleCheckInSubmit} className="space-y-6">
                    {/* Mood Selection */}
                    <div>
                      <label className="block mb-4 text-sm font-medium text-divine-gold">
                        How is your sacred energy flowing today?
                      </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setCheckInData({...checkInData, mood: mood.value})}
                        className={`p-4 rounded-2xl transition-all duration-300 backdrop-blur-sm border ${
                          checkInData.mood === mood.value
                            ? 'border-divine-gold bg-divine-gold/20 shadow-xl transform scale-105'
                            : 'border-white/40 hover:border-divine-gold/50 bg-white/20 hover:bg-white/30 hover:transform hover:scale-102'
                        }`}
                      >
                        <div className="text-2xl mb-2">{mood.emoji}</div>
                        <div className="text-sm font-semibold text-divine-gold">{mood.value}</div>
                        <div className="text-xs text-luxury-gold/70">{mood.description}</div>
                      </button>
                    ))}
                      </div>
                    </div>

                    {/* Mood Intensity */}
                    <div>
                      <label className="block mb-3 text-sm font-medium text-divine-gold">
                        Intensity of this energy (1-10)
                      </label>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={checkInData.moodIntensity}
                      onChange={(e) => setCheckInData({...checkInData, moodIntensity: parseInt(e.target.value)})}
                      className="w-full h-3 bg-gradient-to-r from-divine-gold/30 to-luxury-gold/30 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
                      style={{
                        background: `linear-gradient(to right, #f7e7a3 0%, #f7e7a3 ${checkInData.moodIntensity * 10}%, rgba(247, 231, 163, 0.2) ${checkInData.moodIntensity * 10}%, rgba(247, 231, 163, 0.2) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-luxury-gold/70 mt-2">
                      <span>Gentle</span>
                      <span className="font-semibold text-divine-gold text-sm">{checkInData.moodIntensity}</span>
                      <span>Intense</span>
                    </div>
                      </div>
                    </div>

                    {/* Energy Level */}
                    <div>
                      <label className="block mb-3 text-sm font-medium text-divine-gold">
                        Overall energy level (1-10)
                      </label>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={checkInData.energyLevel}
                      onChange={(e) => setCheckInData({...checkInData, energyLevel: parseInt(e.target.value)})}
                      className="w-full h-3 bg-gradient-to-r from-divine-gold/30 to-luxury-gold/30 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
                      style={{
                        background: `linear-gradient(to right, #f7e7a3 0%, #f7e7a3 ${checkInData.energyLevel * 10}%, rgba(247, 231, 163, 0.2) ${checkInData.energyLevel * 10}%, rgba(247, 231, 163, 0.2) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-luxury-gold/70 mt-2">
                      <span>Low</span>
                      <span className="font-semibold text-divine-gold text-sm">{checkInData.energyLevel}</span>
                      <span>High</span>
                    </div>
                      </div>
                    </div>

                    {/* Sacred Intention */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-divine-gold">
                        What is your divine intention today?
                      </label>
                  <textarea
                    value={checkInData.intention}
                    onChange={(e) => setCheckInData({...checkInData, intention: e.target.value})}
                    placeholder="To stay grounded in my worth, open my heart to abundance, embrace my divine power..."
                    className="w-full rounded-2xl border border-white/40 backdrop-blur-sm bg-white/30 focus:border-divine-gold focus:bg-white/40 px-6 py-4 text-sm h-28 resize-none text-divine-gold placeholder-luxury-gold/60 shadow-lg transition-all duration-300"
                    required
                      />
                    </div>

                    {/* Current Focus */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-divine-gold">
                        What are you focusing on in your sacred journey?
                      </label>
                <input
                  type="text"
                  value={checkInData.currentFocus}
                  onChange={(e) => setCheckInData({...checkInData, currentFocus: e.target.value})}
                  placeholder="Self-worth, boundary setting, abundance mindset..."
                  className="w-full rounded-2xl border border-white/40 backdrop-blur-sm bg-white/30 focus:border-divine-gold focus:bg-white/40 px-6 py-4 text-sm text-divine-gold placeholder-luxury-gold/60 shadow-lg transition-all duration-300"
                      />
                    </div>

                    {/* Today's Challenges */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-divine-gold">
                        What challenges are you navigating today?
                      </label>
                <textarea
                  value={checkInData.challengesToday}
                  onChange={(e) => setCheckInData({...checkInData, challengesToday: e.target.value})}
                  placeholder="Work stress, relationship dynamics, self-doubt..."
                  className="w-full rounded-2xl border border-white/40 backdrop-blur-sm bg-white/30 focus:border-divine-gold focus:bg-white/40 px-6 py-4 text-sm h-24 resize-none text-divine-gold placeholder-luxury-gold/60 shadow-lg transition-all duration-300"
                      />
                    </div>

                    {/* Gratitude */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-divine-gold">
                        What are you deeply grateful for today?
                      </label>
                <textarea
                  value={checkInData.gratefulFor}
                  onChange={(e) => setCheckInData({...checkInData, gratefulFor: e.target.value})}
                  placeholder="My health, loving relationships, opportunities for growth..."
                  className="w-full rounded-2xl border border-white/40 backdrop-blur-sm bg-white/30 focus:border-divine-gold focus:bg-white/40 px-6 py-4 text-sm h-24 resize-none text-divine-gold placeholder-luxury-gold/60 shadow-lg transition-all duration-300"
                      />
                    </div>

                    {/* Support Needed */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-divine-gold">
                        What kind of sacred support do you need?
                      </label>
                <textarea
                  value={checkInData.needsSupport}
                  onChange={(e) => setCheckInData({...checkInData, needsSupport: e.target.value})}
                  placeholder="Encouragement, clarity, grounding, courage..."
                  className="w-full rounded-2xl border border-white/40 backdrop-blur-sm bg-white/30 focus:border-divine-gold focus:bg-white/40 px-6 py-4 text-sm h-24 resize-none text-divine-gold placeholder-luxury-gold/60 shadow-lg transition-all duration-300"
                      />
                    </div>

                    {/* Journey Reflection */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-divine-gold">
                        Reflect on your sacred journey progress
                      </label>
                <textarea
                  value={checkInData.journeyReflection}
                  onChange={(e) => setCheckInData({...checkInData, journeyReflection: e.target.value})}
                  placeholder="How I'm growing, what I'm learning about myself, shifts I'm noticing..."
                  className="w-full rounded-2xl border border-white/40 backdrop-blur-sm bg-white/30 focus:border-divine-gold focus:bg-white/40 px-6 py-4 text-sm h-28 resize-none text-divine-gold placeholder-luxury-gold/60 shadow-lg transition-all duration-300"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitCheckIn.isPending || !checkInData.mood || !checkInData.intention}
                      className="w-full bg-gradient-to-r from-divine-gold via-luxury-gold to-divine-gold text-white py-4 rounded-2xl hover:shadow-2xl hover:scale-102 transition-all duration-300 disabled:opacity-50 font-semibold shadow-xl text-lg backdrop-blur-sm border border-divine-gold/30"
                    >
                      {submitCheckIn.isPending ? 'Submitting Sacred Check-In...' : 'Complete Sacred Check-In ✨'}
                    </button>
                  </form>
                </div>
              </div>
                ) : (
              /* Success State - Saint Regis Glass Morphism */
              <div className="p-8 bg-gradient-to-br from-white/20 via-cream/10 to-pearl-white/20 backdrop-blur-xl">
                <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8 text-center">
                  <div className="text-6xl mb-6">🕊️</div>
                  <h2 className="text-2xl font-serif text-divine-gold mb-4 tracking-wide">Sacred Check-In Complete</h2>
                  <p className="text-luxury-gold/80 mb-6 font-light">Your sacred energy and intentions have been lovingly recorded. Vanessa will receive your divine insights for your journey together.</p>
                  <div className="text-divine-gold font-semibold tracking-wide">✨ Sanctified • Empowered • Divine ✨</div>
                </div>
              </div>
            )}

            {/* Decode You Results Section - Saint Regis Glass Morphism */}
            {reflectionResults && reflectionResults.length > 0 && (
              <div className="p-8 bg-gradient-to-br from-white/20 via-cream/10 to-pearl-white/20 backdrop-blur-xl border-t border-white/20">
                <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif text-divine-gold tracking-wide">Your Sacred Decode You™ Insights</h2>
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                      <Sparkles className="w-5 h-5 text-divine-gold" />
                      <span className="text-sm text-luxury-gold font-medium">
                        {reflectionResults.length} reflections completed
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reflectionResults.slice(0, 3).map((session: any, index: number) => (
                      <div key={session.id} className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-divine-gold/20 to-luxury-gold/30 rounded-full flex items-center justify-center border border-divine-gold/30">
                              <span className="text-sm font-semibold text-divine-gold">{index + 1}</span>
                            </div>
                            <span className="text-sm text-luxury-gold font-medium">
                              {new Date(session.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="text-xs text-luxury-gold/70 font-medium uppercase tracking-wide">Current Emotion</div>
                            <div className="text-sm text-divine-gold font-medium">{session.emotionToday || 'Not specified'}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-luxury-gold/70 font-medium uppercase tracking-wide">Body State</div>
                            <div className="text-sm text-divine-gold font-medium">{session.nervousSystemState || 'Not specified'}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-luxury-gold/70 font-medium uppercase tracking-wide">Coping Pattern</div>
                            <div className="text-sm text-divine-gold font-medium">{session.copingPattern || 'Not specified'}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-luxury-gold/70 font-medium uppercase tracking-wide">Hidden Desire</div>
                            <div className="text-sm text-divine-gold font-medium">{session.hiddenDesire || 'Not specified'}</div>
                          </div>
                        </div>
                        
                        {session.blockOrBelief && (
                          <div className="space-y-2 mb-4">
                            <div className="text-xs text-luxury-gold/70 font-medium uppercase tracking-wide">Limiting Belief</div>
                            <div className="text-sm text-divine-gold italic">{session.blockOrBelief}</div>
                          </div>
                        )}
                        
                        {session.aiInsights && (
                          <div className="bg-gradient-to-r from-divine-gold/10 via-cream/5 to-pearl-white/10 rounded-xl p-4 border border-divine-gold/20">
                            <div className="text-xs text-divine-gold font-medium uppercase tracking-wide mb-2">Vanessa's Sacred Insights</div>
                            <div className="text-sm text-luxury-gold/90 leading-relaxed">{session.aiInsights}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {reflectionResults.length > 3 && (
                    <div className="mt-6 text-center">
                      <div className="text-sm text-luxury-gold/70">
                        Showing 3 most recent insights • {reflectionResults.length - 3} more available
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Divine Messaging Section - Saint Regis Glass Morphism */}
            <div className="p-8 bg-gradient-to-br from-white/20 via-cream/10 to-pearl-white/20 backdrop-blur-xl border-t border-white/20">
              <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif text-divine-gold tracking-wide">Sacred Messages with Vanessa</h2>
                  <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                    <MessageSquare className="w-5 h-5 text-divine-gold" />
                    <span className="text-sm text-luxury-gold font-medium">
                      {messageUsage?.messageCount || 0}/{isPremium ? 10 : 1} daily messages
                    </span>
                  </div>
                </div>

                <form onSubmit={handleMessageSubmit} className="space-y-6">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Share your thoughts, questions, or insights with Vanessa... ${!isPremium ? '(1 message per day for free members)' : ''}`}
                    className="w-full rounded-2xl border border-white/40 backdrop-blur-sm bg-white/30 focus:border-divine-gold focus:bg-white/40 px-6 py-4 text-sm h-28 resize-none text-divine-gold placeholder-luxury-gold/60 shadow-lg transition-all duration-300"
                    disabled={!isPremium && (messageUsage?.messageCount || 0) >= 1}
                  />
            
                  <div className="flex justify-between items-center">
                    {!isPremium && (
                      <div className="text-xs text-luxury-gold/70 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/30">
                        Upgrade to Premium for unlimited daily messages
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={sendMessage.isPending || !newMessage.trim() || (!isPremium && (messageUsage?.messageCount || 0) >= 1)}
                      className="bg-gradient-to-r from-divine-gold via-luxury-gold to-divine-gold text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-102 transition-all duration-300 disabled:opacity-50 font-semibold shadow-xl flex items-center space-x-3 backdrop-blur-sm border border-divine-gold/30"
                    >
                      <Send className="w-5 h-5" />
                      <span>{sendMessage.isPending ? 'Sending...' : 'Send Sacred Message'}</span>
                    </button>
                  </div>
                </form>

                {!isPremium && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-divine-gold/10 via-cream/5 to-pearl-white/10 rounded-2xl border border-divine-gold/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-divine-gold/20 to-luxury-gold/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-divine-gold/30">
                        <Crown className="w-6 h-6 text-divine-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-divine-gold tracking-wide">Unlock Unlimited Sacred Communication</h3>
                        <p className="text-sm text-luxury-gold/80 font-light">Premium members get 10 daily messages, priority responses, and exclusive content access.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sanctuary;