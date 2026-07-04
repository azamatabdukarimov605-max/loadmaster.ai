import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * CLICK MERCHANT API WEBHOOK
 * ---------------------------
 * Docs: https://docs.click.uz/en/click-api-request-2/
 *
 * Click calls this endpoint twice per successful payment:
 *   1. action=0 (Prepare) — Click checks the order is valid.
 *   2. action=1 (Complete) — Click confirms the money has been captured.
 *
 * SETUP REQUIRED before this goes live:
 *   1. Get your MERCHANT_ID, SERVICE_ID, and SECRET_KEY from
 *      https://my.click.uz (Click Merchant Cabinet → your service).
 *   2. Add them as environment variables in Vercel:
 *      CLICK_SERVICE_ID, CLICK_SECRET_KEY
 *   3. Set this route's URL as the "Complete URL" / webhook URL in the
 *      Click merchant cabinet: https://yourdomain.com/api/click
 *   4. When a user clicks "Upgrade to Pro", redirect them to Click's
 *      checkout URL with merchant_trans_id = the user's Supabase user id,
 *      so this webhook knows which account to upgrade.
 */

const PRO_PRICE_SOM = 390_000; // Example: ~$29 in UZS, adjust to your rate.

function verifySignature(params: Record<string, string>): boolean {
  const secret = process.env.CLICK_SECRET_KEY;
  if (!secret) return false;

  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    amount,
    action,
    sign_time,
    sign_string,
    merchant_prepare_id,
  } = params;

  // Click's signature formula differs slightly between Prepare and Complete.
  // Prepare:  md5(click_trans_id + service_id + secret + merchant_trans_id + amount + action + sign_time)
  // Complete: md5(click_trans_id + service_id + secret + merchant_trans_id + merchant_prepare_id + amount + action + sign_time)
  const base =
    action === "0"
      ? `${click_trans_id}${service_id}${secret}${merchant_trans_id}${amount}${action}${sign_time}`
      : `${click_trans_id}${service_id}${secret}${merchant_trans_id}${merchant_prepare_id}${amount}${action}${sign_time}`;

  const expected = crypto.createHash("md5").update(base).digest("hex");
  return expected === sign_string;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const params: Record<string, string> = {};
  form.forEach((value, key) => (params[key] = String(value)));

  const {
    click_trans_id,
    merchant_trans_id, // this is the Supabase user id we passed at checkout
    amount,
    action,
  } = params;

  if (!verifySignature(params)) {
    return NextResponse.json({
      click_trans_id,
      merchant_trans_id,
      error: -1,
      error_note: "SIGN CHECK FAILED",
    });
  }

  if (Number(amount) < PRO_PRICE_SOM) {
    return NextResponse.json({
      click_trans_id,
      merchant_trans_id,
      error: -2,
      error_note: "Incorrect amount",
    });
  }

  const admin = createAdminClient();

  if (action === "0") {
    // PREPARE: just acknowledge — don't upgrade the plan yet.
    return NextResponse.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: merchant_trans_id,
      error: 0,
      error_note: "Success",
    });
  }

  if (action === "1") {
    // COMPLETE: payment captured — upgrade the user and log the payment.
    const { error: upgradeError } = await admin
      .from("profiles")
      .update({ plan: "pro" })
      .eq("id", merchant_trans_id);

    await admin.from("payments").insert({
      user_id: merchant_trans_id,
      provider: "click",
      provider_transaction_id: click_trans_id,
      amount: Number(amount),
      status: upgradeError ? "failed" : "paid",
      raw_payload: params,
    });

    if (upgradeError) {
      return NextResponse.json({
        click_trans_id,
        merchant_trans_id,
        error: -1,
        error_note: "Failed to upgrade user",
      });
    }

    return NextResponse.json({
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: merchant_trans_id,
      error: 0,
      error_note: "Success",
    });
  }

  return NextResponse.json({
    click_trans_id,
    merchant_trans_id,
    error: -3,
    error_note: "Unknown action",
  });
}
