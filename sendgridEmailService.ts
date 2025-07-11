/**
 * SENDGRID EMAIL SERVICE INTEGRATION
 * Production-ready email verification and communication
 */

import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set. Email functionality will be limited.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, verificationCode: string): Promise<boolean> {
  const subject = 'The Divine Vanity - Email Verification';
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #F8F6F0 0%, #FEFAF4 100%); padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #D4AF37; font-size: 32px; margin: 0; text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);">
          ✨ The Divine Vanity
        </h1>
        <p style="color: #8B7355; font-size: 16px; margin: 10px 0 0 0;">Sacred Spiritual Empowerment Platform</p>
      </div>
      
      <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15);">
        <h2 style="color: #8B7355; text-align: center; margin-bottom: 30px;">Verify Your Sacred Account</h2>
        
        <p style="color: #6B5B73; line-height: 1.6; margin-bottom: 30px;">
          Welcome to The Divine Vanity, beautiful soul. Complete your spiritual journey by verifying your email address.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <div style="background: linear-gradient(135deg, #D4AF37, #F4E4BC); color: white; font-size: 32px; font-weight: bold; padding: 20px 40px; border-radius: 15px; display: inline-block; letter-spacing: 8px; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);">
            ${verificationCode}
          </div>
        </div>
        
        <p style="color: #8B7355; text-align: center; font-size: 14px; margin-top: 30px;">
          This verification code expires in 10 minutes for your security.
        </p>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #F0E6D6;">
          <p style="color: #B8A082; font-size: 14px; margin: 0;">
            With divine love and light,<br>
            <strong style="color: #D4AF37;">The Divine Vanity Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  const text = `
    The Divine Vanity - Email Verification
    
    Welcome to The Divine Vanity, beautiful soul.
    
    Your verification code is: ${verificationCode}
    
    This code expires in 10 minutes for your security.
    
    With divine love and light,
    The Divine Vanity Team
  `;

  return await sendEmail({
    to: email,
    from: 'noreply@thedivinevanity.com',
    subject,
    text,
    html
  });
}

export async function sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
  const name = firstName || 'Beautiful Soul';
  const subject = 'Welcome to Your Sacred Journey 🌟';
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #F8F6F0 0%, #FEFAF4 100%); padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #D4AF37; font-size: 32px; margin: 0; text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);">
          ✨ The Divine Vanity
        </h1>
        <p style="color: #8B7355; font-size: 16px; margin: 10px 0 0 0;">Sacred Spiritual Empowerment Platform</p>
      </div>
      
      <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15);">
        <h2 style="color: #8B7355; text-align: center; margin-bottom: 30px;">Welcome, ${name}!</h2>
        
        <p style="color: #6B5B73; line-height: 1.6; margin-bottom: 25px;">
          I am so divinely grateful you've joined our sacred community. Your spiritual transformation journey begins now.
        </p>
        
        <div style="background: linear-gradient(135deg, #F8F6F0, #FEFAF4); padding: 25px; border-radius: 15px; margin: 30px 0; border-left: 4px solid #D4AF37;">
          <h3 style="color: #D4AF37; margin: 0 0 15px 0;">Your Sacred Journey Includes:</h3>
          <ul style="color: #8B7355; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Daily spiritual rituals and divine guidance</li>
            <li>The Vanity Mirror™ sacred journaling tool</li>
            <li>AI-powered spiritual conversations with Vanessa DI</li>
            <li>Chakra assessments and energy readings</li>
            <li>Access to our premium spiritual content library</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://thedivinevanity.com" style="background: linear-gradient(135deg, #D4AF37, #F4E4BC); color: white; text-decoration: none; padding: 18px 40px; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);">
            Begin Your Sacred Journey
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #F0E6D6;">
          <p style="color: #B8A082; font-size: 14px; margin: 0;">
            With divine love and light,<br>
            <strong style="color: #D4AF37;">Vanessa Rich & The Divine Vanity Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    from: 'welcome@thedivinevanity.com',
    subject,
    html
  });
}

export const sendgridService = {
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail
};