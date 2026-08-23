import { GoogleAuth } from "npm:google-auth-library@9";
import { createClient } from "npm:@supabase/supabase-js@2";

interface JobRecord {
  id?: string;
  title?: string;
  company?: string;
  category?: string | null;
  location?: string | null;
  employment_type?: string | null;
}

interface JobsInsertWebhookPayload {
  type: string;
  table: string;
  record: JobRecord;
}

interface PushSubscriptionRow {
  id: string;
  fcm_token: string;
  category: string | null;
  location: string | null;
  job_type: string[] | null;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const FIREBASE_SERVICE_ACCOUNT_JSON = Deno.env.get("FIREBASE_SERVICE_ACCOUNT") ?? "";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);
const FCM_PROJECT_ID = serviceAccount.project_id;

const googleAuth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"]
});

async function getFcmAccessToken(): Promise<string> {
  const client = await googleAuth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
  if (!token) throw new Error("Failed to obtain a Google access token for FCM.");
  return token;
}

function subscriptionMatchesJob(job: JobRecord, subscription: PushSubscriptionRow): boolean {
  const categoryMatches = !subscription.category || subscription.category === "All" || subscription.category === job.category;
  const locationMatches = !subscription.location || subscription.location === job.location;
  const jobTypeMatches = !subscription.job_type || subscription.job_type.length === 0 ||
    (job.employment_type != null && subscription.job_type.includes(job.employment_type));

  return categoryMatches && locationMatches && jobTypeMatches;
}

interface FcmSendResult {
  ok: boolean;
  errorCode?: string;
}

async function sendFcmNotification(accessToken: string, fcmToken: string, title: string, body: string): Promise<FcmSendResult> {
  const response = await fetch(`https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: {
        token: fcmToken,
        notification: { title, body }
      }
    })
  });

  if (response.ok) return { ok: true };

  const errorPayload = await response.json().catch(() => null);
  const fcmErrorDetail = errorPayload?.error?.details?.find((detail: { errorCode?: string }) => typeof detail?.errorCode === "string");
  const errorCode = fcmErrorDetail?.errorCode ?? errorPayload?.error?.status;

  console.warn(`[notify-new-job] FCM send failed for token ${fcmToken}:`, response.status, JSON.stringify(errorPayload));
  return { ok: false, errorCode };
}

async function deactivateSubscription(subscriptionId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("push_subscriptions")
    .update({ is_active: false })
    .eq("id", subscriptionId);

  if (error) {
    console.error(`[notify-new-job] Failed to deactivate subscription ${subscriptionId}:`, error);
  }
}

const INVALID_TOKEN_ERROR_CODES = new Set(["UNREGISTERED", "INVALID_ARGUMENT"]);

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json() as JobsInsertWebhookPayload;

    if (payload.type !== "INSERT" || payload.table !== "jobs") {
      return new Response(JSON.stringify({ skipped: true, reason: "not a jobs insert" }), { status: 200 });
    }

    const job = payload.record;

    const { data: subscriptions, error: queryError } = await supabaseAdmin
      .from("push_subscriptions")
      .select("id, fcm_token, category, location, job_type")
      .eq("is_active", true);

    if (queryError) {
      console.error("[notify-new-job] Failed to query push_subscriptions:", queryError);
      return new Response(JSON.stringify({ error: queryError.message }), { status: 500 });
    }

    const matches = (subscriptions ?? []).filter((subscription: PushSubscriptionRow) => subscriptionMatchesJob(job, subscription));

    if (matches.length === 0) {
      return new Response(JSON.stringify({ matched: 0, sent: 0, deactivated: 0 }), { status: 200 });
    }

    const accessToken = await getFcmAccessToken();
    const title = "New job matching your search";
    const body = `${job.title ?? "A new role"} at ${job.company ?? "a company"}`;

    let sent = 0;
    let deactivated = 0;

    for (const subscription of matches) {
      const result = await sendFcmNotification(accessToken, subscription.fcm_token, title, body);

      if (result.ok) {
        sent++;
        continue;
      }

      if (result.errorCode && INVALID_TOKEN_ERROR_CODES.has(result.errorCode)) {
        await deactivateSubscription(subscription.id);
        deactivated++;
      }
    }

    return new Response(JSON.stringify({ matched: matches.length, sent, deactivated }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[notify-new-job] Unhandled error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
});
