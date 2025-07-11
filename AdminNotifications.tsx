import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Send, Trash2, Calendar, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface NotificationSignup {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  featureType: string;
  createdAt: string;
}

interface NotificationData {
  totalSignups: number;
  signups: NotificationSignup[];
}

export default function AdminNotifications() {
  const [adminKey, setAdminKey] = useState(() => 
    sessionStorage.getItem("divine-admin-key") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    sessionStorage.getItem("divine-admin-authenticated") === "true"
  );
  const [signups, setSignups] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Email form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  
  const { toast } = useToast();

  // Auto-load data if already authenticated
  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchSignups();
    }
  }, [isAuthenticated, adminKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === "divine-admin-2025") {
      setIsAuthenticated(true);
      sessionStorage.setItem("divine-admin-key", adminKey);
      sessionStorage.setItem("divine-admin-authenticated", "true");
      await fetchSignups();
    } else {
      toast({
        title: "Access Denied",
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

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/notification-signups?key=${adminKey}&featureType=live_group_ceremonies`,
        { credentials: "include" }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSignups(data);
      } else {
        throw new Error("Failed to fetch signups");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notification signups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/admin/send-notifications?key=${adminKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          featureType: "live_group_ceremonies",
          subject,
          message,
          launchDate: launchDate || null,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Notifications Sent!",
          description: result.message,
        });
        
        // Clear form
        setSubject("");
        setMessage("");
        setLaunchDate("");
      } else {
        throw new Error("Failed to send notifications");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSignup = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/notification-signups/${id}?key=${adminKey}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchSignups(); // Refresh the list
        toast({
          title: "Signup Removed",
          description: "Notification signup has been deleted",
        });
      } else {
        throw new Error("Failed to delete signup");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete signup",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-gold/30 to-divine-gold/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-playfair text-deep-charcoal">
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="adminKey" className="text-sm font-medium text-gray-700">
                  Admin Key
                </Label>
                <Input
                  id="adminKey"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                  required
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-divine-gold to-soft-gold hover:from-soft-gold hover:to-divine-gold text-white"
              >
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gold/30 to-divine-gold/20">
      {/* Header */}
      <div className="bg-white border-b border-divine-gold/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-deep-charcoal hover:bg-divine-gold/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-playfair font-semibold text-deep-charcoal">
              Notification Management
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/bulk-emails">
              <Button variant="outline" size="sm" className="text-deep-charcoal hover:bg-divine-gold/10 border-divine-gold/30">
                📧 Bulk Email Management
              </Button>
            </Link>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="text-deep-charcoal hover:bg-red-50 border-red-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-divine-gold to-soft-gold rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Signups</p>
                  <p className="text-2xl font-bold text-deep-charcoal">
                    {loading ? "..." : signups?.totalSignups || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Feature Type</p>
                  <p className="text-lg font-semibold text-deep-charcoal">
                    Live Group Ceremonies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Send Notifications */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-charcoal">
              <Send className="h-5 w-5" />
              Send Launch Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNotifications} className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Email Subject *
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="🌟 Live Group Ceremonies Are Here!"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="launchDate" className="text-sm font-medium text-gray-700">
                  Launch Date (Optional)
                </Label>
                <Input
                  id="launchDate"
                  type="date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Email Message *
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your sacred journey continues! Live Group Ceremonies are now available..."
                  rows={6}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each line break will create a new paragraph in the email
                </p>
              </div>

              <Button
                type="submit"
                disabled={sending || !subject || !message}
                className="bg-gradient-to-r from-divine-gold to-soft-gold hover:from-soft-gold hover:to-divine-gold text-white"
              >
                {sending ? (
                  "Sending Notifications..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to All Signups ({signups?.totalSignups || 0})
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Signups List */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-charcoal">
              <Users className="h-5 w-5" />
              Notification Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading signups...</p>
            ) : signups?.signups.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No signups yet</p>
            ) : (
              <div className="space-y-3">
                {signups?.signups.map((signup) => (
                  <div
                    key={signup.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-divine-gold to-soft-gold rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-deep-charcoal">
                            {signup.firstName !== 'Not provided' ? 
                              `${signup.firstName} ${signup.lastName !== 'Not provided' ? signup.lastName : ''}`.trim() 
                              : 'Divine Soul'
                            }
                          </p>
                          <p className="text-sm text-gray-600">{signup.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(signup.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(signup.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSignup(signup.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}