import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Users, MessageSquare, TrendingUp, Calendar, Filter, Eye, Download } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface DivineFeedback {
  id: number;
  userId: string;
  premiumContentInterest: string;
  uniqueFeatureIdeas: string;
  milestoneRewardIdeas: string;
  pricingPreference: string;
  joinFocusGroup: boolean;
  focusGroupName: string | null;
  focusGroupEmail: string | null;
  focusGroupPhone: string | null;
  createdAt: string;
}

interface FeedbackAnalytics {
  totalFeedback: number;
  focusGroupInterest: number;
  pricingBreakdown: Record<string, number>;
  commonFeatures: string[];
  recentSubmissions: DivineFeedback[];
}

export default function AdminFeedback() {
  const [selectedFeedback, setSelectedFeedback] = useState<DivineFeedback | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'focus_group' | 'recent'>('all');
  
  const handleLogout = () => {
    sessionStorage.removeItem("divine-admin-key");
    sessionStorage.removeItem("divine-admin-authenticated");
    window.location.href = "/admin";
  };

  const { data: feedback = [], isLoading } = useQuery<DivineFeedback[]>({
    queryKey: ["/api/divine-feedback"],
    queryFn: async () => {
      const response = await fetch("/api/divine-feedback?key=divine-admin-2025");
      if (!response.ok) throw new Error("Failed to fetch feedback");
      return response.json();
    },
  });

  const analytics: FeedbackAnalytics = {
    totalFeedback: feedback.length,
    focusGroupInterest: feedback.filter(f => f.joinFocusGroup).length,
    pricingBreakdown: feedback.reduce((acc, f) => {
      const pricing = f.pricingPreference || 'Not specified';
      acc[pricing] = (acc[pricing] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    commonFeatures: extractCommonFeatures(feedback),
    recentSubmissions: feedback
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  };

  const filteredFeedback = feedback.filter(f => {
    if (filterType === 'focus_group') return f.joinFocusGroup;
    if (filterType === 'recent') return new Date(f.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return true;
  });

  const exportData = () => {
    const csvContent = [
      ['ID', 'User ID', 'Premium Content Interest', 'Unique Feature Ideas', 'Milestone Reward Ideas', 'Pricing Preference', 'Join Focus Group', 'Focus Group Name', 'Focus Group Email', 'Focus Group Phone', 'Created At'],
      ...feedback.map(f => [
        f.id,
        f.userId,
        f.premiumContentInterest || '',
        f.uniqueFeatureIdeas || '',
        f.milestoneRewardIdeas || '',
        f.pricingPreference || '',
        f.joinFocusGroup ? 'Yes' : 'No',
        f.focusGroupName || '',
        f.focusGroupEmail || '',
        f.focusGroupPhone || '',
        format(new Date(f.createdAt), 'yyyy-MM-dd HH:mm:ss')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `divine-feedback-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
        <div className="animate-pulse pt-20 px-6">
          <div className="h-32 bg-gray-200 rounded-3xl mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      {/* Header */}
      <header className="glass-effect border-b border-soft-gray sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-playfair text-xl font-semibold text-deep-charcoal">
                Divine Feedback Analytics
              </h1>
              <p className="text-sm text-gray-600">Sacred insights from the community</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={exportData}
              className="bg-divine-gold hover:bg-divine-gold/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-divine-gold text-divine-gold hover:bg-divine-gold/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-6 px-6 pb-20">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-divine-gold">{analytics.totalFeedback}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-divine-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Focus Group Interest</p>
                  <p className="text-2xl font-bold text-divine-gold">{analytics.focusGroupInterest}</p>
                </div>
                <Users className="w-8 h-8 text-divine-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-divine-gold">
                    {analytics.totalFeedback > 0 ? Math.round((analytics.focusGroupInterest / analytics.totalFeedback) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-divine-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-divine-gold">
                    {feedback.filter(f => new Date(f.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-divine-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Insights</TabsTrigger>
            <TabsTrigger value="features">Feature Requests</TabsTrigger>
            <TabsTrigger value="submissions">All Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-divine-gold">Pricing Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.pricingBreakdown).map(([price, count]) => (
                      <div key={price} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{price}</span>
                        <Badge variant="outline" className="text-divine-gold border-divine-gold">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-divine-gold">Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.recentSubmissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">User: {submission.userId}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedFeedback(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-divine-gold">Pricing Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(analytics.pricingBreakdown).map(([price, count]) => (
                    <div key={price} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-lg mb-2">{price}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-divine-gold">{count}</span>
                        <span className="text-sm text-gray-500">
                          {analytics.totalFeedback > 0 ? Math.round((count / analytics.totalFeedback) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-divine-gold">Feature Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.commonFeatures.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p className="text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-divine-gold">All Submissions</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="border rounded px-3 py-1"
                    >
                      <option value="all">All</option>
                      <option value="focus_group">Focus Group Interest</option>
                      <option value="recent">Recent (7 days)</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFeedback.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">User: {submission.userId}</span>
                          {submission.joinFocusGroup && (
                            <Badge className="ml-2 bg-divine-gold text-white">Focus Group</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(submission.createdAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {submission.premiumContentInterest && (
                          <p><strong>Premium Content:</strong> {submission.premiumContentInterest}</p>
                        )}
                        {submission.uniqueFeatureIdeas && (
                          <p><strong>Feature Ideas:</strong> {submission.uniqueFeatureIdeas}</p>
                        )}
                        {submission.pricingPreference && (
                          <p><strong>Pricing:</strong> {submission.pricingPreference}</p>
                        )}
                        {submission.joinFocusGroup && (
                          <div className="bg-divine-gold/10 p-2 rounded">
                            <p><strong>Focus Group Contact:</strong></p>
                            <p>Name: {submission.focusGroupName}</p>
                            <p>Email: {submission.focusGroupEmail}</p>
                            <p>Phone: {submission.focusGroupPhone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function extractCommonFeatures(feedback: DivineFeedback[]): string[] {
  const features: string[] = [];
  feedback.forEach(f => {
    if (f.premiumContentInterest) features.push(f.premiumContentInterest);
    if (f.uniqueFeatureIdeas) features.push(f.uniqueFeatureIdeas);
    if (f.milestoneRewardIdeas) features.push(f.milestoneRewardIdeas);
  });
  return features.filter(Boolean).slice(0, 10);
}