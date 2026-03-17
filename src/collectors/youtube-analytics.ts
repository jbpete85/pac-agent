import {
  APIFY_ACTOR_ID,
  APIFY_ACTOR_INPUT,
  APIFY_SEARCH_QUERIES,
} from "../config";
import type { RawSignalInput, YouTubeVideoResult } from "../types";

const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_DURATION_MS = 5 * 60 * 1_000; // 5 minutes

interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

interface ApifyDatasetItem {
  id?: string;
  title?: string;
  url?: string;
  date?: string;
  text?: string;
  viewCount?: number;
  likes?: number;
  commentsCount?: number;
  channelName?: string;
  channelUrl?: string;
  searchQuery?: string;
  [key: string]: unknown;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function collectYouTubeAnalytics(): Promise<RawSignalInput[]> {
  const apiToken = process.env.APIFY_API_TOKEN;
  if (!apiToken) {
    console.error("[youtube-analytics] APIFY_API_TOKEN is not set");
    return [];
  }

  try {
    // Step 1: Start the Apify actor run
    const runUrl = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs?token=${apiToken}`;
    const runResponse = await fetch(runUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...APIFY_ACTOR_INPUT,
        searchQueries: [...APIFY_SEARCH_QUERIES],
      }),
    });

    if (!runResponse.ok) {
      console.error(
        `[youtube-analytics] Failed to start actor: ${runResponse.status} ${runResponse.statusText}`
      );
      return [];
    }

    const runData: ApifyRunResponse = await runResponse.json();
    const runId = runData.data.id;
    const datasetId = runData.data.defaultDatasetId;

    // Step 2: Poll for completion
    const startTime = Date.now();
    let status = runData.data.status;

    while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED") {
      if (Date.now() - startTime > MAX_POLL_DURATION_MS) {
        console.error("[youtube-analytics] Actor run timed out after 5 minutes");
        return [];
      }

      await sleep(POLL_INTERVAL_MS);

      const statusResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${apiToken}`
      );

      if (!statusResponse.ok) {
        console.error(
          `[youtube-analytics] Failed to check run status: ${statusResponse.status}`
        );
        return [];
      }

      const statusData: ApifyRunResponse = await statusResponse.json();
      status = statusData.data.status;
    }

    if (status !== "SUCCEEDED") {
      console.error(`[youtube-analytics] Actor run ended with status: ${status}`);
      return [];
    }

    // Step 3: Fetch the dataset
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}`
    );

    if (!datasetResponse.ok) {
      console.error(
        `[youtube-analytics] Failed to fetch dataset: ${datasetResponse.status}`
      );
      return [];
    }

    const items: ApifyDatasetItem[] = await datasetResponse.json();

    // Map to normalized results and sort by viewCount descending
    const normalized: Array<{ result: YouTubeVideoResult; raw: ApifyDatasetItem }> =
      items
        .map((item) => ({
          result: {
            id: item.id ?? "",
            title: item.title ?? "",
            url: item.url ?? "",
            date: item.date ?? "",
            text: item.text ?? "",
            viewCount: item.viewCount ?? 0,
            likes: item.likes ?? 0,
            commentsCount: item.commentsCount ?? 0,
            channelName: item.channelName ?? "",
            channelUrl: item.channelUrl ?? "",
            searchQuery: item.searchQuery ?? "",
          } satisfies YouTubeVideoResult,
          raw: item,
        }))
        .sort((a, b) => b.result.viewCount - a.result.viewCount);

    return normalized.map(({ result }) => ({
      source: "apify",
      signal_type: "youtube_video",
      source_url: result.url,
      raw_data: result as unknown as Record<string, unknown>,
    }));
  } catch (error) {
    console.error("[youtube-analytics] Error collecting analytics:", error);
    return [];
  }
}
