import { createServiceClient } from "../lib/supabase.js";

export async function insertRawSignals(
  orgId: string,
  pipelineRunId: string,
  signals: Array<{
    source: string;
    signal_type: string;
    raw_data: Record<string, unknown>;
    source_url?: string;
  }>
) {
  const supabase = createServiceClient();

  const rows = signals.map((signal) => ({
    org_id: orgId,
    pipeline_run_id: pipelineRunId,
    source: signal.source,
    signal_type: signal.signal_type,
    raw_data: signal.raw_data,
    source_url: signal.source_url ?? null,
  }));

  const { data, error } = await supabase
    .from("raw_signals")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(`Failed to insert raw signals: ${error.message}`);
  }

  return data;
}

export async function getRawSignalsByPipelineRun(pipelineRunId: string) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("raw_signals")
    .select()
    .eq("pipeline_run_id", pipelineRunId)
    .order("captured_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to get raw signals: ${error.message}`);
  }

  return data;
}
