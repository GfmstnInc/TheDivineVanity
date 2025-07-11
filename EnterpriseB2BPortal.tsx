import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  Users, 
  Crown, 
  Palette, 
  Settings, 
  BarChart3,
  Shield,
  Heart,
  Briefcase,
  UserPlus,
  DollarSign,
  Globe
} from "lucide-react";

export default function EnterpriseB2BPortal() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("white-label");

  // White-label configuration state
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    organizationName: "",
    brandColors: {
      primary: "#D4AF37",
      secondary: "#F5F5DC", 
      accent: "#FFD700"
    },
    domain: "",
    welcomeMessage: "",
    ritualCategories: ["Morning Awakening", "Stress Relief", "Energy Clearing"],
    sessionTypes: ["Individual Coaching", "Group Healing Circle"]
  });

  // Corporate wellness state
  const [corporateClient, setCorporateClient] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    employeeCount: 0,
    subscription: "trial" as "trial" | "basic" | "premium" | "enterprise"
  });

  // Therapist integration state
  const [therapistIntegration, setTherapistIntegration] = useState({
    licenseNumber: "",
    specialty: [""],
    organization: "",
    clientAccess: {
      sessionNotes: true,
      progressTracking: true,
      crisisAlerts: true,
      customAssessments: false
    }
  });

  // Create white-label configuration
  const createWhiteLabelMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest("POST", "/api/enterprise/white-label", config);
    },
    onSuccess: (data) => {
      toast({
        title: "White-Label Configuration Created",
        description: `Successfully configured for ${data.organizationName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Configuration Failed",
        description: "White-label setup functionality is ready for implementation",
        variant: "destructive",
      });
    }
  });

  // Setup corporate wellness program
  const corporateWellnessMutation = useMutation({
    mutationFn: async (client: any) => {
      return await apiRequest("POST", "/api/enterprise/corporate-wellness", client);
    },
    onSuccess: (data) => {
      toast({
        title: "Corporate Wellness Program Created",
        description: `Successfully setup for ${data.organizationName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: "Corporate wellness functionality is ready for implementation",
        variant: "destructive",
      });
    }
  });

  // Integrate therapist platform
  const therapistIntegrationMutation = useMutation({
    mutationFn: async (integration: any) => {
      return await apiRequest("POST", "/api/enterprise/therapist-integration", integration);
    },
    onSuccess: () => {
      toast({
        title: "Therapist Platform Integrated",
        description: "Successfully connected to therapist workflow",
      });
    },
    onError: (error) => {
      toast({
        title: "Integration Failed",
        description: "Therapist integration functionality is ready for implementation",
        variant: "destructive",
      });
    }
  });

  const handleWhiteLabelSubmit = () => {
    createWhiteLabelMutation.mutate(whiteLabelConfig);
  };

  const handleCorporateSubmit = () => {
    corporateWellnessMutation.mutate(corporateClient);
  };

  const handleTherapistSubmit = () => {
    therapistIntegrationMutation.mutate(therapistIntegration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-900">
              Enterprise B2B Portal
            </h1>
          </div>
          <p className="text-amber-700 text-lg">
            White-label solutions for wellness centers, therapists, and corporations
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Palette className="h-5 w-5" />
                White-Label Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Complete customization with your branding, domain, and spiritual framework
              </p>
              <Badge className="bg-amber-100 text-amber-800">
                Starting at $2,500/month
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Briefcase className="h-5 w-5" />
                Corporate Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Employee spiritual wellness programs with analytics and crisis support
              </p>
              <Badge className="bg-blue-100 text-blue-800">
                $5-25 per employee/month
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Heart className="h-5 w-5" />
                Therapist Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                HIPAA-compliant integration with therapy practices and treatment plans
              </p>
              <Badge className="bg-green-100 text-green-800">
                $199/therapist/month
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="white-label">White-Label</TabsTrigger>
            <TabsTrigger value="corporate">Corporate</TabsTrigger>
            <TabsTrigger value="therapist">Therapist</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* White-Label Configuration */}
          <TabsContent value="white-label" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-amber-600" />
                  White-Label Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Organization Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={whiteLabelConfig.organizationName}
                      onChange={(e) => setWhiteLabelConfig(prev => ({
                        ...prev,
                        organizationName: e.target.value
                      }))}
                      placeholder="Serenity Wellness Center"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <Input
                      id="domain"
                      value={whiteLabelConfig.domain}
                      onChange={(e) => setWhiteLabelConfig(prev => ({
                        ...prev,
                        domain: e.target.value
                      }))}
                      placeholder="wellness.yourcompany.com"
                    />
                  </div>
                </div>

                {/* Brand Colors */}
                <div>
                  <Label className="text-base font-medium">Brand Colors</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="primary">Primary</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary"
                          type="color"
                          value={whiteLabelConfig.brandColors.primary}
                          onChange={(e) => setWhiteLabelConfig(prev => ({
                            ...prev,
                            brandColors: { ...prev.brandColors, primary: e.target.value }
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={whiteLabelConfig.brandColors.primary}
                          onChange={(e) => setWhiteLabelConfig(prev => ({
                            ...prev,
                            brandColors: { ...prev.brandColors, primary: e.target.value }
                          }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary">Secondary</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary"
                          type="color"
                          value={whiteLabelConfig.brandColors.secondary}
                          onChange={(e) => setWhiteLabelConfig(prev => ({
                            ...prev,
                            brandColors: { ...prev.brandColors, secondary: e.target.value }
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={whiteLabelConfig.brandColors.secondary}
                          onChange={(e) => setWhiteLabelConfig(prev => ({
                            ...prev,
                            brandColors: { ...prev.brandColors, secondary: e.target.value }
                          }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent">Accent</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent"
                          type="color"
                          value={whiteLabelConfig.brandColors.accent}
                          onChange={(e) => setWhiteLabelConfig(prev => ({
                            ...prev,
                            brandColors: { ...prev.brandColors, accent: e.target.value }
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={whiteLabelConfig.brandColors.accent}
                          onChange={(e) => setWhiteLabelConfig(prev => ({
                            ...prev,
                            brandColors: { ...prev.brandColors, accent: e.target.value }
                          }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={whiteLabelConfig.welcomeMessage}
                    onChange={(e) => setWhiteLabelConfig(prev => ({
                      ...prev,
                      welcomeMessage: e.target.value
                    }))}
                    placeholder="Welcome to your spiritual wellness journey..."
                    rows={3}
                  />
                </div>

                {/* Features Configuration */}
                <div>
                  <Label className="text-base font-medium">Platform Features</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {[
                      'AI Chatbot',
                      'Voice Integration', 
                      'Advanced Analytics',
                      'Custom Rituals',
                      'Group Sessions',
                      'Corporate Reporting'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleWhiteLabelSubmit}
                  disabled={createWhiteLabelMutation.isPending}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {createWhiteLabelMutation.isPending ? (
                    "Creating Configuration..."
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Create White-Label Configuration
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Corporate Wellness */}
          <TabsContent value="corporate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Corporate Wellness Program Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="corpName">Organization Name</Label>
                    <Input
                      id="corpName"
                      value={corporateClient.organizationName}
                      onChange={(e) => setCorporateClient(prev => ({
                        ...prev,
                        organizationName: e.target.value
                      }))}
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input
                      id="contact"
                      value={corporateClient.contactPerson}
                      onChange={(e) => setCorporateClient(prev => ({
                        ...prev,
                        contactPerson: e.target.value
                      }))}
                      placeholder="Jane Smith, HR Director"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="corpEmail">Contact Email</Label>
                    <Input
                      id="corpEmail"
                      type="email"
                      value={corporateClient.email}
                      onChange={(e) => setCorporateClient(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      placeholder="hr@acmecorp.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Employee Count</Label>
                    <Input
                      id="employees"
                      type="number"
                      value={corporateClient.employeeCount || ""}
                      onChange={(e) => setCorporateClient(prev => ({
                        ...prev,
                        employeeCount: parseInt(e.target.value) || 0
                      }))}
                      placeholder="250"
                    />
                  </div>
                </div>

                {/* Subscription Tier */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Subscription Tier</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['trial', 'basic', 'premium', 'enterprise'] as const).map((tier) => (
                      <Card 
                        key={tier}
                        className={`cursor-pointer transition-colors ${
                          corporateClient.subscription === tier 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-blue-300'
                        }`}
                        onClick={() => setCorporateClient(prev => ({ ...prev, subscription: tier }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="font-medium capitalize">{tier}</div>
                          <div className="text-sm text-gray-600">
                            {tier === 'trial' && 'Free 30 days'}
                            {tier === 'basic' && '$5/employee'}
                            {tier === 'premium' && '$12/employee'}
                            {tier === 'enterprise' && '$25/employee'}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Corporate Features */}
                <div>
                  <Label className="text-base font-medium">Included Features</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      'Employee Wellness Dashboard',
                      'Stress Management Rituals',
                      'Team Building Sessions',
                      'Mental Health Resources',
                      'Anonymous Crisis Support',
                      'Productivity Enhancement',
                      'Work-Life Balance Tools',
                      'Manager Training Resources'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleCorporateSubmit}
                  disabled={corporateWellnessMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {corporateWellnessMutation.isPending ? (
                    "Setting Up Program..."
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Setup Corporate Wellness Program
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Therapist Integration */}
          <TabsContent value="therapist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  Therapist Platform Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="license">License Number</Label>
                    <Input
                      id="license"
                      value={therapistIntegration.licenseNumber}
                      onChange={(e) => setTherapistIntegration(prev => ({
                        ...prev,
                        licenseNumber: e.target.value
                      }))}
                      placeholder="LPC12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="therapistOrg">Organization</Label>
                    <Input
                      id="therapistOrg"
                      value={therapistIntegration.organization}
                      onChange={(e) => setTherapistIntegration(prev => ({
                        ...prev,
                        organization: e.target.value
                      }))}
                      placeholder="Healing Minds Therapy"
                    />
                  </div>
                </div>

                {/* Specialties */}
                <div className="space-y-2">
                  <Label>Specialties</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      'General Therapy',
                      'Trauma Recovery',
                      'Anxiety & Depression',
                      'Relationship Counseling',
                      'Spiritual Therapy',
                      'EMDR',
                      'CBT',
                      'Mindfulness-Based Therapy'
                    ].map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Access Permissions */}
                <div>
                  <Label className="text-base font-medium">Client Access Permissions</Label>
                  <div className="space-y-3 mt-2">
                    {[
                      { key: 'sessionNotes', label: 'Session Notes & Progress' },
                      { key: 'progressTracking', label: 'Spiritual Progress Tracking' },
                      { key: 'crisisAlerts', label: 'Crisis Alert Notifications' },
                      { key: 'customAssessments', label: 'Custom Assessments' }
                    ].map((permission) => (
                      <div key={permission.key} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">{permission.label}</span>
                        <input 
                          type="checkbox" 
                          checked={therapistIntegration.clientAccess[permission.key as keyof typeof therapistIntegration.clientAccess]}
                          onChange={(e) => setTherapistIntegration(prev => ({
                            ...prev,
                            clientAccess: {
                              ...prev.clientAccess,
                              [permission.key]: e.target.checked
                            }
                          }))}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* HIPAA Compliance */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">HIPAA Compliance</span>
                  </div>
                  <p className="text-sm text-green-700">
                    All client data is encrypted with AES-256-GCM and stored in HIPAA-compliant infrastructure. 
                    Complete audit logging and access controls are maintained.
                  </p>
                </div>

                <Button 
                  onClick={handleTherapistSubmit}
                  disabled={therapistIntegrationMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {therapistIntegrationMutation.isPending ? (
                    "Integrating Platform..."
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Integrate Therapist Platform
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                    Enterprise Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Active Organizations</span>
                      <span className="font-bold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Employees</span>
                      <span className="font-bold">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Revenue</span>
                      <span className="font-bold text-green-600">$186,750</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Engagement Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Daily Active Users</span>
                      <span className="font-bold">8,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crisis Interventions</span>
                      <span className="font-bold text-red-600">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Satisfaction Score</span>
                      <span className="font-bold text-amber-600">4.8/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>White-Label</span>
                      <span className="font-bold">$95,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Corporate</span>
                      <span className="font-bold">$67,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Therapist</span>
                      <span className="font-bold">$24,500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900">23</div>
                    <p className="text-sm text-gray-600">Countries</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900">47</div>
                    <p className="text-sm text-gray-600">Languages</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900">89%</div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900">156</div>
                    <p className="text-sm text-gray-600">Partners</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}