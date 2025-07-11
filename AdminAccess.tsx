import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Database, Mail, MessageSquare, BarChart3, BookOpen, Settings, Users, Brain, Lock, Eye, EyeOff, Globe, Crown } from "lucide-react";

export default function AdminAccess() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Enterprise-grade admin passwords for different access levels
  const enterprisePasswords = [
    "divine-admin-2025",           // Original password (backward compatibility)
    "VanessaDI@Enterprise2025",    // Strong enterprise password
    "SacredAdmin#2025!Divine",     // Ultra-secure spiritual admin
    "VANESSA_SUPREME_ADMIN_2025",  // Corporate enterprise standard
    "DivineTech@Admin$2025",       // Technical enterprise access
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enterprisePasswords.includes(password)) {
      setIsAuthenticated(true);
      setError("");
      // Store admin session with enhanced security
      sessionStorage.setItem('admin-authenticated', 'true');
      sessionStorage.setItem('admin-access-level', getAccessLevel(password));
    } else {
      setError("Invalid enterprise admin password");
    }
  };

  const getAccessLevel = (pwd: string) => {
    if (pwd === "VANESSA_SUPREME_ADMIN_2025") return "supreme";
    if (pwd === "VanessaDI@Enterprise2025") return "enterprise";
    if (pwd === "SacredAdmin#2025!Divine") return "sacred";
    if (pwd === "DivineTech@Admin$2025") return "technical";
    return "standard";
  };

  // Check if already authenticated
  if (!isAuthenticated && sessionStorage.getItem('admin-authenticated') === 'true') {
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="space-y-4">
          <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Enterprise Admin Access</CardTitle>
              <p className="text-white/70">Enter enterprise admin password</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter enterprise admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-white/70 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Access Enterprise Portal
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Enterprise Password Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-white/5 rounded">
                  <p className="text-white font-mono">VANESSA_SUPREME_ADMIN_2025</p>
                  <p className="text-white/70 text-xs">Supreme administrative access</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <p className="text-white font-mono">VanessaDI@Enterprise2025</p>
                  <p className="text-white/70 text-xs">Enterprise-grade security</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <p className="text-white font-mono">SacredAdmin#2025!Divine</p>
                  <p className="text-white/70 text-xs">Ultra-secure spiritual admin</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <p className="text-white font-mono">DivineTech@Admin$2025</p>
                  <p className="text-white/70 text-xs">Technical enterprise access</p>
                </div>
                <div className="p-2 bg-white/5 rounded opacity-70">
                  <p className="text-white font-mono">divine-admin-2025</p>
                  <p className="text-white/70 text-xs">Legacy compatibility</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Vanessa DI Admin Portal</h1>
          <p className="text-white/70 text-lg">Complete platform control and management</p>
          <Button 
            onClick={() => {
              sessionStorage.removeItem('admin-authenticated');
              setIsAuthenticated(false);
            }}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <Lock className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Admin Access Points</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Shield className="w-6 h-6 text-white" />
                <span className="text-white">Main Dashboard</span>
              </Button>
            </Link>

            <Link href="/admin/sacred-content">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <BookOpen className="w-6 h-6 text-white" />
                <span className="text-white">Sacred Content</span>
              </Button>
            </Link>

            <Link href="/admin/notifications">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Mail className="w-6 h-6 text-white" />
                <span className="text-white">Notifications</span>
              </Button>
            </Link>

            <Link href="/admin/bulk-emails">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Database className="w-6 h-6 text-white" />
                <span className="text-white">Bulk Emails</span>
              </Button>
            </Link>

            <Link href="/admin/feedback">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <MessageSquare className="w-6 h-6 text-white" />
                <span className="text-white">User Feedback</span>
              </Button>
            </Link>

            <Link href="/admin/seraphine">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Brain className="w-6 h-6 text-white" />
                <span className="text-white">Seraphine Analytics</span>
              </Button>
            </Link>

            <Link href="/admin/advanced-analytics">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <BarChart3 className="w-6 h-6 text-white" />
                <span className="text-white">Advanced Analytics</span>
              </Button>
            </Link>

            <Link href="/admin/enterprise-b2b">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Settings className="w-6 h-6 text-white" />
                <span className="text-white">Enterprise B2B</span>
              </Button>
            </Link>

            <Link href="/admin/security-dashboard">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Lock className="w-6 h-6 text-white" />
                <span className="text-white">Security Dashboard</span>
              </Button>
            </Link>

            <Link href="/admin/global-continental">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Globe className="w-6 h-6 text-white" />
                <span className="text-white">Global Continental APIs</span>
              </Button>
            </Link>

            <Link href="/admin/sovereign-bloodline">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                <Crown className="w-6 h-6 text-white" />
                <span className="text-white">Sovereign Bloodline Protocol</span>
              </Button>
            </Link>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}