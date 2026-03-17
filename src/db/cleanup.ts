import { createServiceClient } from "../lib/supabase.js";

export async function cleanupStaleSignals(orgId: string) {
  const supabase = createServiceClient();

  const { error } = await supabase.rpc("cleanup_stale_signals", {
    target_org_id: orgId,
  });

  if (error) {
    throw new Error(`Failed to cleanup stale signals: ${error.message}`);
  }
}
