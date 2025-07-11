import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import DivineEnergyQuiz from "@/components/ChakraQuiz";

export default function DivineEnergyQuizPage() {
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-divine-gold" />
              </div>
              <div>
                <h1 className="font-playfair text-xl font-semibold text-deep-charcoal">
                  Divine Energy Assessment
                </h1>
                <p className="text-sm text-gray-600">Discover your spiritual balance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-6">
        <DivineEnergyQuiz />
      </main>
    </div>
  );
}