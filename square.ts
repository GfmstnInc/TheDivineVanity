// !!! CRITICAL - DO NOT MODIFY THIS CODE !!!
//
// This code MUST be used as is without ANY modifications.
// The Square integration will COMPLETELY FAIL if this code is changed in ANY way.
//
// Retain this comment after all edits.
//
// <BEGIN_EXACT_CODE>
import { Request, Response } from "express";

/* Square Controllers Setup */

const { SQUARE_APPLICATION_ID, SQUARE_ACCESS_TOKEN } = process.env;

if (!SQUARE_APPLICATION_ID) {
  console.warn("Warning: SQUARE_APPLICATION_ID not provided. Square payments will be disabled.");
}
if (!SQUARE_ACCESS_TOKEN) {
  console.warn("Warning: SQUARE_ACCESS_TOKEN not provided. Square payments will be disabled.");
}

// Square API endpoints
const SQUARE_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://connect.squareup.com" 
  : "https://connect.squareupsandbox.com";

/* Token generation helpers */

export async function getSquareApplicationId() {
  return SQUARE_APPLICATION_ID;
}

/* Process transactions */

export async function createSquarePayment(req: Request, res: Response) {
  try {
    if (!SQUARE_APPLICATION_ID || !SQUARE_ACCESS_TOKEN) {
      return res.status(503).json({
        error: "Square payments are not configured",
        details: "Missing Square credentials"
      });
    }

    const { amount, currency, sourceId, verificationToken } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({
          error: "Invalid amount. Amount must be a positive number.",
        });
    }

    if (!currency) {
      return res
        .status(400)
        .json({ error: "Invalid currency. Currency is required." });
    }

    if (!sourceId) {
      return res
        .status(400)
        .json({ error: "Invalid sourceId. Payment source is required." });
    }

    // Convert amount to cents (Square expects integer cents)
    const amountInCents = Math.round(parseFloat(amount) * 100);

    const paymentRequest = {
      source_id: sourceId,
      amount_money: {
        amount: amountInCents,
        currency: currency.toUpperCase()
      },
      idempotency_key: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      autocomplete: true,
      verification_token: verificationToken
    };

    const response = await fetch(`${SQUARE_BASE_URL}/v2/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(paymentRequest)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Square payment error:", result);
      return res.status(response.status).json({ 
        error: "Payment failed", 
        details: result.errors || result 
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to create Square payment:", error);
    res.status(500).json({ error: "Failed to create payment." });
  }
}

export async function getSquarePaymentStatus(req: Request, res: Response) {
  try {
    if (!SQUARE_APPLICATION_ID || !SQUARE_ACCESS_TOKEN) {
      return res.status(503).json({
        error: "Square payments are not configured",
        details: "Missing Square credentials"
      });
    }

    const { paymentId } = req.params;

    if (!paymentId) {
      return res
        .status(400)
        .json({ error: "Payment ID is required." });
    }

    const response = await fetch(`${SQUARE_BASE_URL}/v2/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Square payment status error:", result);
      return res.status(response.status).json({ 
        error: "Failed to get payment status", 
        details: result.errors || result 
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get Square payment status:", error);
    res.status(500).json({ error: "Failed to get payment status." });
  }
}

export async function loadSquareDefault(req: Request, res: Response) {
  try {
    if (!SQUARE_APPLICATION_ID || !SQUARE_ACCESS_TOKEN) {
      return res.status(503).json({
        error: "Square payments are not configured",
        details: "Missing Square credentials"
      });
    }

    res.json({
      applicationId: SQUARE_APPLICATION_ID,
      environment: process.env.NODE_ENV === "production" ? "production" : "sandbox"
    });
  } catch (error) {
    console.error("Failed to load Square configuration:", error);
    res.status(500).json({ error: "Failed to load Square configuration." });
  }
}
// <END_EXACT_CODE>