import { createServiceClient } from "../lib/supabase.js";

export async function upsertWeeklyBriefing(
  orgId: string,
  pipelineRunId: string,
  data: {
    week_start: string;
    executive_summary: string;
    top_theme_headlines: string[];
    theme_count: number;
  }
) {
  const supabase = createServiceClient();

  const { data: result, error } = await supabase
    .from("weekly_briefing")
    .upsert(
      {
        org_id: orgId,
        pipeline_run_id: pipelineRunId,
        week_start: data.week_start,
        executive_summary: data.executive_summary,
        top_theme_headlines: data.top_theme_headlines,
        theme_count: data.theme_count,
      },
      {
        onConflict: "org_id,week_start",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to upsert weekly briefing: ${error.message}`);
  }

  return result;
}

export async function getLatestWeeklyBriefing(orgId: string) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("weekly_briefing")
    .select()
    .eq("org_id", orgId)
    .order("week_start", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Failed to get latest weekly briefing: ${error.message}`);
  }

  return data;
}
