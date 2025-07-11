import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Upload, Mail, Users, Tag, Plus, Trash2, Edit, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface BulkEmailImport {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  tag: string;
  source: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBulkEmails() {
  const [adminKey, setAdminKey] = useState(() => 
    sessionStorage.getItem("divine-admin-key") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    sessionStorage.getItem("divine-admin-authenticated") === "true"
  );
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [csvData, setCsvData] = useState("");
  const [newEmail, setNewEmail] = useState({
    email: "",
    firstName: "",
    lastName: "",
    tag: "",
    source: "Manual",
    notes: ""
  });
  const [emailCampaign, setEmailCampaign] = useState({
    tag: "",
    subject: "",
    message: "",
    launchDate: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Available tags for filtering and campaigns
  const availableTags = ["Waitlist", "Premium", "Retreat Interest", "VIP", "Newsletter"];

  const { data: emailImports, isLoading } = useQuery({
    queryKey: ["/api/admin/bulk-emails", { key: adminKey, tag: selectedTag === "all" ? undefined : selectedTag }],
    enabled: isAuthenticated,
    retry: false,
  });

  // Create single email import
  const createEmailMutation = useMutation({
    mutationFn: (emailData: any) => 
      apiRequest(`/api/admin/bulk-emails?key=${adminKey}`, {
        method: "POST",
        body: JSON.stringify(emailData),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email added successfully!",
        variant: "default",
      });
      setNewEmail({
        email: "",
        firstName: "",
        lastName: "",
        tag: "",
        source: "Manual",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bulk-emails"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add email",
        variant: "destructive",
      });
    },
  });

  // Bulk create emails from CSV
  const bulkCreateMutation = useMutation({
    mutationFn: (emails: any[]) => 
      apiRequest(`/api/admin/bulk-emails/bulk-create?key=${adminKey}`, {
        method: "POST",
        body: JSON.stringify({ emails }),
      }),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully imported ${data.emailImports.length} emails!`,
        variant: "default",
      });
      setCsvData("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bulk-emails"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to import emails",
        variant: "destructive",
      });
    },
  });

  // Delete email import
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/bulk-emails/${id}?key=${adminKey}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email deleted successfully!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bulk-emails"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete email",
        variant: "destructive",
      });
    },
  });

  // Send campaign to tag
  const sendCampaignMutation = useMutation({
    mutationFn: (campaignData: any) => 
      apiRequest(`/api/admin/bulk-emails/send-by-tag?key=${adminKey}`, {
        method: "POST",
        body: JSON.stringify(campaignData),
      }),
    onSuccess: (data) => {
      toast({
        title: "Campaign Sent!",
        description: `${data.emailsSent} emails sent to ${data.tag} list`,
        variant: "default",
      });
      setEmailCampaign({
        tag: "",
        subject: "",
        message: "",
        launchDate: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send campaign",
        variant: "destructive",
      });
    },
  });

  const handleAuth = () => {
    if (adminKey === "divine-admin-2025") {
      setIsAuthenticated(true);
      sessionStorage.setItem("divine-admin-key", adminKey);
      sessionStorage.setItem("divine-admin-authenticated", "true");
      toast({
        title: "Authentication Successful",
        description: "Welcome to Bulk Email Management",
        variant: "default",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid admin key",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey("");
    sessionStorage.removeItem("divine-admin-key");
    sessionStorage.removeItem("divine-admin-authenticated");
  };

  const handleCreateEmail = () => {
    if (!newEmail.email || !newEmail.tag) {
      toast({
        title: "Validation Error",
        description: "Email and tag are required",
        variant: "destructive",
      });
      return;
    }
    createEmailMutation.mutate(newEmail);
  };

  const parseCsvData = () => {
    if (!csvData.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter CSV data",
        variant: "destructive",
      });
      return;
    }

    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const emails = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const emailObj: any = {};
        
        headers.forEach((header, index) => {
          if (header === 'email') emailObj.email = values[index];
          if (header === 'first_name' || header === 'firstname') emailObj.firstName = values[index];
          if (header === 'last_name' || header === 'lastname') emailObj.lastName = values[index];
          if (header === 'tag') emailObj.tag = values[index];
          if (header === 'source') emailObj.source = values[index];
          if (header === 'notes') emailObj.notes = values[index];
        });

        return emailObj;
      }).filter(email => email.email && email.tag);

      if (emails.length === 0) {
        toast({
          title: "Validation Error",
          description: "No valid emails found in CSV data",
          variant: "destructive",
        });
        return;
      }

      bulkCreateMutation.mutate(emails);
    } catch (error) {
      toast({
        title: "CSV Parse Error",
        description: "Failed to parse CSV data. Please check format.",
        variant: "destructive",
      });
    }
  };

  const handleSendCampaign = () => {
    if (!emailCampaign.tag || !emailCampaign.subject || !emailCampaign.message) {
      toast({
        title: "Validation Error",
        description: "Tag, subject, and message are required",
        variant: "destructive",
      });
      return;
    }
    sendCampaignMutation.mutate(emailCampaign);
  };

  const exportToCsv = () => {
    if (!emailImports?.emailImports) return;

    const headers = ['email', 'first_name', 'last_name', 'tag', 'source', 'notes', 'is_active', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...emailImports.emailImports.map((email: BulkEmailImport) => [
        email.email,
        email.firstName || '',
        email.lastName || '',
        email.tag,
        email.source,
        email.notes || '',
        email.isActive,
        email.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-emails-${selectedTag}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light text-amber-800">
              ✨ Admin Access Required
            </CardTitle>
            <CardDescription>
              Enter your admin key to access bulk email management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            />
            <Button onClick={handleAuth} className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white">
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-light text-amber-800 mb-2">
                ✨ Bulk Email Management
              </h1>
              <p className="text-amber-600">
                Manage email imports and send targeted campaigns
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
            >
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="import">Import Emails</TabsTrigger>
            <TabsTrigger value="campaigns">Send Campaigns</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
                  <Users className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-800">
                    {emailImports?.totalImports || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tags</CardTitle>
                  <Tag className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-800">
                    {availableTags.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Filter by Tag</CardTitle>
                  <Mail className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {availableTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Email List</CardTitle>
                  <CardDescription>
                    {selectedTag === "all" ? "All emails" : `Emails tagged: ${selectedTag}`}
                  </CardDescription>
                </div>
                <Button onClick={exportToCsv} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emailImports?.emailImports?.map((email: BulkEmailImport) => (
                      <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium">{email.email}</p>
                              <p className="text-sm text-gray-600">
                                {email.firstName} {email.lastName}
                              </p>
                            </div>
                            <Badge variant="secondary">{email.tag}</Badge>
                            <Badge variant={email.isActive ? "default" : "outline"}>
                              {email.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {email.notes && (
                            <p className="text-sm text-gray-500 mt-1">{email.notes}</p>
                          )}
                        </div>
                        <Button 
                          onClick={() => deleteMutation.mutate(email.id)}
                          variant="outline" 
                          size="sm"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Single Email
                  </CardTitle>
                  <CardDescription>
                    Manually add individual emails to your lists
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Email address"
                    value={newEmail.email}
                    onChange={(e) => setNewEmail({...newEmail, email: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="First name"
                      value={newEmail.firstName}
                      onChange={(e) => setNewEmail({...newEmail, firstName: e.target.value})}
                    />
                    <Input
                      placeholder="Last name"
                      value={newEmail.lastName}
                      onChange={(e) => setNewEmail({...newEmail, lastName: e.target.value})}
                    />
                  </div>
                  <Select value={newEmail.tag} onValueChange={(value) => setNewEmail({...newEmail, tag: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Source (e.g., Landing Page, Event)"
                    value={newEmail.source}
                    onChange={(e) => setNewEmail({...newEmail, source: e.target.value})}
                  />
                  <Textarea
                    placeholder="Notes (optional)"
                    value={newEmail.notes}
                    onChange={(e) => setNewEmail({...newEmail, notes: e.target.value})}
                  />
                  <Button 
                    onClick={handleCreateEmail}
                    disabled={createEmailMutation.isPending}
                    className="w-full"
                  >
                    {createEmailMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Bulk Import CSV
                  </CardTitle>
                  <CardDescription>
                    Import multiple emails from CSV data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">CSV Format:</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded">
{`email,first_name,last_name,tag,source,notes
jane@example.com,Jane,Doe,Waitlist,Landing Page,Interested in retreat
john@example.com,John,Smith,Premium,Event,VIP member`}
                    </pre>
                  </div>
                  <Textarea
                    placeholder="Paste CSV data here..."
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <Button 
                    onClick={parseCsvData}
                    disabled={bulkCreateMutation.isPending}
                    className="w-full"
                  >
                    {bulkCreateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Import CSV Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Send Targeted Campaign
                </CardTitle>
                <CardDescription>
                  Send personalized emails to specific tag groups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={emailCampaign.tag} onValueChange={(value) => setEmailCampaign({...emailCampaign, tag: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Email subject"
                  value={emailCampaign.subject}
                  onChange={(e) => setEmailCampaign({...emailCampaign, subject: e.target.value})}
                />
                <Input
                  placeholder="Launch date (optional)"
                  type="date"
                  value={emailCampaign.launchDate}
                  onChange={(e) => setEmailCampaign({...emailCampaign, launchDate: e.target.value})}
                />
                <Textarea
                  placeholder="Email message content..."
                  value={emailCampaign.message}
                  onChange={(e) => setEmailCampaign({...emailCampaign, message: e.target.value})}
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={handleSendCampaign}
                  disabled={sendCampaignMutation.isPending}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700"
                >
                  {sendCampaignMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Campaign
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Email Lists</CardTitle>
                <CardDescription>
                  Advanced management options for your email imports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Advanced management features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}