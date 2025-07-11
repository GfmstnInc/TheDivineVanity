import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface DailyCheckin {
  id: number;
  userId: string;
  mood: string;
  intention: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function AdminDailyCheckins() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: checkins, isLoading, error } = useQuery({
    queryKey: ['/api/admin/daily-checkins'],
    queryFn: async () => {
      const response = await fetch('/api/admin/daily-checkins', {
        headers: {
          'Authorization': `Bearer ${adminKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch daily check-ins');
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'divine-admin-2025') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin key');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-divine-gold/40 w-full max-w-md">
          <h1 className="text-2xl font-bold text-deep-charcoal mb-6 text-center font-playfair">
            Admin Daily Check-ins
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-charcoal/80 mb-2">
                Admin Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 border border-divine-gold/30 rounded-xl focus:border-divine-gold focus:ring-divine-gold bg-white/70"
                placeholder="Enter admin key"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-divine-gold to-amber-500 text-white py-3 rounded-xl hover:from-divine-gold/90 hover:to-amber-500/90 transition-all duration-200 font-medium shadow-lg"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-divine-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-deep-charcoal/70">Loading sacred check-ins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-red-300">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodEmoji = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    if (lowerMood.includes('peaceful') || lowerMood.includes('calm')) return '🕊️';
    if (lowerMood.includes('happy') || lowerMood.includes('joy')) return '✨';
    if (lowerMood.includes('anxious') || lowerMood.includes('worried')) return '🌪️';
    if (lowerMood.includes('grateful') || lowerMood.includes('blessed')) return '🙏';
    if (lowerMood.includes('energized') || lowerMood.includes('powerful')) return '⚡';
    if (lowerMood.includes('sad') || lowerMood.includes('low')) return '💙';
    return '💫';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-divine-gold/40">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-deep-charcoal font-playfair">
              Daily Check-ins Dashboard
            </h1>
            <div className="text-right">
              <div className="text-sm text-deep-charcoal/70">Total Check-ins</div>
              <div className="text-2xl font-bold text-divine-gold">{checkins?.checkins?.length || 0}</div>
            </div>
          </div>

          {checkins?.checkins?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🕊️</div>
              <h3 className="text-xl font-semibold text-deep-charcoal mb-2">No Check-ins Yet</h3>
              <p className="text-deep-charcoal/70">Client check-ins will appear here as they complete their daily rituals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {checkins?.checkins?.map((checkin: DailyCheckin) => (
                <div key={checkin.id} className="bg-gradient-to-r from-white to-cream/50 rounded-xl p-6 border border-divine-gold/20 shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getMoodEmoji(checkin.mood)}</div>
                      <div>
                        <div className="text-sm text-deep-charcoal/60">User ID: {checkin.userId}</div>
                        <div className="text-sm text-deep-charcoal/60">{formatDate(checkin.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-deep-charcoal mb-2">Sacred Energy</h4>
                      <p className="text-deep-charcoal/80 bg-white/60 rounded-lg p-3 italic">
                        "{checkin.mood}"
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-deep-charcoal mb-2">Divine Intention</h4>
                      <p className="text-deep-charcoal/80 bg-white/60 rounded-lg p-3 italic">
                        "{checkin.intention}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}