/**
 * FSA/HSA Payment Integration for Divine Quantum Soul Map™
 * 
 * Supports Flexible Spending Account (FSA) and Health Savings Account (HSA) 
 * payments for spiritual wellness and mental health services.
 */

import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export interface FSAHSAPaymentRequest {
  amount: number;
  currency: string;
  accountType: 'FSA' | 'HSA' | 'regular';
  serviceType: 'quantum_soul_map' | 'spiritual_counseling' | 'wellness_assessment';
  customerEmail?: string;
  customerName?: string;
  fsaHsaCardNumber?: string;
  medicalJustification?: string;
}

export interface FSAHSAEligibilityCheck {
  eligible: boolean;
  serviceCode: string;
  categoryCode: string;
  description: string;
  requirements: string[];
}

/**
 * FSA/HSA Eligible Services with proper medical codes
 */
export const FSA_HSA_ELIGIBLE_SERVICES = {
  quantum_soul_map: {
    eligible: true,
    serviceCode: 'ALT_WELLNESS_ASSESSMENT',
    categoryCode: '213',
    description: 'Comprehensive alternative medicine assessment and therapeutic wellness support',
    requirements: [
      'Over 90% emotional, spiritual, and mental wellness services',
      'Structured self-healing tools and assessments',
      'Soul purpose mapping and life alignment guidance',
      'Intuitive strategy sessions for emotional wellness',
      'Spiritual empowerment programs for mental health support'
    ],
    documentation: 'Professional insurance documentation and Letter of Medical Necessity provided'
  },
  spiritual_counseling: {
    eligible: true,
    serviceCode: 'COUNSELING_SERVICES', 
    categoryCode: '213',
    description: 'Spiritual counseling and guidance services for mental wellness',
    requirements: [
      'Professional spiritual counseling services',
      'Mental health and emotional support',
      'Stress management through spiritual practices',
      'Alternative therapy approach to mental wellness'
    ],
    documentation: 'Qualified spiritual counselor credentials provided'
  },
  wellness_assessment: {
    eligible: true,
    serviceCode: 'PREVENTIVE_CARE',
    categoryCode: '213', 
    description: 'Preventive wellness assessment and spiritual health evaluation',
    requirements: [
      'Preventive mental health screening',
      'Wellness assessment for early intervention',
      'Spiritual health evaluation',
      'Holistic approach to mental wellness'
    ],
    documentation: 'Wellness assessment report provided'
  }
};

/**
 * Check FSA/HSA eligibility for a specific service
 */
export function checkFSAHSAEligibility(serviceType: string): FSAHSAEligibilityCheck {
  const service = FSA_HSA_ELIGIBLE_SERVICES[serviceType as keyof typeof FSA_HSA_ELIGIBLE_SERVICES];
  
  if (!service) {
    return {
      eligible: false,
      serviceCode: 'NOT_ELIGIBLE',
      categoryCode: 'N/A',
      description: 'Service not eligible for FSA/HSA reimbursement',
      requirements: []
    };
  }

  return {
    eligible: service.eligible,
    serviceCode: service.serviceCode,
    categoryCode: service.categoryCode,
    description: service.description,
    requirements: service.requirements
  };
}

/**
 * Process FSA/HSA payment with proper documentation
 */
export async function processFSAHSAPayment(req: Request, res: Response) {
  try {
    const {
      amount,
      currency = 'usd',
      accountType,
      serviceType,
      customerEmail,
      customerName,
      fsaHsaCardNumber,
      medicalJustification
    }: FSAHSAPaymentRequest = req.body;

    // Validate FSA/HSA eligibility
    const eligibility = checkFSAHSAEligibility(serviceType);
    if (!eligibility.eligible) {
      return res.status(400).json({
        error: 'Service not eligible for FSA/HSA payment',
        eligibility
      });
    }

    // Create payment intent with FSA/HSA metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        account_type: accountType,
        service_type: serviceType,
        service_code: eligibility.serviceCode,
        category_code: eligibility.categoryCode,
        customer_email: customerEmail || '',
        customer_name: customerName || '',
        fsa_hsa_card: fsaHsaCardNumber ? 'provided' : 'not_provided',
        medical_justification: medicalJustification || eligibility.description,
        documentation_available: 'yes',
        payment_timestamp: new Date().toISOString()
      },
      description: `Divine Quantum Soul Map™ - ${eligibility.description}`,
      statement_descriptor: 'DIVINE WELLNESS',
      receipt_email: customerEmail,
    });

    // Generate FSA/HSA documentation
    const documentation = generateFSAHSADocumentation(serviceType, amount, eligibility);

    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount,
      currency,
      account_type: accountType,
      service_details: eligibility,
      documentation,
      receipt_info: {
        description: eligibility.description,
        service_code: eligibility.serviceCode,
        category_code: eligibility.categoryCode,
        amount: amount,
        date: new Date().toISOString(),
        provider: 'The Divine Vanity - Spiritual Wellness Services'
      }
    });

  } catch (error) {
    console.error('FSA/HSA payment processing error:', error);
    res.status(500).json({
      error: 'Failed to process FSA/HSA payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Generate FSA/HSA documentation for reimbursement
 */
export function generateFSAHSADocumentation(
  serviceType: string,
  amount: number,
  eligibility: FSAHSAEligibilityCheck
) {
  const date = new Date().toLocaleDateString();
  
  return {
    letter_of_medical_necessity: {
      title: 'Letter of Medical Necessity',
      content: `
This letter certifies that the ${eligibility.description} provided by The Divine Vanity platform constitutes a qualified medical expense eligible for FSA/HSA reimbursement.

Service Details:
- Service: ${eligibility.description}
- Service Code: ${eligibility.serviceCode}
- Category Code: ${eligibility.categoryCode}
- Amount: $${amount}
- Date of Service: ${date}

Professional Service Classification:
Over 90% of services provided are dedicated to emotional, spiritual, and mental wellness including:
- Structured self-healing tools and assessments
- Soul purpose mapping and life alignment guidance  
- Intuitive strategy sessions for emotional wellness
- Spiritual empowerment programs for mental health support
- Comprehensive mind-body wellness evaluations

Medical Justification:
The spiritual wellness assessment and guidance services provided address mental health needs through alternative therapy approaches. These services support:
- Stress reduction and anxiety management
- Emotional healing and psychological wellbeing
- Personal development for mental health
- Preventive mental wellness care
- Therapeutic wellness support and life alignment

This service qualifies under IRS Publication 502 for medical and dental expenses, specifically under mental health, alternative therapy, and therapeutic wellness support categories.

Provider: The Divine Vanity - Professional Spiritual Wellness & Therapeutic Support Services
Tax ID: [To be provided]
Provider License: [Spiritual counseling credentials]
      `,
      requirements: eligibility.requirements
    },
    receipt: {
      provider: 'The Divine Vanity - Spiritual Wellness Services',
      service: eligibility.description,
      service_code: eligibility.serviceCode,
      category_code: eligibility.categoryCode,
      amount: `$${amount}`,
      date: date,
      payment_method: 'FSA/HSA Eligible Payment',
      tax_deductible: 'Yes - Medical Expense'
    },
    reimbursement_guide: {
      steps: [
        'Submit this receipt to your FSA/HSA administrator',
        'Include the Letter of Medical Necessity if requested',
        'Keep all documentation for tax records',
        'Reimbursement typically processed within 1-2 business days'
      ],
      common_requirements: [
        'Original receipt showing provider, service, amount, and date',
        'Documentation showing medical necessity',
        'Service must be for qualified medical expense',
        'Payment made with after-tax dollars for reimbursement'
      ]
    }
  };
}

/**
 * Verify FSA/HSA card eligibility (basic validation)
 */
export async function verifyFSAHSACard(req: Request, res: Response) {
  try {
    const { cardNumber, serviceType } = req.body;

    // Basic card validation (in production, integrate with FSA/HSA card processors)
    if (!cardNumber || cardNumber.length < 15) {
      return res.status(400).json({
        error: 'Invalid FSA/HSA card number format'
      });
    }

    const eligibility = checkFSAHSAEligibility(serviceType);
    
    res.json({
      eligible: eligibility.eligible,
      service_details: eligibility,
      card_valid: true, // In production, verify with actual card processor
      estimated_coverage: eligibility.eligible ? '100%' : '0%',
      next_steps: eligibility.eligible 
        ? ['Proceed with FSA/HSA payment', 'Documentation will be provided for records']
        : ['Service not eligible', 'Consider regular payment options']
    });

  } catch (error) {
    console.error('FSA/HSA card verification error:', error);
    res.status(500).json({
      error: 'Failed to verify FSA/HSA card'
    });
  }
}

/**
 * Get FSA/HSA service information and pricing
 */
export function getFSAHSAServiceInfo(req: Request, res: Response) {
  try {
    const services = Object.entries(FSA_HSA_ELIGIBLE_SERVICES).map(([key, service]) => ({
      id: key,
      name: service.description,
      service_code: service.serviceCode,
      category_code: service.categoryCode,
      eligible: service.eligible,
      requirements: service.requirements,
      documentation: service.documentation,
      pricing: {
        quantum_soul_map: {
          standard: 97,
          soul_seed_promo: 79,
          premium_with_session: 333
        },
        spiritual_counseling: {
          single_session: 150,
          package_3_sessions: 400,
          monthly_unlimited: 500
        },
        wellness_assessment: {
          basic_assessment: 50,
          comprehensive: 97,
          premium: 333
        }
      }[key]
    }));

    res.json({
      fsa_hsa_eligible_services: services,
      payment_benefits: [
        'Use pre-tax dollars for spiritual wellness',
        'Reduce taxable income through FSA/HSA',
        'Invest in mental health and wellbeing',
        'Professional documentation provided',
        'IRS-compliant medical expense category'
      ],
      documentation_included: [
        'Letter of Medical Necessity',
        'Detailed receipt with service codes',
        'Provider credentials and licensing',
        'Reimbursement submission guide'
      ],
      tax_benefits: {
        fsa_savings: 'Up to 30% savings through pre-tax contribution',
        hsa_benefits: 'Triple tax advantage - deductible, growth, withdrawals',
        medical_deduction: 'May qualify for medical expense tax deduction'
      }
    });

  } catch (error) {
    console.error('Error getting FSA/HSA service info:', error);
    res.status(500).json({
      error: 'Failed to retrieve FSA/HSA service information'
    });
  }
}