import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, MessageCircle, Download, Edit3, Clock, Heart, Sparkles, BookOpen, ExternalLink, TrendingUp, Plus, Star, Target, Zap, Crown, Phone, Video, FileText, PlayCircle, Headphones } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import DailyRitualCheckIn from '@/components/DailyRitualCheckIn';

interface DailyCheckIn {
  mood: string;
  reflection: string;
  date: string;
}

interface FocusArea {
  focus: string;
  ritualSuggestion: string;
  description: string;
}

interface ClientMessage {
  id: number;
  content: string;
  senderRole: string;
  createdAt: string;
  isRead: boolean;
}

interface JourneyData {
  stage: string;
  wins: string[];
  challenges: string[];
  energyLevel: number;
  currentFocus: string;
}

interface ResourceItem {
  id: number;
  type: 'PDF' | 'Audio' | 'Video';
  title: string;
  downloadUrl: string;
}

const TopNav = () => {
  const navigationItems = [
    { name: 'Messages', href: '/chat', icon: MessageCircle },
    { name: 'My Journey', href: '/journal', icon: BookOpen },
    { name: 'Calendar', href: '#calendar', icon: Calendar, isExternal: true, url: 'https://calendly.com/vanessa-rich/discovery_session' },
    { name: 'Rituals', href: '/rituals', icon: Sparkles },
    { name: 'Resources', href: '#resources', icon: Download, isScroll: true },
    { name: 'Account', href: '/profile', icon: Heart }
  ];

  const handleNavClick = (item: any) => {
    if (item.isExternal) {
      window.open(item.url, '_blank');
    } else if (item.isScroll) {
      document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-amber-200 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif text-amber-900">Sacred Sanctuary</h1>
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              item.isExternal || item.isScroll ? (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ) : (
                <Link key={item.name} href={item.href}>
                  <span className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </span>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function ClientPortal() {
  const [currentFocus, setCurrentFocus] = useState("Reclaiming Self-Worth");
  const [focusDescription, setFocusDescription] = useState("Embrace your inherent value and divine worth");
  const [isEditingFocus, setIsEditingFocus] = useState(false);

  const journeyData: JourneyData = {
    stage: "Empowerment Phase",
    wins: ["Completed morning ritual 5 days straight", "Journaled daily this week", "Practiced self-compassion"],
    challenges: ["Managing work stress", "Setting boundaries with family"],
    energyLevel: 75,
    currentFocus: "Reclaiming Self-Worth"
  };

  const [journeyUpdates, setJourneyUpdates] = useState({
    newWin: '',
    newChallenge: '',
    energyLevel: journeyData.energyLevel,
    stage: journeyData.stage
  });

  const handleResourceAccess = (resource: ResourceItem) => {
    console.log(`Accessing resource: ${resource.title}`);
  };

  const handleAddWin = () => {
    if (journeyUpdates.newWin.trim()) {
      console.log('Adding win:', journeyUpdates.newWin);
      setJourneyUpdates(prev => ({ ...prev, newWin: '' }));
    }
  };

  const handleAddChallenge = () => {
    if (journeyUpdates.newChallenge.trim()) {
      console.log('Adding challenge:', journeyUpdates.newChallenge);
      setJourneyUpdates(prev => ({ ...prev, newChallenge: '' }));
    }
  };

  const todayRitual = {
    title: "Morning Gratitude Ritual",
    description: "Begin your day with divine appreciation",
    steps: [
      "Light a candle or find natural light",
      "Take 5 deep breaths",
      "Write down 3 things you're grateful for",
      "Set an intention for the day"
    ],
    pdfUrl: "/rituals/morning-gratitude.pdf"
  };

  const resources: ResourceItem[] = [
    { id: 1, type: 'PDF', title: 'Emotional Reset Worksheet', downloadUrl: '/resources/emotional-reset.pdf' },
    { id: 2, type: 'Audio', title: 'Confidence Meditation', downloadUrl: '/resources/confidence-meditation.mp3' },
    { id: 3, type: 'Video', title: 'Boundary Setting Masterclass', downloadUrl: '/resources/boundary-setting.mp4' }
  ];

  const messages: ClientMessage[] = [
    { id: 1, content: "How are you feeling about your progress this week?", senderRole: "coach", createdAt: "2024-01-15T10:30:00Z", isRead: false },
    { id: 2, content: "I've been working on the self-worth exercises daily", senderRole: "client", createdAt: "2024-01-15T14:20:00Z", isRead: true },
    { id: 3, content: "That's wonderful! I can see the shift in your energy", senderRole: "coach", createdAt: "2024-01-15T16:45:00Z", isRead: false }
  ];

  const handleFocusUpdate = () => {
    setIsEditingFocus(false);
  };

  // Check if user is admin
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/user'],
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = currentUser?.email === 'vanessa.rich@aol.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      <TopNav />
      
      {/* Main Content */}
      <div className="pt-20 pb-24 px-4 max-w-6xl mx-auto">
        
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-deep-charcoal mb-4">
            {isAdmin ? 'Your Sacred Admin Portal' : 'Your Sacred Sanctuary'}
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            {isAdmin ? 'Manage your divine coaching platform' : 'Welcome to your divine dashboard of transformation'}
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {isAdmin ? (
            <>
              {/* Client Messages Button (Admin) */}
              <Link href="/admin/client-messages">
                <div className="w-full h-32 bg-gradient-to-br from-amber-100 to-yellow-200 hover:from-amber-200 hover:to-yellow-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-amber-300/50">
                  <div className="text-center space-y-2">
                    <MessageCircle className="w-8 h-8 mx-auto text-amber-700" />
                    <div className="font-semibold text-lg">Client Messages</div>
                    <div className="text-sm opacity-80">Coach dashboard</div>
                  </div>
                </div>
              </Link>

              {/* Admin Panel Button */}
              <Link href="/admin">
                <div className="w-full h-32 bg-gradient-to-br from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-amber-400/50">
                  <div className="text-center space-y-2">
                    <Crown className="w-8 h-8 mx-auto text-amber-700" />
                    <div className="font-semibold text-lg">Admin Panel</div>
                    <div className="text-sm opacity-80">Platform management</div>
                  </div>
                </div>
              </Link>

              {/* Bulk Emails Button */}
              <Link href="/admin/bulk-emails">
                <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-amber-200 hover:from-yellow-200 hover:to-amber-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-yellow-300/50">
                  <div className="text-center space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-amber-700" />
                    <div className="font-semibold text-lg">Bulk Emails</div>
                    <div className="text-sm opacity-80">Email campaigns</div>
                  </div>
                </div>
              </Link>

              {/* Analytics Button */}
              <Link href="/admin/feedback">
                <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-amber-200 hover:from-orange-200 hover:to-amber-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-orange-300/50">
                  <div className="text-center space-y-2">
                    <TrendingUp className="w-8 h-8 mx-auto text-amber-700" />
                    <div className="font-semibold text-lg">Analytics</div>
                    <div className="text-sm opacity-80">Platform insights</div>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <>
              {/* Message Vanessa Button */}
              <Link href="/messages">
                <div className="w-full h-32 bg-gradient-to-br from-amber-100 to-yellow-200 hover:from-amber-200 hover:to-yellow-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-amber-300/50">
                  <div className="text-center space-y-2">
                    <MessageCircle className="w-8 h-8 mx-auto text-amber-700" />
                    <div className="font-semibold text-lg">Message Vanessa</div>
                    <div className="text-sm opacity-80">Direct coaching support</div>
                  </div>
                </div>
              </Link>

              {/* Book Session Button */}
              <div 
                className="w-full h-32 bg-gradient-to-br from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-amber-400/50"
                onClick={() => window.open('https://calendly.com/vanessa-rich/discovery_session', '_blank')}
              >
                <div className="text-center space-y-2">
                  <Video className="w-8 h-8 mx-auto text-amber-700" />
                  <div className="font-semibold text-lg">Book Session</div>
                  <div className="text-sm opacity-80">1:1 Transformation</div>
                </div>
              </div>

              {/* Sacred Rituals Button */}
              <Link href="/rituals">
                <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-amber-200 hover:from-yellow-200 hover:to-amber-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-yellow-300/50">
                  <div className="text-center space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-amber-700" />
                    <div className="font-semibold text-lg">Sacred Rituals</div>
                    <div className="text-sm opacity-80">Daily practices</div>
                  </div>
                </div>
              </Link>

              {/* Journey Tracker Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-amber-200 hover:from-orange-200 hover:to-amber-300 text-amber-900 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-orange-300/50">
                    <div className="text-center space-y-2">
                      <TrendingUp className="w-8 h-8 mx-auto text-amber-700" />
                      <div className="font-semibold text-lg">Journey Tracker</div>
                      <div className="text-sm opacity-80">Track your progress</div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-amber-900">Your Journey Progress</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    
                    {/* Energy Level */}
                    <div className="space-y-3">
                      <Label className="text-lg font-medium text-amber-900">Energy Level</Label>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-emerald-600">{journeyUpdates.energyLevel}%</span>
                        <Progress value={journeyUpdates.energyLevel} className="flex-1 h-3" />
                      </div>
                    </div>

                    {/* Current Stage */}
                    <div className="space-y-3">
                      <Label className="text-lg font-medium text-amber-900">Current Stage</Label>
                      <Input
                        value={journeyUpdates.stage}
                        onChange={(e) => setJourneyUpdates(prev => ({ ...prev, stage: e.target.value }))}
                        className="text-lg"
                        placeholder="e.g., Empowerment Phase"
                      />
                    </div>

                    {/* Recent Wins */}
                    <div className="space-y-3">
                      <Label className="text-lg font-medium text-amber-900">Add New Win</Label>
                      <div className="flex gap-2">
                        <Input
                          value={journeyUpdates.newWin}
                          onChange={(e) => setJourneyUpdates(prev => ({ ...prev, newWin: e.target.value }))}
                          placeholder="Celebrate your recent accomplishment..."
                          className="flex-1"
                        />
                        <Button onClick={handleAddWin} className="bg-emerald-600 hover:bg-emerald-700">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {journeyData.wins.map((win, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                            <Star className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-800">{win}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Growth Areas */}
                    <div className="space-y-3">
                      <Label className="text-lg font-medium text-amber-900">Add Growth Area</Label>
                      <div className="flex gap-2">
                        <Input
                          value={journeyUpdates.newChallenge}
                          onChange={(e) => setJourneyUpdates(prev => ({ ...prev, newChallenge: e.target.value }))}
                          placeholder="What are you working on improving..."
                          className="flex-1"
                        />
                        <Button onClick={handleAddChallenge} className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {journeyData.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                            <Target className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-800">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                      Save Journey Updates
                    </Button>

                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

        </div>

        {/* Daily Check-in Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl rounded-3xl mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-amber-900 text-2xl">
              <Heart className="w-7 h-7" />
              Daily Sacred Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyRitualCheckIn />
          </CardContent>
        </Card>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Current Focus Area */}
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 shadow-xl rounded-3xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-purple-900 text-xl">
                <Target className="w-6 h-6" />
                {isAdmin ? 'Client Focus Management' : 'Current Focus Area'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingFocus ? (
                <div className="space-y-4">
                  <Input
                    value={currentFocus}
                    onChange={(e) => setCurrentFocus(e.target.value)}
                    className="font-semibold text-purple-900 text-lg"
                  />
                  <Textarea
                    value={focusDescription}
                    onChange={(e) => setFocusDescription(e.target.value)}
                    rows={3}
                    className="text-purple-700"
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleFocusUpdate} 
                      className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                    >
                      {isAdmin ? 'Save Client Focus' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingFocus(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif text-purple-900">{currentFocus}</h3>
                  <p className="text-purple-700 text-lg">{focusDescription}</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsEditingFocus(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isAdmin ? 'Update Client Focus' : 'Update Focus'}
                    </Button>
                    <Badge variant="secondary" className="bg-purple-200 text-purple-800 px-4 py-2">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Active Focus
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Session Countdown */}
          <Card className="bg-gradient-to-br from-rose-100 to-amber-100 border-rose-200 shadow-xl rounded-3xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-rose-900 text-xl">
                <Clock className="w-6 h-6" />
                {isAdmin ? 'Session Management' : 'Next Sacred Session'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAdmin && (
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-rose-800">
                    3 days, 14 hours
                  </div>
                  <p className="text-rose-700 text-lg">Until your next transformation session</p>
                </div>
              )}
              <div className="space-y-3">
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white h-12"
                  onClick={() => window.open('https://calendly.com/vanessa-rich/discovery_session', '_blank')}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {isAdmin ? 'Manage Calendar' : 'Book New Session'}
                </Button>
                {!isAdmin && (
                  <Button
                    variant="outline"
                    className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 h-12"
                    onClick={() => window.open('sms:310-990-6264?body=Hi Vanessa, I need to reschedule my upcoming session.', '_blank')}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Reschedule Session
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Resource Library */}
        <Card id="resources" className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-amber-900 text-2xl">
              <BookOpen className="w-7 h-7" />
              Resource Library
            </CardTitle>
            <p className="text-amber-700 text-lg">Sacred tools for your spiritual journey</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 space-y-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    {resource.type === 'PDF' && <FileText className="w-8 h-8 text-amber-600" />}
                    {resource.type === 'Audio' && <Headphones className="w-8 h-8 text-amber-600" />}
                    {resource.type === 'Video' && <PlayCircle className="w-8 h-8 text-amber-600" />}
                    <Badge className="bg-amber-200 text-amber-800 font-medium">
                      {resource.type}
                    </Badge>
                  </div>
                  <h4 className="font-serif text-xl text-amber-900">{resource.title}</h4>
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12"
                    onClick={() => handleResourceAccess(resource)}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Access Resource
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}