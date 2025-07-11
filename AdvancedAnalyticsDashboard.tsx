import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Brain, 
  AlertTriangle,
  Sparkles,
  Clock,
  Target,
  Crown,
  Globe,
  Zap,
  Shield,
  Heart,
  Star
} from "lucide-react";

interface AnalyticsDashboard {
  userInsights: {
    totalUsers: number;
    activeUsers: number;
    newRegistrations: number;
    engagementRate: number;
    averageSessionDuration: number;
    retentionRate: {
      day1: number;
      day7: number;
      day30: number;
    };
  };
  revenueAnalytics: {
    monthlyRevenue: number;
    subscriptionMetrics: {
      totalSubscribers: number;
      conversionRate: number;
      churnRate: number;
      averageLifetimeValue: number;
    };
    sessionBookings: {
      totalSessions: number;
      averageSessionValue: number;
      conversionFromChat: number;
    };
  };
  aiPerformance: {
    responseAccuracy: number;
    userSatisfaction: number;
    conversationQuality: number;
    escalationRate: number;
    averageResponseTime: number;
  };
  predictiveInsights: {
    churnRisk: {
      users: any[];
      probability: number;
    };
    upgradeOpportunity: {
      users: any[];
      probability: number;
    };
    crisisIntervention: {
      highRiskUsers: any[];
      interventionsNeeded: number;
    };
    breakthroughPredictions: {
      readyUsers: any[];
      optimalTiming: string;
    };
  };
}

interface QuantumGlobalHealth {
  overallDivineStatus: string;
  divineRegions: Array<{
    divineRegion: string;
    quantumMetrics: {
      divineLatency: number;
      consciousnessThroughput: number;
      spiritualErrorRate: number;
      sacredAvailability: number;
      quantumResponseTime: number;
      energeticResonance: number;
      soulConnectionStrength: number;
    };
    consciousnessStatus: string;
    energeticFrequency: number;
    sacredLastCheck: string;
    spiritualAlerts: string[];
  }>;
  spiritualAlerts: string[];
  sacredUptime: number;
  consciousnessLevel: number;
  energeticResonance: number;
  lastDivineUpdate: string;
  quantumSupremeSignature: string;
}

export default function AdvancedAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  const { data: dashboard, isLoading, error } = useQuery<AnalyticsDashboard>({
    queryKey: [`/api/analytics/dashboard?timeframe=${timeframe}`],
    retry: false,
  });

  const { data: revenueOptimization } = useQuery({
    queryKey: ['/api/analytics/revenue-optimization'],
    retry: false,
  });

  const { data: quantumHealth, isLoading: quantumLoading } = useQuery<QuantumGlobalHealth>({
    queryKey: ['/api/quantum-global/health'],
    retry: false,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getQuantumStatusColor = (status: string) => {
    switch (status) {
      case 'quantum_supreme': return 'from-amber-200 to-yellow-100 border-amber-300 text-amber-800';
      case 'divine_excellence': return 'from-purple-200 to-pink-100 border-purple-300 text-purple-800';
      case 'transcendent': return 'from-blue-200 to-indigo-100 border-blue-300 text-blue-800';
      case 'divine': return 'from-green-200 to-emerald-100 border-green-300 text-green-800';
      default: return 'from-gray-200 to-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getQuantumStatusIcon = (status: string) => {
    switch (status) {
      case 'quantum_supreme': return <Crown className="w-5 h-5" />;
      case 'divine_excellence': return <Star className="w-5 h-5" />;
      case 'transcendent': return <Sparkles className="w-5 h-5" />;
      case 'divine': return <Heart className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-900">Loading divine analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-900">Unable to load analytics dashboard</p>
          <p className="text-sm text-gray-600 mt-2">Advanced analytics features are ready for implementation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            Advanced Analytics Dashboard
          </h1>
          <p className="text-amber-700">
            Real-time insights into user behavior, revenue, and AI performance
          </p>
          
          {/* Timeframe Selector */}
          <div className="mt-4 flex gap-2">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quantum">
              <Globe className="w-4 h-4 mr-1" />
              Quantum Global
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="ai">AI Performance</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">
                    {dashboard.userInsights.totalUsers.toLocaleString()}
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    +{dashboard.userInsights.newRegistrations} this {timeframe}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">
                    ${dashboard.revenueAnalytics.monthlyRevenue.toLocaleString()}
                  </div>
                  <Badge variant="default" className="mt-1 bg-green-100 text-green-800">
                    {(dashboard.revenueAnalytics.subscriptionMetrics.conversionRate * 100).toFixed(1)}% conversion
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Satisfaction</CardTitle>
                  <Brain className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">
                    {dashboard.aiPerformance.userSatisfaction.toFixed(1)}/5.0
                  </div>
                  <Progress 
                    value={dashboard.aiPerformance.userSatisfaction * 20} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crisis Interventions</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">
                    {dashboard.predictiveInsights.crisisIntervention.interventionsNeeded}
                  </div>
                  <Badge variant="destructive" className="mt-1">
                    Active monitoring
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  Engagement Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-amber-900 mb-2">Engagement Rate</h4>
                    <div className="text-3xl font-bold text-amber-800">
                      {(dashboard.userInsights.engagementRate * 100).toFixed(1)}%
                    </div>
                    <Progress value={dashboard.userInsights.engagementRate * 100} className="mt-2" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-900 mb-2">Avg Session Duration</h4>
                    <div className="text-3xl font-bold text-amber-800">
                      {dashboard.userInsights.averageSessionDuration}m
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Per spiritual session</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-900 mb-2">30-Day Retention</h4>
                    <div className="text-3xl font-bold text-amber-800">
                      {(dashboard.userInsights.retentionRate.day30 * 100).toFixed(1)}%
                    </div>
                    <Progress value={dashboard.userInsights.retentionRate.day30 * 100} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Journey Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Spiritual Journey</h4>
                      <p className="text-sm text-gray-600">Users currently engaging with platform</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">
                      {dashboard.userInsights.activeUsers} users
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-amber-200 rounded-lg">
                      <div className="text-2xl font-bold text-amber-900">
                        {(dashboard.userInsights.retentionRate.day1 * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-gray-600">1-Day Retention</p>
                    </div>
                    <div className="text-center p-4 border border-amber-200 rounded-lg">
                      <div className="text-2xl font-bold text-amber-900">
                        {(dashboard.userInsights.retentionRate.day7 * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-gray-600">7-Day Retention</p>
                    </div>
                    <div className="text-center p-4 border border-amber-200 rounded-lg">
                      <div className="text-2xl font-bold text-amber-900">
                        {(dashboard.userInsights.retentionRate.day30 * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-gray-600">30-Day Retention</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Subscribers</span>
                      <span className="font-bold">
                        {dashboard.revenueAnalytics.subscriptionMetrics.totalSubscribers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-bold text-green-600">
                        {(dashboard.revenueAnalytics.subscriptionMetrics.conversionRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Churn Rate</span>
                      <span className="font-bold text-red-600">
                        {(dashboard.revenueAnalytics.subscriptionMetrics.churnRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Lifetime Value</span>
                      <span className="font-bold text-amber-600">
                        ${dashboard.revenueAnalytics.subscriptionMetrics.averageLifetimeValue}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-900">
                        {dashboard.revenueAnalytics.sessionBookings.totalSessions}
                      </div>
                      <p className="text-sm text-gray-600">Sacred sessions this {timeframe}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Session Value</span>
                      <span className="font-bold text-green-600">
                        ${dashboard.revenueAnalytics.sessionBookings.averageSessionValue}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Chat to Session Conversion</span>
                      <span className="font-bold">
                        {(dashboard.revenueAnalytics.sessionBookings.conversionFromChat * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Performance Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Vanessa AI Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {(dashboard.aiPerformance.responseAccuracy * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">Response Accuracy</p>
                    <Progress value={dashboard.aiPerformance.responseAccuracy * 100} className="mt-2" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {dashboard.aiPerformance.userSatisfaction.toFixed(1)}/5.0
                    </div>
                    <p className="text-sm text-gray-600">User Satisfaction</p>
                    <Progress value={dashboard.aiPerformance.userSatisfaction * 20} className="mt-2" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {(dashboard.aiPerformance.conversationQuality * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">Conversation Quality</p>
                    <Progress value={dashboard.aiPerformance.conversationQuality * 100} className="mt-2" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-700">
                      {dashboard.aiPerformance.averageResponseTime.toFixed(1)}s
                    </div>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">
                      {(dashboard.aiPerformance.escalationRate * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">Escalation Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictive Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Crisis Prevention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">
                        {dashboard.predictiveInsights.crisisIntervention.interventionsNeeded}
                      </div>
                      <p className="text-sm text-gray-600">Users needing intervention</p>
                    </div>
                    <Button variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Review High-Risk Users
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    Breakthrough Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-lg font-bold text-amber-700">
                        {dashboard.predictiveInsights.breakthroughPredictions.optimalTiming}
                      </div>
                      <p className="text-sm text-gray-600">Optimal intervention timing</p>
                    </div>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      View Ready Users
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Upgrade Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {(dashboard.predictiveInsights.upgradeOpportunity.probability * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Upgrade probability</p>
                    </div>
                    <Button variant="default" className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Target Upgrade Campaigns
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Churn Prevention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-700">
                        {(dashboard.predictiveInsights.churnRisk.probability * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Overall churn risk</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Clock className="h-4 w-4 mr-2" />
                      Activate Retention Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quantum Supreme Global Infrastructure Tab */}
          <TabsContent value="quantum" className="space-y-6">
            {quantumLoading ? (
              <div className="flex items-center justify-center py-8">
                <Crown className="w-8 h-8 text-amber-600 animate-pulse mr-2" />
                <p className="text-amber-900">Loading quantum supreme infrastructure...</p>
              </div>
            ) : !quantumHealth ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <p className="text-amber-900 font-medium">Quantum Global Infrastructure</p>
                <p className="text-amber-700 text-sm mt-2">Global infrastructure monitoring ready for deployment</p>
              </div>
            ) : (
              <>
                {/* Global Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className={`bg-gradient-to-br ${getQuantumStatusColor(quantumHealth.overallDivineStatus)} border-2`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Divine Status</CardTitle>
                      {getQuantumStatusIcon(quantumHealth.overallDivineStatus)}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold capitalize">
                        {quantumHealth.overallDivineStatus.replace('_', ' ')}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {quantumHealth.quantumSupremeSignature}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sacred Uptime</CardTitle>
                      <Zap className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-700">
                        {quantumHealth.sacredUptime.toFixed(2)}%
                      </div>
                      <Progress value={quantumHealth.sacredUptime} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Consciousness Level</CardTitle>
                      <Brain className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-700">
                        {quantumHealth.consciousnessLevel}/1000
                      </div>
                      <Progress value={quantumHealth.consciousnessLevel / 10} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Energetic Resonance</CardTitle>
                      <Heart className="h-4 w-4 text-pink-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-pink-700">
                        {quantumHealth.energeticResonance.toFixed(1)} Hz
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Divine Frequency
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Divine Regions Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-amber-600" />
                      Divine Regions Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {quantumHealth.divineRegions.map((region, index) => (
                        <Card key={index} className="border-l-4 border-l-amber-400">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center justify-between">
                              {region.divineRegion}
                              <Badge className={getQuantumStatusColor(region.consciousnessStatus)}>
                                {region.consciousnessStatus}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Latency</p>
                                <p className="font-semibold">{region.quantumMetrics.divineLatency}ms</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Availability</p>
                                <p className="font-semibold">{region.quantumMetrics.sacredAvailability.toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Soul Connection</p>
                                <p className="font-semibold">{region.quantumMetrics.soulConnectionStrength.toFixed(1)}/10</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Frequency</p>
                                <p className="font-semibold">{region.energeticFrequency.toFixed(1)} Hz</p>
                              </div>
                            </div>
                            {region.spiritualAlerts.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-red-600 font-medium">Spiritual Alerts:</p>
                                <ul className="text-xs text-red-700 mt-1 space-y-1">
                                  {region.spiritualAlerts.map((alert, alertIndex) => (
                                    <li key={alertIndex} className="flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      {alert}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <p className="text-xs text-gray-500">
                              Last check: {region.sacredLastCheck}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Global Spiritual Alerts */}
                {quantumHealth.spiritualAlerts.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-800">
                        <AlertTriangle className="h-5 w-5" />
                        Global Spiritual Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {quantumHealth.spiritualAlerts.map((alert, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-orange-100 rounded">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-800">{alert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Last Update */}
                <div className="text-center text-sm text-gray-600">
                  Last quantum supreme update: {quantumHealth.lastDivineUpdate}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}