import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, CheckCircle, Globe } from 'lucide-react';

export default function PayPalPayment() {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tier: '',
    amount: 0,
    promoCode: ''
  });

  const pricingTiers = {
    standard: { name: 'Standard Soul Map', amount: 97 },
    premium: { name: 'Premium + Session', amount: 333 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'form') {
      // Determine PayPal link based on tier and promo code
      let paypalLink = '';
      
      if (formData.tier === 'standard') {
        paypalLink = 'https://www.paypal.com/ncp/payment/JFRHJ2HQBBVDE'; // $97 standard
      } else if (formData.tier === 'premium') {
        paypalLink = 'https://www.paypal.com/ncp/payment/7V883L5NN9FP4'; // $333 premium
      }
      
      // Open PayPal in new tab
      window.open(paypalLink, '_blank');
      setStep('confirmation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-pearl-100 to-gold-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cream-50/90 via-pearl-50/90 to-gold-50/80 border border-gold-300/50 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-serif text-gold-800 mb-4">
              Divine Quantum Soul Map™
            </CardTitle>
            <p className="text-gold-700 text-xl font-medium mb-4">
              Secure PayPal Payment Portal
            </p>
            <div className="max-w-md mx-auto px-6 py-4 bg-gradient-to-r from-gold-100/80 to-amber-100/80 rounded-xl border border-gold-200/60 shadow-lg">
              <p className="text-gold-800 font-medium">
                Safe, secure, and trusted worldwide payment processing
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gradient-to-br from-gold-50/80 to-amber-50/80 rounded-xl p-6 border border-gold-200/60 shadow-lg">
                  <h3 className="font-serif text-xl text-gold-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    PayPal Sacred Benefits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gold-700">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                        <strong>Buyer Protection</strong>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                        <strong>No Card Details Shared</strong>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                        <strong>Instant Processing</strong>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                        <strong>Global Payment Access</strong>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                        <strong>Multiple Payment Methods</strong>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                        <strong>Trusted by 400M+ Users</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tier">Select Service Tier</Label>
                  <Select onValueChange={(value) => {
                    const tier = pricingTiers[value as keyof typeof pricingTiers];
                    const baseAmount = tier.amount;
                    const finalAmount = formData.promoCode === 'SOULSEED' ? 
                      (value === 'standard' ? 79 : 299) : baseAmount;
                    setFormData({...formData, tier: value, amount: finalAmount});
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your Divine Quantum Soul Map™ tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Soul Map - $97</SelectItem>
                      <SelectItem value="premium">Premium + Session - $333</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                  <Input
                    id="promoCode"
                    placeholder="Enter promo"
                    value={formData.promoCode}
                    onChange={(e) => {
                      const code = e.target.value.toUpperCase();
                      setFormData({...formData, promoCode: code});
                      // Apply Soul Seed discount if valid code
                      if (code === 'SOULSEED' && formData.tier) {
                        const discountedAmount = formData.tier === 'standard' ? 79 : (formData.tier === 'premium' ? 299 : formData.amount);
                        setFormData(prev => ({...prev, promoCode: code, amount: discountedAmount}));
                      } else if (formData.tier) {
                        const baseAmount = pricingTiers[formData.tier as keyof typeof pricingTiers].amount;
                        setFormData(prev => ({...prev, promoCode: code, amount: baseAmount}));
                      }
                    }}
                  />
                  {formData.promoCode === 'SOULSEED' && (
                    <p className="text-green-600 text-sm mt-1">✅ Soul Seed discount applied!</p>
                  )}
                </div>

                {formData.amount > 0 && (
                  <div className="bg-gold-50/60 rounded-lg p-4 border border-gold-200/40">
                    <h3 className="font-semibold text-gold-800">Selected Service:</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-gold-700">
                        {pricingTiers[formData.tier as keyof typeof pricingTiers]?.name}
                      </p>
                      <div className="text-right">
                        {formData.promoCode === 'SOULSEED' && formData.tier === 'standard' && (
                          <p className="text-sm text-gray-500 line-through">$97</p>
                        )}
                        {formData.promoCode === 'SOULSEED' && formData.tier === 'premium' && (
                          <p className="text-sm text-gray-500 line-through">$333</p>
                        )}
                        <p className="text-xl font-bold text-gold-800">${formData.amount}</p>
                      </div>
                    </div>
                    {formData.promoCode === 'SOULSEED' && (
                      <p className="text-green-600 text-sm mt-2">
                        🌱 Soul Seed Price: Save ${(formData.tier === 'standard' ? 18 : 34)}!
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-gradient-to-br from-cream-50/80 to-pearl-50/80 rounded-xl p-6 border border-cream-200/60 shadow-lg">
                  <h3 className="font-serif text-xl text-cream-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔮</span>
                    What You'll Receive
                  </h3>
                  <div className="space-y-3 text-sm text-cream-700">
                    <div className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">✨</span>
                      <div>
                        <strong className="text-gold-800">Complete Divine Quantum Soul Map™</strong>
                        <p className="text-cream-600 text-xs mt-1">Comprehensive analysis from 5 sacred perspectives</p>
                      </div>
                    </div>
                    <div className="ml-6 space-y-2 text-xs text-cream-600">
                      <p>• Vanessa DI as your Healer</p>
                      <p>• Vanessa DI as your Therapist</p>
                      <p>• Vanessa DI as your Wise Aunt</p>
                      <p>• Vanessa DI as your Best Friend</p>
                      <p>• Vanessa DI channeling The Universe Itself</p>
                    </div>
                    {formData.tier === 'premium' && (
                      <div className="mt-4 pt-4 border-t border-cream-200/50">
                        <div className="flex items-start gap-3">
                          <span className="text-gold-500 mt-1">🎯</span>
                          <div>
                            <strong className="text-gold-800">PLUS: 45-Minute Personal Session</strong>
                            <p className="text-cream-600 text-xs mt-1">Direct guidance call with spiritual mentor</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-xl p-6 border border-emerald-200/60 shadow-lg">
                  <h3 className="font-serif text-xl text-emerald-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔒</span>
                    Secure PayPal Processing
                  </h3>
                  <div className="text-sm text-emerald-700 space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Your card details are never shared with us
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      PayPal's industry-leading fraud protection
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Instant confirmation and receipt delivery
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Option to pay with PayPal balance, card, or bank
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-16 bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:from-gold-600 hover:via-amber-600 hover:to-gold-700 text-white font-serif text-lg backdrop-blur-sm border border-gold-300/50 shadow-2xl rounded-xl" 
                  disabled={!formData.tier || !formData.name || !formData.email}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.4), 0 8px 32px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  <span className="truncate">
                    Secure Your Divine Soul Map™ - ${formData.amount}
                  </span>
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you'll be redirected to PayPal's secure checkout where you can complete your payment safely.
                </p>
              </form>
            )}

            {step === 'confirmation' && (
              <div className="text-center space-y-6">
                <div className="bg-green-50/60 rounded-lg p-6 border border-green-200/40">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Redirected to PayPal!</h3>
                  <p className="text-green-700">
                    You've been redirected to PayPal's secure checkout to complete your Divine Quantum Soul Map™ purchase.
                  </p>
                </div>

                <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/40">
                  <h3 className="font-semibold text-blue-800 mb-2">💳 Complete Your Payment</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    In the PayPal window, you can pay using:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-600">
                    <div>• PayPal Balance</div>
                    <div>• Debit/Credit Card</div>
                    <div>• Bank Account</div>
                    <div>• PayPal Credit</div>
                  </div>
                </div>

                <div className="bg-gold-50/60 rounded-lg p-4 border border-gold-200/40">
                  <h3 className="font-semibold text-gold-800 mb-2">📧 After Payment</h3>
                  <ul className="text-gold-700 text-sm text-left space-y-1">
                    <li>• Instant confirmation email to {formData.email}</li>
                    <li>• Divine Quantum Soul Map™ delivered within 24-48 hours</li>
                    <li>• PayPal receipt for your records</li>
                    {formData.tier === 'premium' && (
                      <li>• Booking link for your 45-minute personal session</li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setStep('form')}
                    className="flex-1 bg-gray-500 hover:bg-gray-600"
                  >
                    ← Back to Form
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}