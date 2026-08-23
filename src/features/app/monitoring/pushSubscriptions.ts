import { supabase } from "../../../utils/supabaseClient";
import { readStoredValue, writeStoredValue } from "../hooks/useProfileSettings";

const PUSH_TOKEN_KEY = "sharpjob.push.token.v1";

export async function syncPushTokenToSupabase(token: string, category: string, location: string, jobTypes: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          fcm_token: token,
          category,
          location,
          job_type: jobTypes,
          is_active: true
        },
        { onConflict: "fcm_token" }
      );

    if (error) throw error;

    await writeStoredValue(PUSH_TOKEN_KEY, token);
  } catch (error) {
    console.warn("[SharpJob] syncPushTokenToSupabase failed:", error);
  }
}

export async function deactivatePushToken(): Promise<void> {
  try {
    const token = await readStoredValue(PUSH_TOKEN_KEY);
    if (!token) return;

    const { error } = await supabase
      .from("push_subscriptions")
      .update({ is_active: false })
      .eq("fcm_token", token);

    if (error) throw error;
  } catch (error) {
    console.warn("[SharpJob] deactivatePushToken failed:", error);
  }
}
