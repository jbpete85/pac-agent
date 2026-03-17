import { createPipelineRun, updatePipelineStatus } from "./db/pipeline-runs.js";
import { insertRawSignals } from "./db/raw-signals.js";
import { insertProcessedSignals } from "./db/processed-signals.js";
import { upsertWeeklyBriefing } from "./db/weekly-briefing.js";
import { cleanupStaleSignals } from "./db/cleanup.js";
import { collectTavilyResults } from "./collectors/tavily.js";
import { collectYouTubeTranscripts } from "./collectors/youtube-channel.js";
import { collectYouTubeAnalytics } from "./collectors/youtube-analytics.js";
import { collectTldrRss } from "./collectors/tldr-rss.js";
import { runTranscriptAgent } from "./agents/transcript-agent.js";
import { runYouTubeAgent } from "./agents/youtube-agent.js";
import { runNewsAgent } from "./agents/news-agent.js";
import { runEditorAgent } from "./agents/editor-agent.js";
import { sendTelegramNotification } from "./notifications/telegram.js";
import type { RawSignalInput } from "./types.js";

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setUTCDate(diff);
  return monday.toISOString().split("T")[0];
}

export async function runInsightsPipeline(orgId: string): Promise<string> {
  console.log(`[pipeline] Starting insights pipeline for org: ${orgId}`);

  const run = await createPipelineRun(orgId, "insights_generator");
  const pipelineRunId = run.id;

  try {
    // Phase 1: Cleanup stale data
    console.log("[pipeline] Cleaning up stale signals...");
    await cleanupStaleSignals(orgId);

    // Phase 2: Run all 4 collectors in parallel
    console.log("[pipeline] Running collectors...");
    const [tavilyResults, transcriptResults, youtubeResults, rssResults] =
      await Promise.all([
        collectTavilyResults(),
        collectYouTubeTranscripts(),
        collectYouTubeAnalytics(),
        collectTldrRss(),
      ]);

    console.log(
      `[pipeline] Collected: ${tavilyResults.length} tavily, ${transcriptResults.length} transcripts, ${youtubeResults.length} youtube, ${rssResults.length} rss`
    );

    // Store all raw signals
    const allRawSignals: RawSignalInput[] = [
      ...tavilyResults,
      ...transcriptResults,
      ...youtubeResults,
      ...rssResults,
    ];

    if (allRawSignals.length > 0) {
      await insertRawSignals(orgId, pipelineRunId, allRawSignals);
    }

    // Phase 3: Run 3 AI analysis agents in parallel
    console.log("[pipeline] Running AI analysis agents...");

    const transcriptTexts = transcriptResults
      .map((r) => (r.raw_data as Record<string, unknown>).transcript as string)
      .filter(Boolean);

    const youtubeVideos = youtubeResults.map((r) => {
      const d = r.raw_data as Record<string, unknown>;
      return {
        title: d.title as string,
        url: r.source_url ?? "",
        viewCount: d.viewCount as number,
        likes: d.likes as number,
        commentsCount: d.commentsCount as number,
        channelName: d.channelName as string,
        searchQuery: d.searchQuery as string,
      };
    });

    const newsArticles = [...tavilyResults, ...rssResults].map((r) => {
      const d = r.raw_data as Record<string, unknown>;
      return {
        title: d.title as string,
        url: r.source_url ?? "",
        content: (d.content as string) ?? "",
        source: r.source,
        date: (d.date as string) ?? (d.published_date as string) ?? "",
      };
    });

    const [transcriptInsights, youtubeInsights, newsInsights] =
      await Promise.all([
        transcriptTexts.length > 0
          ? runTranscriptAgent(transcriptTexts)
          : Promise.resolve([]),
        youtubeVideos.length > 0
          ? runYouTubeAgent(youtubeVideos)
          : Promise.resolve([]),
        newsArticles.length > 0
          ? runNewsAgent(newsArticles)
          : Promise.resolve([]),
      ]);

    console.log(
      `[pipeline] Insights: ${transcriptInsights.length} transcript, ${youtubeInsights.length} youtube, ${newsInsights.length} news`
    );

    const allInsights = [
      ...transcriptInsights.map((i) => ({ ...i, source_urls: [] as string[] })),
      ...youtubeInsights.map((i) => ({ ...i, source_urls: [] as string[] })),
      ...newsInsights.map((i) => ({ ...i, source_urls: [] as string[] })),
    ];

    if (allInsights.length === 0) {
      console.log("[pipeline] No insights generated. Completing.");
      await updatePipelineStatus(pipelineRunId, "completed");
      await sendTelegramNotification(
        `PAC Agent Insights Pipeline completed on ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} with no insights generated.`
      );
      return pipelineRunId;
    }

    // Phase 4: Run editor agent to deduplicate and synthesize
    console.log("[pipeline] Running editor agent for synthesis...");
    const weeklyBrief = await runEditorAgent(allInsights);

    // Store processed signals
    const processedSignals = weeklyBrief.weekly_insights.map((insight) => ({
      headline: insight.headline,
      tldr: insight.tldr,
      primary_category: insight.primary_category,
      longform_summary: insight.longform_summary,
      business_impact_summary: insight.business_impact_summary,
      customer_impact_summary: insight.customer_impact_summary,
      signal_score: insight.signal_score,
      momentum: insight.momentum,
      metadata_tags: insight.metadata_tags,
      source_urls: insight.source_urls,
    }));

    await insertProcessedSignals(orgId, pipelineRunId, processedSignals);

    // Store weekly briefing
    await upsertWeeklyBriefing(orgId, pipelineRunId, {
      week_start: getWeekStart(),
      executive_summary: weeklyBrief.executive_summary,
      top_theme_headlines: weeklyBrief.top_theme_headlines,
      theme_count: weeklyBrief.theme_count,
    });

    // Phase 5: Notify and finalize
    await updatePipelineStatus(pipelineRunId, "completed");

    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    await sendTelegramNotification(
      `The AI Insights Generator successfully synced with Supabase on ${dateStr}. ${weeklyBrief.theme_count} insights processed.`
    );

    console.log(
      `[pipeline] Completed. ${weeklyBrief.theme_count} insights processed.`
    );
    return pipelineRunId;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown pipeline error";
    console.error("[pipeline] Failed:", message);
    await updatePipelineStatus(pipelineRunId, "failed", message);
    throw error;
  }
}
