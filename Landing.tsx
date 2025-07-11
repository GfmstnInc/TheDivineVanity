import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Sparkles, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray">
      {/* Header matching the app */}
      <header className="glass-effect border-b border-soft-gray">
        <div className="px-6 py-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 divine-gradient rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-playfair text-xl font-semibold text-deep-charcoal">
                The Divine Vanity
              </h1>
              <p className="text-sm text-gray-600">Luxury Spiritual Empowerment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome Message */}
          <div className="mb-12">
            <div className="inline-block border-b-2 border-divine-gold pb-2 mb-6">
              <span className="text-xs font-normal tracking-[0.3em] text-gray-700 uppercase">Spirit Strategist™</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-6xl font-semibold text-deep-charcoal mb-6 leading-tight">
              Transform Your Life Through
              <span className="block text-divine-gold italic">Divine Connection</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Experience sacred journaling, divine energy assessments, and premium spiritual content curated for the discerning modern woman seeking authentic empowerment.
            </p>
            <div className="w-24 h-px bg-divine-gold mx-auto mb-8"></div>
            <p className="text-lg text-divine-gold italic font-medium">
              "Sanctified. Empowered. Divine."
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              onClick={handleLogin}
              className="divine-gradient text-white px-8 py-4 text-base font-medium tracking-wide transition-all duration-300 hover:shadow-lg group"
            >
              Begin Your Sacred Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="border-divine-gold text-divine-gold hover:bg-divine-gold/10 px-8 py-4 text-base font-medium tracking-wide"
            >
              Discovery Session
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-divine-gold/20 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 divine-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-deep-charcoal mb-3">
                  Daily Divine Rituals
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Begin each morning with curated sacred practices designed to align your consciousness with divine purpose.
                </p>
              </CardContent>
            </Card>

            <Card className="border-divine-gold/20 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 divine-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-deep-charcoal mb-3">
                  Sacred Journaling
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Deepen self-awareness through guided reflection within our signature Vanity Mirror experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-divine-gold/20 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 divine-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-deep-charcoal mb-3">
                  Divine Energy Assessment
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover your energetic blueprint through personalized spiritual guidance tailored to your unique essence.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial */}
          <Card className="border-divine-gold/30 bg-gradient-to-r from-divine-gold/10 via-cream/50 to-divine-gold/10 mb-12">
            <CardContent className="p-8 text-center">
              <blockquote className="font-playfair text-2xl md:text-3xl font-medium text-deep-charcoal italic leading-relaxed mb-6">
                "Step into your divine feminine power and transform your life through sacred practices designed for the modern goddess"
              </blockquote>
              <cite className="text-lg text-divine-gold font-semibold not-italic tracking-wide">
                VANESSA RICH, SPIRIT STRATEGIST™
              </cite>
            </CardContent>
          </Card>

          {/* Final CTA */}
          <div className="text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Ready to embrace your divine feminine power and step into your most empowered, authentic self?
            </p>
            <Button 
              onClick={handleLogin}
              variant="ghost"
              className="text-divine-gold hover:bg-divine-gold/10 px-8 py-3 text-base font-medium tracking-wider border-b border-divine-gold/50"
            >
              Enter Your Sacred Space
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}