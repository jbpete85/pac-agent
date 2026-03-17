import { createServiceClient } from "../lib/supabase.js";

export async function createPipelineRun(orgId: string, pipelineType: string) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("pipeline_runs")
    .insert({
      org_id: orgId,
      pipeline_type: pipelineType,
      status: "running",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create pipeline run: ${error.message}`);
  }

  return data;
}

export async function updatePipelineStatus(
  id: string,
  status: string,
  errorMessage?: string
) {
  const supabase = createServiceClient();

  const updates: Record<string, unknown> = { status };

  if (status === "completed" || status === "failed") {
    updates.completed_at = new Date().toISOString();
  }

  if (errorMessage) {
    updates.error_message = errorMessage;
  }

  const { data, error } = await supabase
    .from("pipeline_runs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update pipeline status: ${error.message}`);
  }

  return data;
}

export async function getLatestPipelineRun(
  orgId: string,
  pipelineType: string
) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("pipeline_runs")
    .select()
    .eq("org_id", orgId)
    .eq("pipeline_type", pipelineType)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Failed to get latest pipeline run: ${error.message}`);
  }

  return data;
}
