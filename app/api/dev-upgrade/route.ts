import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST() {
  if (process.env.ALLOW_DEV_UPGRADE !== "true") {
    return NextResponse.json(
      {
        error:
          "Pro upgrades are only available after payment. Payment integration coming soon.",
      },
      { status: 403 }
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Uses the admin client (service role) so it can bypass the
  // protect_plan_column trigger, exactly like a real payment webhook would.
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ plan: "pro" })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
