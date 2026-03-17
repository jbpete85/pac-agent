import { createServiceClient } from "../lib/supabase.js";

export async function insertProcessedSignals(
  orgId: string,
  pipelineRunId: string,
  signals: Array<{
    headline: string;
    tldr?: string;
    primary_category: string;
    longform_summary?: string;
    business_impact_summary?: string;
    customer_impact_summary?: string;
    signal_score: number;
    momentum?: string;
    metadata_tags?: string[];
    source_urls?: string[];
    raw_signal_ids?: string[];
  }>
) {
  const supabase = createServiceClient();

  const rows = signals.map((signal) => ({
    org_id: orgId,
    pipeline_run_id: pipelineRunId,
    headline: signal.headline,
    tldr: signal.tldr ?? null,
    primary_category: signal.primary_category,
    longform_summary: signal.longform_summary ?? null,
    business_impact_summary: signal.business_impact_summary ?? null,
    customer_impact_summary: signal.customer_impact_summary ?? null,
    signal_score: signal.signal_score,
    momentum: signal.momentum ?? null,
    metadata_tags: signal.metadata_tags ?? [],
    source_urls: signal.source_urls ?? [],
    raw_signal_ids: signal.raw_signal_ids ?? [],
  }));

  const { data, error } = await supabase
    .from("processed_signals")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(`Failed to insert processed signals: ${error.message}`);
  }

  return data;
}

export async function getProcessedSignalsByPipelineRun(
  pipelineRunId: string
) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("processed_signals")
    .select()
    .eq("pipeline_run_id", pipelineRunId)
    .order("signal_score", { ascending: false });

  if (error) {
    throw new Error(`Failed to get processed signals: ${error.message}`);
  }

  return data;
}

export async function getLatestProcessedSignals(
  orgId: string,
  limit: number = 20
) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("processed_signals")
    .select()
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(
      `Failed to get latest processed signals: ${error.message}`
    );
  }

  return data;
}
