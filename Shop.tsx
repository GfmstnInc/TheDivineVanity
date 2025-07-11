import { ArrowLeft, Calendar, ShoppingCart, ExternalLink, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Shop() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const notificationMutation = useMutation({
    mutationFn: async (data: { email: string; firstName: string; featureType: string }) => {
      return await apiRequest("/api/notification-signup", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "You're all set!",
        description: "We'll notify you when Live Group Ceremonies launch.",
      });
      setEmail("");
      setFirstName("");
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Signup failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleExternalLink = (url: string, description: string) => {
    // Open real external links
    window.open(url, '_blank');
  };

  const handleNotificationSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    notificationMutation.mutate({
      email,
      firstName,
      featureType: "live_group_ceremonies"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray pb-20">
      {/* Header */}
      <header className="glass-effect border-b border-soft-gray sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-divine-gold" />
              </div>
              <div>
                <h1 className="font-playfair text-xl font-semibold text-deep-charcoal">
                  Divine Shop & Sessions
                </h1>
                <p className="text-sm text-gray-600">Sacred tools & guidance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-6 px-6">
        <div className="space-y-4 animate-fade-in">
          {/* Book 1:1 Session */}
          <a 
            href="sms:3109906254?&body=Hi%20Vanessa%2C%20I%20was%20recently%20on%20your%20app%20and%20I'm%20interested%20in%20my%20discovery%20session."
            className="block"
          >
            <Card className="divine-gradient text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer divine-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-playfair text-xl font-semibold mb-2">Book 1:1 Session</h3>
                    <p className="text-white/90 mb-4">Personal spiritual guidance & healing</p>
                    <div className="flex items-center text-sm text-white/80">
                      <Calendar className="w-4 h-4 mr-2" />
                      Text to book your discovery session
                    </div>
                  </div>
                  <div className="text-2xl">📲</div>
                </div>
              </CardContent>
            </Card>
          </a>

          {/* Sacred Tools Shop */}
          <Card
            className="bg-white border-2 border-divine-gold rounded-2xl shadow-lg hover:shadow-xl hover:bg-divine-gold/5 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer divine-shadow"
            onClick={() => handleExternalLink("https://tiktok.com/@shop", "TikTok Shop")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-deep-charcoal mb-2">
                    Sacred Tools Shop
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Crystals, candles, oracle cards & ritual essentials
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Curated sacred items for your practice
                  </div>
                </div>
                <ExternalLink className="w-6 h-6 text-divine-gold" />
              </div>
            </CardContent>
          </Card>

          {/* Full Collection */}
          <Card
            className="bg-white border-2 border-divine-gold rounded-2xl shadow-lg hover:shadow-xl hover:bg-divine-gold/5 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer divine-shadow"
            onClick={() => handleExternalLink("https://thedivinevanity.com", "The Divine Vanity website")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-deep-charcoal mb-2">
                    Full Collection
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Visit The Divine Vanity™ for complete spiritual luxury collection
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore all products & services
                  </div>
                </div>
                <ExternalLink className="w-6 h-6 text-divine-gold" />
              </div>
            </CardContent>
          </Card>

          {/* Group Ceremonies */}
          <Card className="bg-gradient-to-br from-soft-gold/20 to-divine-gold/10 border border-divine-gold/30 rounded-2xl shadow-lg divine-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 divine-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-playfair text-xl font-semibold text-deep-charcoal mb-2">
                  Live Group Ceremonies
                </h3>
                <p className="text-gray-600 mb-4">
                  Join our sacred circles for collective healing & manifestation
                </p>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-divine-gold text-divine-gold hover:bg-divine-gold hover:text-white transition-all"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-divine-gold font-semibold">
                        Get Notified: Live Group Ceremonies
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleNotificationSignup} className="space-y-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          First Name (Optional)
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Your first name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="mt-1"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Be the first to know when our Live Group Ceremonies become available. We'll send you exclusive early access.
                      </p>
                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!email || notificationMutation.isPending}
                          className="flex-1 bg-gradient-to-r from-divine-gold to-divine-gold/90 hover:from-divine-gold/90 hover:to-divine-gold/80 text-white"
                        >
                          {notificationMutation.isPending ? (
                            "Signing Up..."
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-2" />
                              Notify Me
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
