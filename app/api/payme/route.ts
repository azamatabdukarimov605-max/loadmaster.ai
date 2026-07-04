import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * PAYME MERCHANT API WEBHOOK
 * ---------------------------
 * Docs: https://developer.help.paycom.uz/
 *
 * Payme calls this single endpoint with JSON-RPC 2.0 requests for methods:
 *   CheckPerformTransaction, CreateTransaction, PerformTransaction,
 *   CancelTransaction, CheckTransaction, GetStatement.
 *
 * SETUP REQUIRED before this goes live:
 *   1. Get your MERCHANT_ID and SECRET_KEY from https://business.payme.uz
 *   2. Add them as environment variables in Vercel:
 *      PAYME_MERCHANT_ID, PAYME_SECRET_KEY
 *   3. Set this route's URL as the webhook URL in the Payme merchant
 *      cabinet: https://yourdomain.com/api/payme
 *   4. When a user clicks "Upgrade to Pro", redirect them to Payme's
 *      checkout URL with account.user_id = the user's Supabase user id,
 *      so this webhook knows which account to upgrade.
 */

const PRO_PRICE_TIYIN = 39_000_000; // Payme amounts are in tiyin (1 som = 100 tiyin)

const PAYME_ERRORS = {
  INVALID_AMOUNT: { code: -31001, message: "Invalid amount" },
  USER_NOT_FOUND: { code: -31050, message: "User not found" },
  TRANSACTION_NOT_FOUND: { code: -31003, message: "Transaction not found" },
  CANT_CANCEL: { code: -31007, message: "Cannot cancel transaction" },
  UNAUTHORIZED: { code: -32504, message: "Unauthorized" },
};

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") || "";
  const expected =
    "Basic " +
    Buffer.from(`Paycom:${process.env.PAYME_SECRET_KEY}`).toString("base64");
  return auth === expected;
}

function rpcError(id: number, error: { code: number; message: string }) {
  return NextResponse.json({ jsonrpc: "2.0", id, error });
}

function rpcResult(id: number, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { method, params, id } = body;

  if (!checkAuth(req)) {
    return rpcError(id, PAYME_ERRORS.UNAUTHORIZED);
  }

  const admin = createAdminClient();

  switch (method) {
    case "CheckPerformTransaction": {
      const userId = params?.account?.user_id;
      if (params.amount < PRO_PRICE_TIYIN) {
        return rpcError(id, PAYME_ERRORS.INVALID_AMOUNT);
      }
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();
      if (!profile) return rpcError(id, PAYME_ERRORS.USER_NOT_FOUND);
      return rpcResult(id, { allow: true });
    }

    case "CreateTransaction": {
      const userId = params?.account?.user_id;
      const now = Date.now();

      const { data: existing } = await admin
        .from("payments")
        .select("*")
        .eq("provider", "payme")
        .eq("provider_transaction_id", params.id)
        .single();

      if (existing) {
        return rpcResult(id, {
          create_time: existing.payme_create_time,
          transaction: existing.id,
          state: existing.payme_state,
        });
      }

      const { data: created, error } = await admin
        .from("payments")
        .insert({
          user_id: userId,
          provider: "payme",
          provider_transaction_id: params.id,
          amount: params.amount / 100,
          status: "pending",
          payme_state: 1,
          payme_create_time: now,
          raw_payload: params,
        })
        .select()
        .single();

      if (error || !created) return rpcError(id, PAYME_ERRORS.USER_NOT_FOUND);

      return rpcResult(id, { create_time: now, transaction: created.id, state: 1 });
    }

    case "PerformTransaction": {
      const { data: txn } = await admin
        .from("payments")
        .select("*")
        .eq("provider", "payme")
        .eq("provider_transaction_id", params.id)
        .single();

      if (!txn) return rpcError(id, PAYME_ERRORS.TRANSACTION_NOT_FOUND);

      const performTime = txn.payme_perform_time || Date.now();

      await admin
        .from("payments")
        .update({
          status: "paid",
          payme_state: 2,
          payme_perform_time: performTime,
        })
        .eq("id", txn.id);

      await admin.from("profiles").update({ plan: "pro" }).eq("id", txn.user_id);

      return rpcResult(id, { transaction: txn.id, perform_time: performTime, state: 2 });
    }

    case "CancelTransaction": {
      const { data: txn } = await admin
        .from("payments")
        .select("*")
        .eq("provider", "payme")
        .eq("provider_transaction_id", params.id)
        .single();

      if (!txn) return rpcError(id, PAYME_ERRORS.TRANSACTION_NOT_FOUND);

      const cancelTime = Date.now();
      const newState = txn.payme_state === 2 ? -2 : -1;

      await admin
        .from("payments")
        .update({
          status: "cancelled",
          payme_state: newState,
          payme_cancel_time: cancelTime,
          payme_cancel_reason: params.reason,
        })
        .eq("id", txn.id);

      return rpcResult(id, {
        transaction: txn.id,
        cancel_time: cancelTime,
        state: newState,
      });
    }

    case "CheckTransaction": {
      const { data: txn } = await admin
        .from("payments")
        .select("*")
        .eq("provider", "payme")
        .eq("provider_transaction_id", params.id)
        .single();

      if (!txn) return rpcError(id, PAYME_ERRORS.TRANSACTION_NOT_FOUND);

      return rpcResult(id, {
        create_time: txn.payme_create_time,
        perform_time: txn.payme_perform_time || 0,
        cancel_time: txn.payme_cancel_time || 0,
        transaction: txn.id,
        state: txn.payme_state,
        reason: txn.payme_cancel_reason || null,
      });
    }

    case "GetStatement": {
      const { data: rows } = await admin
        .from("payments")
        .select("*")
        .eq("provider", "payme")
        .gte("payme_create_time", params.from)
        .lte("payme_create_time", params.to);

      return rpcResult(id, {
        transactions: (rows || []).map((t) => ({
          id: t.provider_transaction_id,
          time: t.payme_create_time,
          amount: t.amount * 100,
          account: { user_id: t.user_id },
          create_time: t.payme_create_time,
          perform_time: t.payme_perform_time || 0,
          cancel_time: t.payme_cancel_time || 0,
          transaction: t.id,
          state: t.payme_state,
          reason: t.payme_cancel_reason || null,
        })),
      });
    }

    default:
      return rpcError(id, { code: -32601, message: "Method not found" });
  }
}
