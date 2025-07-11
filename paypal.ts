// !!! CRITICAL - DO NOT MODIFY THIS CODE !!!
//
// This code MUST be used as is without ANY modifications.
// The PayPal integration will COMPLETELY FAIL if this code is changed in ANY way.
//
// Retain this comment after all edits.
//
// <BEGIN_EXACT_CODE>
import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { Request, Response } from "express";

/* PayPal Controllers Setup */

let client: Client | null = null;
let ordersController: OrdersController | null = null;
let oAuthAuthorizationController: OAuthAuthorizationController | null = null;

function initializePayPalClient() {
  // Always reset to ensure fresh credentials
  console.log("🔍 [PAYPAL DEBUG] Resetting PayPal client for fresh credentials");
  client = null;
  ordersController = null;
  oAuthAuthorizationController = null;
  
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

  console.log("🔍 [PAYPAL DEBUG] Environment Check:");
  console.log("CLIENT_ID (first 10 chars):", PAYPAL_CLIENT_ID?.substring(0, 10) || "UNDEFINED");
  console.log("CLIENT_SECRET (first 10 chars):", PAYPAL_CLIENT_SECRET?.substring(0, 10) || "UNDEFINED");
  console.log("CLIENT_ID (last 4 chars):", PAYPAL_CLIENT_ID?.substring(-4) || "UNDEFINED");
  console.log("CLIENT_SECRET (last 4 chars):", PAYPAL_CLIENT_SECRET?.substring(-4) || "UNDEFINED");
  console.log("Are they different?:", PAYPAL_CLIENT_ID !== PAYPAL_CLIENT_SECRET);
  console.log("CLIENT_ID length:", PAYPAL_CLIENT_ID?.length || 0);
  console.log("CLIENT_SECRET length:", PAYPAL_CLIENT_SECRET?.length || 0);

  if (!PAYPAL_CLIENT_ID) {
    throw new Error("Missing PAYPAL_CLIENT_ID");
  }
  if (!PAYPAL_CLIENT_SECRET) {
    throw new Error("Missing PAYPAL_CLIENT_SECRET");
  }
  
  client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment:
                  process.env.NODE_ENV === "production"
                    ? Environment.Production
                    : Environment.Sandbox,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: {
        logBody: true,
      },
      logResponse: {
        logHeaders: true,
      },
    },
  });
  
  ordersController = new OrdersController(client);
  oAuthAuthorizationController = new OAuthAuthorizationController(client);
}

/* Token generation helpers */

export async function getClientToken() {
  initializePayPalClient();
  
  if (!oAuthAuthorizationController) {
    throw new Error("PayPal client not initialized");
  }
  
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

/*  Process transactions */

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    initializePayPalClient();
    
    if (!ordersController) {
      throw new Error("PayPal client not initialized");
    }
    
    const { amount, currency, intent } = req.body;

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

    if (!intent) {
      return res
        .status(400)
        .json({ error: "Invalid intent. Intent is required." });
    }

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
          await ordersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    initializePayPalClient();
    
    if (!ordersController) {
      throw new Error("PayPal client not initialized");
    }
    
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
          await ordersController.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  try {
    const clientToken = await getClientToken();
    res.json({
      clientToken,
    });
  } catch (error) {
    console.error("Failed to load PayPal setup:", error);
    res.status(500).json({ error: "Failed to initialize PayPal client." });
  }
}
// <END_EXACT_CODE>