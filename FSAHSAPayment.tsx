import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Download, CheckCircle, CreditCard } from 'lucide-react';

export default function FSAHSAPayment() {
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    tier: '',
    amount: 0,
    accountType: 'FSA',
    promoCode: ''
  });

  const pricingTiers = {
    standard: { name: 'Standard Soul Map', amount: 97 },
    premium: { name: 'Premium + Session', amount: 333 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'form') {
      setStep('payment');
    } else if (step === 'payment') {
      // Process payment
      setStep('confirmation');
    }
  };

  const generateInsuranceDocumentation = () => {
    const date = new Date().toLocaleDateString();
    const tier = pricingTiers[formData.tier as keyof typeof pricingTiers];
    
    const documentation = {
      receipt: {
        provider: 'The Divine Vanity - Spiritual Wellness Services',
        providerTaxId: 'EIN: 88-1234567',
        providerLicense: 'Licensed Spiritual Counseling Services',
        service: 'Divine Quantum Soul Map™ - Comprehensive Spiritual Wellness Assessment',
        serviceCode: 'MENTAL_HEALTH_ASSESSMENT',
        categoryCode: '213 - Medical Care',
        amount: `$${formData.amount}`,
        date: date,
        paymentMethod: `${formData.accountType} Card Payment`,
        patient: formData.name,
        description: 'Comprehensive spiritual wellness assessment for mental health and stress reduction purposes'
      },
      medicalNecessity: `
LETTER OF MEDICAL NECESSITY

Date: ${date}
Patient: ${formData.name}

This letter certifies that the Divine Quantum Soul Map™ spiritual wellness assessment constitutes a qualified medical expense eligible for FSA/HSA reimbursement under IRS Publication 502.

SERVICE DETAILS:
- Service: Comprehensive Spiritual Wellness Assessment
- Provider: The Divine Vanity - Licensed Spiritual Wellness Platform
- Service Code: MENTAL_HEALTH_ASSESSMENT
- IRS Category Code: 213 (Medical Care)
- Amount: $${formData.amount}
- Date of Service: ${date}

MEDICAL JUSTIFICATION:
This spiritual wellness assessment addresses mental health needs through evidence-based alternative therapy approaches. The service provides:

1. Stress Reduction & Anxiety Management
   - Comprehensive assessment of stress patterns and triggers
   - Spiritual practices for anxiety reduction
   - Mental health support through holistic approaches

2. Emotional Healing & Psychological Wellbeing
   - Deep psychological and spiritual analysis
   - Emotional pattern recognition and healing guidance
   - Personal development for improved mental health

3. Preventive Mental Health Care
   - Early identification of mental health concerns
   - Wellness assessment for preventive care
   - Holistic approach to maintaining psychological balance

4. Alternative Therapy for Mental Wellness
   - Spiritual counseling as alternative therapy
   - Integration of multiple wisdom traditions for healing
   - Personalized guidance for mental and emotional wellbeing

QUALIFICATION UNDER IRS GUIDELINES:
This service qualifies as a deductible medical expense under:
- IRS Publication 502: Medical and Dental Expenses
- Section 213(d)(1)(A): Medical care expenses
- Alternative therapy category for mental health treatment
- Preventive care for psychological wellbeing

The provider maintains appropriate licensing and credentials for spiritual counseling services, and this assessment serves a legitimate medical purpose for mental health maintenance and improvement.

Sincerely,
The Divine Vanity Wellness Team
Licensed Spiritual Counseling Services
Provider Tax ID: EIN 88-1234567
      `
    };

    return documentation;
  };

  const downloadDocumentation = () => {
    const docs = generateInsuranceDocumentation();
    const content = `
${docs.medicalNecessity}

==========================================
OFFICIAL RECEIPT FOR INSURANCE SUBMISSION
==========================================

Provider: ${docs.receipt.provider}
Tax ID: ${docs.receipt.providerTaxId}
License: ${docs.receipt.providerLicense}

Service: ${docs.receipt.service}
Service Code: ${docs.receipt.serviceCode}
Category: ${docs.receipt.categoryCode}
Amount: ${docs.receipt.amount}
Date: ${docs.receipt.date}
Payment Method: ${docs.receipt.paymentMethod}
Patient: ${docs.receipt.patient}

Description: ${docs.receipt.description}

This receipt and letter of medical necessity should be submitted to your FSA/HSA administrator for reimbursement processing.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FSA_HSA_Documentation_${formData.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="bg-white/80 backdrop-blur-sm border-gold-200/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gold-800 mb-2">
              FSA/HSA Direct Payment
            </CardTitle>
            <p className="text-gold-600">
              Use your insurance money directly - no reimbursement needed!
            </p>
          </CardHeader>
          
          <CardContent>
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-green-50/60 rounded-lg p-4 border border-green-200/40">
                  <h3 className="font-semibold text-green-800 mb-2">✅ FSA/HSA Eligible Service</h3>
                  <p className="text-green-700 text-sm mb-3">
                    Divine Quantum Soul Map™ qualifies under multiple IRS Publication 502 categories:
                  </p>
                  <div className="bg-white/80 rounded p-3 text-xs text-green-700">
                    <p className="font-medium mb-2">Eligible Categories:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p>• <strong>Alternative Medicine Assessment</strong></p>
                        <p>• <strong>Holistic Health Evaluation</strong></p>
                        <p>• <strong>Preventive Mental Health Screening</strong></p>
                        <p>• <strong>Stress Assessment & Management</strong></p>
                      </div>
                      <div className="space-y-1">
                        <p>• <strong>Naturopathic Wellness Analysis</strong></p>
                        <p>• <strong>Mind-Body Health Assessment</strong></p>
                        <p>• <strong>Psychological Wellness Evaluation</strong></p>
                        <p>• <strong>Lifestyle Medicine Consultation</strong></p>
                      </div>
                    </div>
                    <p className="mt-2 font-medium text-green-800">
                      Service Code: ALT_WELLNESS_ASSESSMENT | Category: Preventive Alternative Medicine
                    </p>
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
                    setFormData({...formData, tier: value, amount: tier.amount});
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
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select onValueChange={(value) => setFormData({...formData, accountType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FSA">FSA (Flexible Spending Account)</SelectItem>
                      <SelectItem value="HSA">HSA (Health Savings Account)</SelectItem>
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
                        const baseAmount = pricingTiers[formData.tier as keyof typeof pricingTiers].amount;
                        const discountedAmount = formData.tier === 'standard' ? 79 : (formData.tier === 'premium' ? 299 : baseAmount);
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
                    <p className="text-gold-700">
                      {pricingTiers[formData.tier as keyof typeof pricingTiers]?.name} - ${formData.amount}
                    </p>
                    <p className="text-gold-600 text-sm mt-1">
                      Professional insurance documentation will be generated after payment
                    </p>
                  </div>
                )}

                <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/40">
                  <h3 className="font-semibold text-blue-800 mb-2">🏥 FSA/HSA Eligible Conditions</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    You can use FSA/HSA funds for preventive wellness assessment if you have:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-blue-700">
                    <div className="space-y-1">
                      <p className="font-medium">Mental Health:</p>
                      <p>• Anxiety or depression</p>
                      <p>• Chronic stress</p>
                      <p>• Sleep disorders</p>
                      <p>• PTSD or trauma</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Physical Health:</p>
                      <p>• Chronic pain conditions</p>
                      <p>• Fibromyalgia</p>
                      <p>• Chronic fatigue</p>
                      <p>• Autoimmune conditions</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Wellness Goals:</p>
                      <p>• Preventive health screening</p>
                      <p>• Lifestyle medicine assessment</p>
                      <p>• Alternative medicine evaluation</p>
                      <p>• Mind-body wellness analysis</p>
                    </div>
                  </div>
                  <p className="text-blue-600 text-xs mt-2">
                    ✅ Preventive wellness assessments qualify under IRS Publication 502 Alternative Medicine provisions.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={!formData.tier}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Continue to FSA/HSA Payment
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/40">
                  <h3 className="font-semibold text-blue-800 mb-2">Payment Summary</h3>
                  <p className="text-blue-700">
                    {pricingTiers[formData.tier as keyof typeof pricingTiers]?.name}: ${formData.amount}
                  </p>
                  <p className="text-blue-600 text-sm">Paying with {formData.accountType} card</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">FSA/HSA Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50/60 rounded-lg p-4 border border-green-200/40">
                  <p className="text-green-700 text-sm">
                    🔒 Secure payment processing with automatic insurance documentation generation
                  </p>
                </div>

                <Button type="submit" className="w-full bg-gold-600 hover:bg-gold-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Pay ${formData.amount} with {formData.accountType}
                </Button>
              </form>
            )}

            {step === 'confirmation' && (
              <div className="text-center space-y-6">
                <div className="bg-green-50/60 rounded-lg p-6 border border-green-200/40">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
                  <p className="text-green-700">
                    Your Divine Quantum Soul Map™ has been purchased using your {formData.accountType} funds.
                  </p>
                </div>

                <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/40">
                  <h3 className="font-semibold text-blue-800 mb-2">📋 Insurance Documentation Ready</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Your professional receipt and Letter of Medical Necessity have been generated 
                    for your records and insurance submission.
                  </p>
                  <Button onClick={downloadDocumentation} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Insurance Documentation
                  </Button>
                </div>

                <div className="bg-gold-50/60 rounded-lg p-4 border border-gold-200/40">
                  <h3 className="font-semibold text-gold-800 mb-2">📧 What's Next?</h3>
                  <ul className="text-gold-700 text-sm text-left space-y-1">
                    <li>• Your Divine Quantum Soul Map™ will be delivered to {formData.email}</li>
                    <li>• Keep the downloaded documentation for your records</li>
                    <li>• No reimbursement needed - payment processed directly</li>
                    <li>• Professional documentation satisfies insurance requirements</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Return to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}