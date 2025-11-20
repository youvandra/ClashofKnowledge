/* eslint-env node */
import { config } from "dotenv";
import express, { Request, Response } from "express";

config();

const EVM_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY || "";
const SVM_PRIVATE_KEY = process.env.SVM_PRIVATE_KEY || "";
const SVM_RPC_URL = process.env.SVM_RPC_URL || "";
const HEDERA_PRIVATE_KEY = process.env.HEDERA_PRIVATE_KEY || "";
const HEDERA_ACCOUNT_ID = process.env.HEDERA_ACCOUNT_ID || "";

if (!EVM_PRIVATE_KEY && !SVM_PRIVATE_KEY && (!HEDERA_PRIVATE_KEY || !HEDERA_ACCOUNT_ID)) {
  console.error("Missing required environment variables");
  console.error(
    "Provide at least one of: EVM_PRIVATE_KEY, SVM_PRIVATE_KEY, or HEDERA_PRIVATE_KEY (with HEDERA_ACCOUNT_ID)",
  );
  process.exit(1);
}

// Validate Hedera configuration
if (HEDERA_PRIVATE_KEY && !HEDERA_ACCOUNT_ID) {
  console.error("HEDERA_ACCOUNT_ID is required when HEDERA_PRIVATE_KEY is provided");
  process.exit(1);
}


const FACILITATOR_UPSTREAM = process.env.FACILITATOR_UPSTREAM || "https://x402-hedera-production.up.railway.app";

const app = express();

// Configure express to parse JSON bodies
app.use(express.json());

type VerifyRequest = {
  paymentPayload: any;
  paymentRequirements: any;
};

type SettleRequest = {
  paymentPayload: any;
  paymentRequirements: any;
};

app.get("/verify", (req: Request, res: Response) => {
  res.json({
    endpoint: "/verify",
    description: "POST to verify x402 payments",
    body: {
      paymentPayload: "PaymentPayload",
      paymentRequirements: "PaymentRequirements",
    },
  });
});

app.post("/verify", async (req: Request, res: Response) => {
  try {
    const body: VerifyRequest = req.body;
    const upstream = FACILITATOR_UPSTREAM.replace(/\/$/, "");
    const r = await fetch(`${upstream}/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const out = await r.json();
    if (!r.ok) return res.status(r.status).json(out);
    res.json(out);
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Invalid request") });
  }
});

app.get("/settle", (req: Request, res: Response) => {
  res.json({
    endpoint: "/settle",
    description: "POST to settle x402 payments",
    body: {
      paymentPayload: "PaymentPayload",
      paymentRequirements: "PaymentRequirements",
    },
  });
});

app.get("/supported", async (req: Request, res: Response) => {
  const kinds: any[] = [];
  if (HEDERA_PRIVATE_KEY && HEDERA_ACCOUNT_ID) {
    kinds.push({ x402Version: 1, scheme: "exact", network: "hedera-testnet", extra: { feePayer: HEDERA_ACCOUNT_ID } });
    kinds.push({ x402Version: 1, scheme: "exact", network: "hedera-mainnet", extra: { feePayer: HEDERA_ACCOUNT_ID } });
  }
  res.json({ kinds });
});

app.post("/settle", async (req: Request, res: Response) => {
  try {
    const body: SettleRequest = req.body;
    const upstream = FACILITATOR_UPSTREAM.replace(/\/$/, "");
    const r = await fetch(`${upstream}/settle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const out = await r.json();
    if (!r.ok) return res.status(r.status).json(out);
    res.json(out);
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Invalid request") });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 3000}`);
});
