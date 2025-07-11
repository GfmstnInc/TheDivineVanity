import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnterprisePasswordInput } from "@/components/ui/enterprise-password-input";
import { User, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import UserSetup from "@/components/UserSetup";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await apiRequest("/api/login", "POST", credentials);
    },
    onSuccess: () => {
      toast({
        title: "Welcome Back",
        description: "You have successfully logged in.",
      });
      onLoginSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    if (!formData.username || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password.",
        variant: "destructive"
      });
      return;
    }

    loginMutation.mutate(formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (isNewUser) {
    return <UserSetup onSetupComplete={onLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-cream via-divine-white to-soft-gold flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-soft-gray divine-shadow">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-divine-gold to-soft-gold rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-playfair text-deep-charcoal mb-2">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600">
              Sign in to continue your divine journey
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your username"
                  className="pl-10"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enterprise Password</label>
              <EnterprisePasswordInput
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your enterprise password"
                disabled={loginMutation.isPending}
                showStrengthIndicator={false}
                autoComplete="current-password"
                className="border-divine-gold/30 focus:border-divine-gold"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="w-full bg-divine-gold hover:bg-divine-gold/90"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">New to The Divine Vanity?</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsNewUser(true)}
              className="w-full"
              disabled={loginMutation.isPending}
            >
              Create Your Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}