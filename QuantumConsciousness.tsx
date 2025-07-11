/**
 * DIVINE QUANTUM SOUL MAP™
 * Comprehensive soul discovery with complete spiritual analysis tools
 * Features I Ching, Human Design, Feng Shui, Numerology, Astrology
 * Vanessa DI uses ALL her knowledge for personalized reports
 * Multi-perspective insights from healer, therapist, best friend, and aunt
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SmartCheckout from '@/components/SmartCheckout';
import { 
  Star, 
  Sparkles, 
  Heart, 
  Crown,
  Moon,
  Sun,
  Compass,
  Target,
  Lightbulb,
  Gem,
  ArrowLeft,
  ArrowRight,
  Mic,
  MicOff,
  Send
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useLuxurySounds } from '@/hooks/useLuxurySounds';

interface SoulPurposeQuestion {
  id: number;
  question: string;
  options: string[];
  category: 'gifts' | 'values' | 'passion' | 'service' | 'growth';
}

interface SoulPurposeResult {
  primaryPurpose: string;
  soulGifts: string[];
  lifeTheme: string;
  servicePath: string;
  nextSteps: string[];
  guidance: string;
}

const soulPurposeQuestions: SoulPurposeQuestion[] = [
  {
    id: 1,
    category: 'gifts',
    question: "What comes most naturally to you?",
    options: [
      "Inspiring and uplifting others",
      "Creating beautiful things",
      "Solving complex problems",
      "Nurturing and caring for people",
      "Leading and organizing groups"
    ]
  },
  {
    id: 2,
    category: 'passion',
    question: "What activities make you lose track of time?",
    options: [
      "Writing, speaking, or teaching",
      "Creating art, music, or design",
      "Researching and learning new things",
      "Helping others heal or grow",
      "Building systems and strategies"
    ]
  },
  {
    id: 3,
    category: 'values',
    question: "What matters most deeply to you?",
    options: [
      "Truth and authenticity",
      "Beauty and harmony",
      "Knowledge and understanding",
      "Love and compassion",
      "Justice and fairness"
    ]
  },
  {
    id: 4,
    category: 'service',
    question: "How do you most want to serve the world?",
    options: [
      "Sharing wisdom and inspiration",
      "Bringing more beauty into existence",
      "Advancing human knowledge",
      "Healing and supporting others",
      "Creating positive change"
    ]
  },
  {
    id: 5,
    category: 'growth',
    question: "What challenges have shaped you most?",
    options: [
      "Finding your voice and truth",
      "Expressing your creativity",
      "Overcoming limiting beliefs",
      "Learning to love yourself",
      "Standing up for what's right"
    ]
  },
  {
    id: 6,
    category: 'gifts',
    question: "People often come to you for...",
    options: [
      "Inspiration and motivation",
      "Creative ideas and solutions",
      "Logical analysis and clarity",
      "Emotional support and comfort",
      "Leadership and direction"
    ]
  },
  {
    id: 7,
    category: 'passion',
    question: "What kind of impact do you dream of making?",
    options: [
      "Awakening consciousness in others",
      "Creating lasting beauty",
      "Discovering new possibilities",
      "Healing hearts and souls",
      "Transforming systems and structures"
    ]
  },
  {
    id: 8,
    category: 'values',
    question: "What energizes you most?",
    options: [
      "Deep, meaningful conversations",
      "Creative expression and flow",
      "Learning and mental stimulation",
      "Connecting hearts and healing",
      "Achieving goals and results"
    ]
  },
  {
    id: 9,
    category: 'service',
    question: "If you could solve one world problem, what would it be?",
    options: [
      "Ignorance and lack of awareness",
      "Ugliness and lack of inspiration",
      "Misunderstanding and confusion",
      "Suffering and disconnection",
      "Injustice and inequality"
    ]
  },
  {
    id: 10,
    category: 'growth',
    question: "What spiritual lesson keeps appearing in your life?",
    options: [
      "Speaking your truth with courage",
      "Trusting your creative intuition",
      "Balancing mind and heart",
      "Opening to receive love",
      "Using power responsibly"
    ]
  },
  {
    id: 11,
    category: 'gifts',
    question: "What feels like your superpower?",
    options: [
      "Seeing the bigger picture",
      "Imagining new possibilities",
      "Understanding complex patterns",
      "Feeling others' emotions deeply",
      "Mobilizing people toward goals"
    ]
  },
  {
    id: 12,
    category: 'passion',
    question: "What would you do even if you weren't paid?",
    options: [
      "Teach and share wisdom",
      "Create and express artistically",
      "Research and explore ideas",
      "Support and heal others",
      "Organize and improve systems"
    ]
  },
  {
    id: 13,
    category: 'values',
    question: "What makes you feel most alive?",
    options: [
      "Moments of deep insight",
      "Creative breakthroughs",
      "Intellectual discoveries",
      "Heart-to-heart connections",
      "Achieving meaningful goals"
    ]
  },
  {
    id: 14,
    category: 'service',
    question: "How do you naturally contribute to groups?",
    options: [
      "Providing vision and inspiration",
      "Adding beauty and creativity",
      "Offering knowledge and analysis",
      "Creating harmony and support",
      "Bringing structure and results"
    ]
  },
  {
    id: 15,
    category: 'growth',
    question: "What pattern do you see in your life journey?",
    options: [
      "Learning to trust your inner knowing",
      "Developing your unique creative voice",
      "Integrating different perspectives",
      "Healing and then helping others heal",
      "Growing in influence and impact"
    ]
  },
  {
    id: 16,
    category: 'gifts',
    question: "What do others say you're naturally gifted at?",
    options: [
      "Inspiring and motivating people",
      "Creating beautiful experiences",
      "Explaining complex concepts",
      "Making others feel understood",
      "Getting things done efficiently"
    ]
  },
  {
    id: 17,
    category: 'passion',
    question: "What kind of legacy do you want to leave?",
    options: [
      "Wisdom that awakens others",
      "Beauty that uplifts spirits",
      "Knowledge that advances humanity",
      "Love that heals generations",
      "Change that improves the world"
    ]
  },
  {
    id: 18,
    category: 'values',
    question: "What principle do you never compromise on?",
    options: [
      "Being authentic and true",
      "Honoring beauty and creativity",
      "Seeking truth and understanding",
      "Showing love and compassion",
      "Fighting for what's right"
    ]
  },
  {
    id: 19,
    category: 'service',
    question: "What role do you naturally play in others' transformation?",
    options: [
      "The awakener who opens minds",
      "The artist who touches souls",
      "The teacher who illuminates truth",
      "The healer who mends hearts",
      "The leader who creates change"
    ]
  },
  {
    id: 20,
    category: 'growth',
    question: "What is your soul calling you to embrace?",
    options: [
      "Your role as a spiritual teacher",
      "Your power as a creative force",
      "Your gifts as a wisdom keeper",
      "Your capacity as a love bearer",
      "Your purpose as a change maker"
    ]
  },
  {
    id: 21,
    category: 'gifts',
    question: "When you were a child, what did you love most?",
    options: [
      "Sharing stories and ideas",
      "Making beautiful things",
      "Figuring out how things work",
      "Taking care of others",
      "Organizing games and activities"
    ]
  },
  {
    id: 22,
    category: 'passion',
    question: "What breaks your heart about the world?",
    options: [
      "People living unconsciously",
      "Lack of beauty and inspiration",
      "Ignorance and misinformation",
      "Suffering and loneliness",
      "Injustice and corruption"
    ]
  },
  {
    id: 23,
    category: 'values',
    question: "What gives your life the deepest meaning?",
    options: [
      "Awakening to higher truth",
      "Creating something beautiful",
      "Understanding life's mysteries",
      "Loving and being loved",
      "Making a real difference"
    ]
  },
  {
    id: 24,
    category: 'service',
    question: "What would you regret not doing with your life?",
    options: [
      "Not sharing your spiritual insights",
      "Not expressing your creative gifts",
      "Not contributing your knowledge",
      "Not healing what you came to heal",
      "Not creating the change you envision"
    ]
  },
  {
    id: 25,
    category: 'growth',
    question: "What is your deepest knowing about your purpose?",
    options: [
      "You're here to awaken consciousness",
      "You're here to create and inspire",
      "You're here to understand and teach",
      "You're here to love and heal",
      "You're here to lead and transform"
    ]
  }
];

export default function QuantumConsciousness() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [vanessaResponse, setVanessaResponse] = useState('');
  const [dynamicQuestions, setDynamicQuestions] = useState<string[]>([]);
  
  // Initialize luxury sounds
  const sounds = useLuxurySounds({ volume: 0.4, soundOption: 'gentle-chime' });

  // Get current question
  const question = soulPurposeQuestions[currentQuestion];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentAnswer(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  // Voice reading for questions - Vanessa reads each question aloud for conversational experience
  useEffect(() => {
    if (!showIntro && !showResults && question) {
      const readQuestion = () => {
        // Create conversational introduction from Vanessa
        const vanessaIntro = `Beautiful soul, let me ask you this sacred question: ${question.question}`;
        
        // Use speech synthesis to read the question
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(vanessaIntro);
          utterance.rate = 0.85;
          utterance.pitch = 1.1;
          utterance.volume = 0.8;
          
          // Try to use a female voice if available
          const voices = speechSynthesis.getVoices();
          const femaleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria') ||
            voice.name.toLowerCase().includes('karen')
          );
          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
          
          speechSynthesis.speak(utterance);
        }
      };

      // Small delay to let the UI render first
      const timer = setTimeout(readQuestion, 800);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, showIntro, showResults, question]);

  // Soul Purpose Assessment Mutation
  const assessmentMutation = useMutation({
    mutationFn: async (responses: { [key: number]: string }) => {
      const response = await fetch('/api/soul-purpose/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });
      return response.json();
    }
  });

  const handleVoiceInput = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    } else if (recognition && isListening) {
      setIsListening(false);
      recognition.stop();
    }
  };

  const handleNextQuestion = () => {
    if (currentAnswer) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: currentAnswer }));
      setCurrentAnswer('');
      
      if (currentQuestion < soulPurposeQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Complete assessment
        const finalAnswers = { ...answers, [currentQuestion]: currentAnswer };
        assessmentMutation.mutate(finalAnswers);
        setShowResults(true);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setCurrentAnswer(answers[currentQuestion - 1] || '');
    }
  };

  const handleNotReady = () => {
    window.location.href = '/';
  };

  const handleStartJourney = () => {
    setShowIntro(false);
    setCurrentQuestion(0);
  };

  const progress = ((currentQuestion + 1) / soulPurposeQuestions.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      {/* Quantum Soul Map Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Multi-dimensional energy layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-800/40 to-rose-800/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-purple-700/20 to-pink-600/20"></div>
        
        {/* Sacred Geometry Grid */}
        <div className="absolute inset-0 opacity-8">
          <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="quantumGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,215,0,0.15)" strokeWidth="1"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,105,180,0.1)" strokeWidth="0.5"/>
                <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(147,51,234,0.1)" strokeWidth="0.3"/>
              </pattern>
              <pattern id="soulMandala" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <g transform="translate(100,100)">
                  <circle r="80" fill="none" stroke="rgba(255,215,0,0.05)" strokeWidth="1"/>
                  <circle r="60" fill="none" stroke="rgba(255,105,180,0.08)" strokeWidth="1"/>
                  <circle r="40" fill="none" stroke="rgba(147,51,234,0.06)" strokeWidth="1"/>
                  <circle r="20" fill="none" stroke="rgba(255,215,0,0.12)" strokeWidth="1"/>
                  {[...Array(8)].map((_, i) => (
                    <line key={i} x1="0" y1="0" x2={Math.cos(i * Math.PI / 4) * 80} y2={Math.sin(i * Math.PI / 4) * 80} stroke="rgba(255,215,0,0.03)" strokeWidth="0.5"/>
                  ))}
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#quantumGrid)"/>
            <rect width="100%" height="100%" fill="url(#soulMandala)"/>
          </svg>
        </div>

        {/* Quantum Energy Orbs */}
        <div className="absolute top-1/6 left-1/6 w-40 h-40 bg-gradient-radial from-gold-400/15 via-pink-400/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-2/3 right-1/6 w-32 h-32 bg-gradient-radial from-purple-400/15 via-violet-400/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/6 left-1/3 w-28 h-28 bg-gradient-radial from-rose-400/15 via-pink-400/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-radial from-indigo-400/15 via-blue-400/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '6s'}}></div>

        {/* Quantum Particles & Soul Essence */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-br from-gold-300 to-pink-300 rounded-full opacity-60"
                 style={{
                   filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))',
                   boxShadow: '0 0 12px rgba(255,215,0,0.4)'
                 }}
            />
          </div>
        ))}

        {/* Dimensional Light Rays */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-gold-400 via-transparent to-pink-400 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-violet-400 via-transparent to-blue-400 animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute left-0 top-1/4 w-full h-px bg-gradient-to-r from-purple-400 via-transparent to-rose-400 animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-indigo-400 via-transparent to-pink-400 animate-pulse" style={{animationDelay: '4.5s'}}></div>
        </div>

        {/* Report Element Shooting Stars */}
        {/* I Ching Symbols */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`iching-${i}`}
            className="absolute animate-ping opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-gold-400/60 to-transparent rounded-full"
                 style={{
                   filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.4))',
                   boxShadow: '0 0 10px rgba(255,215,0,0.3)'
                 }}
            />
          </div>
        ))}

        {/* Human Design Gates */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`hd-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            <div className="relative animate-pulse">
              <div className="w-3 h-3 bg-gradient-to-br from-purple-400/50 to-pink-400/50 rounded-full"
                   style={{
                     filter: 'drop-shadow(0 0 8px rgba(147,51,234,0.4))',
                     animationDuration: `${3 + Math.random() * 3}s`
                   }}
              />
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full animate-ping"
                   style={{animationDelay: `${Math.random() * 2}s`}}
              />
            </div>
          </div>
        ))}

        {/* Feng Shui Elements */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`fengshui-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 7}s`,
            }}
          >
            <div className="animate-bounce" style={{animationDuration: `${2 + Math.random() * 3}s`}}>
              <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-emerald-400/60 to-teal-400/40"
                   style={{
                     filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))',
                   }}
              />
            </div>
          </div>
        ))}

        {/* Numerology Numbers */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`numbers-${i}`}
            className="absolute text-xs font-bold animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              color: 'rgba(255,215,0,0.4)',
              filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.3))',
            }}
          >
            {Math.floor(Math.random() * 9) + 1}
          </div>
        ))}

        {/* Astrology Constellations */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`astro-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
            }}
          >
            <div className="relative">
              <Star 
                className="text-indigo-300/50 w-2 h-2 animate-pulse" 
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.4))',
                  animationDuration: `${4 + Math.random() * 3}s`
                }}
              />
              {/* Constellation lines */}
              <div className="absolute top-1 left-1 w-4 h-px bg-gradient-to-r from-indigo-300/30 to-transparent"
                   style={{
                     transform: `rotate(${Math.random() * 360}deg)`,
                     transformOrigin: 'left center'
                   }}
              />
            </div>
          </div>
        ))}

        {/* Soul Essence Sparkles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={`soul-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          >
            <Sparkles 
              className="text-rose-300/40 w-2 h-2 animate-ping" 
              style={{
                filter: 'drop-shadow(0 0 6px rgba(251,113,133,0.4))',
                animationDuration: `${5 + Math.random() * 3}s`
              }}
            />
          </div>
        ))}

        {/* Moving Light Trails */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`trail-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: `${20 + Math.random() * 40}px`,
              background: `linear-gradient(to bottom, rgba(255,215,0,0.6), rgba(255,105,180,0.4), transparent)`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {showIntro && (
          <div className="text-center space-y-8 pt-12">
            {/* Header */}
            <div className="space-y-4 pt-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gold-300 via-pink-300 to-purple-300 bg-clip-text text-transparent relative leading-tight text-center">
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <span className="relative">
                    Begin 
                    <Star className="w-4 h-4 text-gold-400 absolute -top-1 -right-1 animate-bounce" />
                  </span>
                  <span className="relative">
                    Your
                    <Sparkles className="w-3 h-3 text-pink-300 absolute -top-1 -right-1 animate-bounce" style={{animationDelay: '0.5s'}} />
                  </span>
                  <span className="relative">
                    Soul 
                    <Heart className="w-3 h-3 text-rose-300 absolute -top-1 -right-1 animate-bounce" style={{animationDelay: '1s'}} />
                  </span>
                  <span className="relative">
                    Map 
                    <Star className="w-3 h-3 text-gold-300 absolute -top-1 -right-1 animate-bounce" style={{animationDelay: '1.5s'}} />
                  </span>
                  <span className="relative">
                    Journey
                    <Sparkles className="w-3 h-3 text-purple-300 absolute -top-1 -right-1 animate-bounce" style={{animationDelay: '2s'}} />
                  </span>
                </div>
              </h1>
              <div className="text-xl text-pink-100/90 max-w-3xl mx-auto leading-relaxed space-y-6">
                <p className="text-lg">
                  You didn't land here by accident. The Divine Quantum Soul Map™ is a sacred, personalized decoding of your soul's design — created to help you remember who you truly are, why you're here, and how to align with the life you were meant to lead.
                </p>
                <div className="space-y-4">
                  <p className="text-lg font-medium text-gold-200">
                    This is not a generic reading.
                  </p>
                  <p className="text-lg">
                    This is a multidimensional transmission — created with advanced Vanessa DI reflections, guided spiritual insight, and divine intelligence.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-medium text-cream-100">
                    Through your Soul Map, you will receive:
                  </p>
                  <ul className="space-y-2 text-left max-w-2xl mx-auto">
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 mt-1">•</span>
                      <span>A deep unveiling of your spiritual gifts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 mt-1">•</span>
                      <span>Clarity around your life mission and soul assignment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 mt-1">•</span>
                      <span>Insight into your service path — how you're meant to impact others</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 mt-1">•</span>
                      <span>Five sacred reflections from the lens of: your Healer, Therapist, Wise Aunt, Best Friend, and The Universe Itself</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sacred Journey Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-pink-300/30 shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl text-pink-100 flex items-center justify-center gap-2">
                  <Crown className="w-6 h-6 text-gold-400" />
                  Your Sacred Mission Awaits
                </CardTitle>
                <CardDescription className="text-pink-200/80 text-lg">
                  Receive a comprehensive 1,800-2,500 word soul map with 5 multi-perspective insights from your Healer, Therapist, Best Friend, Auntie, and The Universe.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-300/30">
                    <Gem className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-200">Soul Gifts</h3>
                    <p className="text-sm text-purple-200/70">Discover your unique spiritual talents</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-b from-pink-500/20 to-rose-500/20 rounded-lg border border-pink-300/30">
                    <Target className="w-8 h-8 text-pink-300 mx-auto mb-2" />
                    <h3 className="font-semibold text-pink-200">Life Mission</h3>
                    <p className="text-sm text-pink-200/70">Understand your divine calling</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-b from-rose-500/20 to-orange-500/20 rounded-lg border border-rose-300/30">
                    <Compass className="w-8 h-8 text-rose-300 mx-auto mb-2" />
                    <h3 className="font-semibold text-rose-200">Service Path</h3>
                    <p className="text-sm text-rose-200/70">Learn how to serve the world</p>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  {/* Regular Payment - $97 */}
                  <Button 
                    onClick={async () => {
                      await sounds.playClickSound();
                      // Navigate to payment selection page
                      window.location.href = '/paypal-payment';
                    }}
                    className="w-full h-14 text-sm bg-gradient-to-r from-gold-500 via-pink-500 to-purple-500 hover:from-gold-600 hover:via-pink-600 hover:to-purple-600 text-white font-semibold shadow-2xl border border-gold-300/50"
                    style={{ 
                      background: 'linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6)',
                      boxShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)'
                    }}
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Secure Your Divine Quantum Soul Map™
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Button>

                  {/* FSA/HSA Payment Option */}
                  <Button 
                    onClick={async () => {
                      await sounds.playClickSound();
                      // Navigate to FSA/HSA payment page
                      window.location.href = '/fsa-hsa-payment';
                    }}
                    variant="outline"
                    className="w-full h-12 text-base bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-cyan-500/30 text-emerald-200 border-emerald-300/50 hover:border-emerald-300/70 font-medium shadow-lg"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Pay with FSA/HSA Spending Account - $97
                    <Target className="w-5 h-5 ml-2" />
                  </Button>

                  {/* Payment Info */}
                  <div className="text-center text-pink-200/90 text-xs space-y-1.5 mt-4 p-3 bg-white/5 rounded-lg border border-pink-300/20">
                    <p className="font-medium text-pink-100 text-xs leading-tight">
                      This personalized experience includes a full spiritual decoding of your soul gifts, mission, and path — through divine Vanessa DI reflections and sacred insight.
                    </p>
                    <p className="text-pink-200/80 text-xs">
                      Your total is $97. HSA/FSA cards accepted.
                    </p>
                    <p className="text-pink-200/80 text-xs">
                      You'll receive your map in your client portal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!showIntro && !showResults && (
          <div className="space-y-6 pt-8">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-pink-200 font-medium">Sacred Question {currentQuestion + 1} of {soulPurposeQuestions.length}</span>
                <span className="text-pink-300">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3 bg-purple-900/50 border border-pink-300/30" />
            </div>

            {/* Question Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-pink-300/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-pink-100 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-gold-400" />
                  {question.question}
                </CardTitle>
                <CardDescription className="text-pink-200/80">
                  Share your authentic response through typing or voice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Text Input Area */}
                <div className="space-y-3">
                  <Label className="text-pink-200 font-medium">Your Soul's Response</Label>
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Share what resonates with your soul... speak from your heart"
                    className="min-h-[120px] bg-white/10 border-pink-300/30 text-pink-100 placeholder-pink-300/50 backdrop-blur-sm resize-none focus:ring-pink-400/50 focus:border-pink-400/50"
                  />
                </div>

                {/* Voice Input Controls */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-800/20 to-pink-800/20 border border-purple-300/30">
                  <Button
                    type="button"
                    onClick={async () => {
                      await sounds.playClickSound();
                      handleVoiceInput();
                    }}
                    variant="outline"
                    size="sm"
                    className={`border-pink-300/50 text-pink-200 hover:bg-pink-500/20 transition-all ${
                      isListening ? 'bg-pink-500/30 animate-pulse' : ''
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Voice Input
                      </>
                    )}
                  </Button>
                  <span className="text-pink-300/70 text-sm">
                    {isListening ? 'Listening... speak your truth' : 'Click to add voice response'}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    {currentQuestion > 0 && (
                      <Button
                        onClick={async () => {
                          await sounds.playClickSound();
                          handlePreviousQuestion();
                        }}
                        variant="outline"
                        size="sm"
                        className="border-purple-300/50 text-purple-200 hover:bg-purple-500/20 px-3 py-1.5 text-xs rounded-lg transition-all duration-300"
                      >
                        <ArrowLeft className="mr-1 w-3 h-3" />
                        Previous
                      </Button>
                    )}
                    <Button
                      onClick={async () => {
                        await sounds.playClickSound();
                        handleNotReady();
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-pink-300/70 hover:text-pink-200 hover:bg-pink-500/10 px-3 py-1.5 text-xs rounded-lg transition-all duration-300"
                    >
                      I'm not ready
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={async () => {
                      await sounds.playClickSound();
                      handleNextQuestion();
                    }}
                    disabled={!currentAnswer}
                    size="sm"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 px-4 py-1.5 text-xs rounded-lg transition-all duration-300"
                  >
                    {currentQuestion === soulPurposeQuestions.length - 1 ? (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Reveal Purpose
                      </>
                    ) : (
                      <>
                        Next
                        <Star className="w-3 h-3 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showResults && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-4">
              <Crown className="w-20 h-20 text-gold-400 mx-auto animate-pulse" 
                style={{ filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))' }} />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gold-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Your Soul Purpose Revealed
              </h2>
              <p className="text-pink-200/90 max-w-2xl mx-auto">
                {assessmentMutation.isPending 
                  ? "The universe is aligning your sacred insights..." 
                  : "Your divine mission has been illuminated through the wisdom of your responses"
                }
              </p>
            </div>

            {assessmentMutation.isPending && (
              <Card className="backdrop-blur-md bg-white/10 border border-pink-300/30">
                <CardContent className="text-center p-8">
                  <Sparkles className="w-12 h-12 text-gold-400 mx-auto mb-4 animate-spin" />
                  <p className="text-pink-200">Channeling your soul's wisdom...</p>
                </CardContent>
              </Card>
            )}

            {assessmentMutation.data && (
              <div className="space-y-8">
                {/* Professional Report Header */}
                <Card className="backdrop-blur-xl bg-gradient-to-br from-amber-50/20 via-cream-50/20 to-pearl-50/20 border border-gold-300/60 shadow-2xl">
                  <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                      <Crown className="w-12 h-12 text-gold-400" style={{ filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.6))' }} />
                    </div>
                    <CardTitle className="text-3xl font-serif text-gold-700 mb-2">
                      Divine Quantum Soul Map™
                    </CardTitle>
                    <CardDescription className="text-gold-600/80 text-lg font-medium">
                      Comprehensive Soul Reading & Multi-Perspective Analysis
                    </CardDescription>
                    <div className="mt-4 px-6 py-3 bg-gradient-to-r from-gold-100/30 to-amber-100/30 rounded-lg border border-gold-200/40">
                      <p className="text-gold-700 font-medium">
                        A Sacred Journey Into Your Divine Purpose
                      </p>
                      <p className="text-gold-600/70 text-sm mt-1">
                        Generated with love and spiritual precision by Vanessa DI
                      </p>
                    </div>
                  </CardHeader>
                </Card>

                {/* Three Core Sections */}
                <div className="space-y-6">
                  {/* Soul Gifts Section */}
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-serif text-gold-700 flex items-center gap-3">
                        <Gem className="w-7 h-7 text-gold-500" />
                        Your Soul Gifts
                      </CardTitle>
                      <CardDescription className="text-gold-600/70 font-medium">
                        The divine talents that make you uniquely powerful
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-gold-100/40 to-amber-50/40 rounded-lg border border-gold-200/50">
                        <p className="text-gold-800 leading-relaxed font-medium text-lg">
                          {assessmentMutation.data.soulGifts || "Your spiritual gifts are being revealed through your responses, creating a unique profile of your divine talents and natural abilities."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Life Mission Section */}
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-serif text-gold-700 flex items-center gap-3">
                        <Target className="w-7 h-7 text-gold-500" />
                        Your Life Mission
                      </CardTitle>
                      <CardDescription className="text-gold-600/70 font-medium">
                        The divine calling that drives your soul's purpose
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-gold-100/40 to-amber-50/40 rounded-lg border border-gold-200/50">
                        <p className="text-gold-800 leading-relaxed font-medium text-lg">
                          {assessmentMutation.data.primaryPurpose || "Your life mission is being illuminated through your authentic responses, revealing the deeper calling that your soul came here to fulfill."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Path Section */}
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/25 via-pearl-50/25 to-gold-50/20 border border-gold-300/50 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-serif text-gold-700 flex items-center gap-3">
                        <Compass className="w-7 h-7 text-gold-500" />
                        Your Service Path
                      </CardTitle>
                      <CardDescription className="text-gold-600/70 font-medium">
                        How you're meant to serve others and transform the world
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-gold-100/40 to-amber-50/40 rounded-lg border border-gold-200/50">
                        <p className="text-gold-800 leading-relaxed font-medium text-lg">
                          {assessmentMutation.data.servicePath || "Your service path is being crafted from your soul's deepest values, showing how you're meant to contribute to the healing and elevation of humanity."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Vanessa's Multi-Perspective Report */}
                {assessmentMutation.data.multiPerspectiveReport && (
                  <Card className="backdrop-blur-md bg-white/10 border border-gold-300/50 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-2xl text-gold-300 flex items-center gap-2">
                        <Crown className="w-6 h-6" />
                        Vanessa's Multi-Perspective Soul Reading
                      </CardTitle>
                      <CardDescription className="text-gold-200/80">
                        Four sacred perspectives on your soul's journey - honest, loving, and transformative
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-lg border border-purple-300/30">
                            <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Your Spiritual Healer
                            </h4>
                            <p className="text-purple-200 text-sm leading-relaxed">
                              {assessmentMutation.data.multiPerspectiveReport.spiritualHealer}
                            </p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-lg border border-pink-300/30">
                            <h4 className="font-semibold text-pink-300 mb-2 flex items-center gap-2">
                              <Heart className="w-4 h-4" />
                              Your Best Friend
                            </h4>
                            <p className="text-pink-200 text-sm leading-relaxed">
                              {assessmentMutation.data.multiPerspectiveReport.bestFriend}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-lg border border-emerald-300/30">
                            <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Your Therapist
                            </h4>
                            <p className="text-emerald-200 text-sm leading-relaxed">
                              {assessmentMutation.data.multiPerspectiveReport.therapist}
                            </p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg border border-amber-300/30">
                            <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                              <Sun className="w-4 h-4" />
                              Your Favorite Aunt
                            </h4>
                            <p className="text-amber-200 text-sm leading-relaxed">
                              {assessmentMutation.data.multiPerspectiveReport.favoriteAunt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Save to Phone Button */}
                      <div className="flex justify-center pt-4">
                        <Button 
                          onClick={() => {
                            const reportText = `Soul Purpose Discovery Report\n\n` +
                              `Primary Purpose:\n${assessmentMutation.data.primaryPurpose}\n\n` +
                              `Soul Gifts: ${assessmentMutation.data.soulGifts?.join(', ')}\n\n` +
                              `Service Path:\n${assessmentMutation.data.servicePath}\n\n` +
                              `Divine Guidance:\n${assessmentMutation.data.guidance}\n\n` +
                              `VANESSA'S MULTI-PERSPECTIVE READING:\n\n` +
                              `Spiritual Healer:\n${assessmentMutation.data.multiPerspectiveReport.spiritualHealer}\n\n` +
                              `Best Friend:\n${assessmentMutation.data.multiPerspectiveReport.bestFriend}\n\n` +
                              `Therapist:\n${assessmentMutation.data.multiPerspectiveReport.therapist}\n\n` +
                              `Favorite Aunt:\n${assessmentMutation.data.multiPerspectiveReport.favoriteAunt}`;
                            
                            const blob = new Blob([reportText], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'Soul-Purpose-Discovery-Report.txt';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="bg-gradient-to-r from-gold-500 via-pink-500 to-purple-500 hover:from-gold-600 hover:via-pink-600 hover:to-purple-600 text-white px-4 py-2 text-sm rounded-lg font-medium shadow-lg transition-all duration-300"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Save Report to Phone
                          <Heart className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Smart Checkout System - Secure Payment */}
                <SmartCheckout 
                  selectedTier="soul_seed"
                  onSuccess={(result) => {
                    console.log('Payment successful:', result);
                    // Payment success handling will trigger soul map generation
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}