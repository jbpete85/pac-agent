import {
  TAVILY_KEYWORDS,
  TAVILY_WHITELISTED_DOMAINS,
  TAVILY_MAX_RESULTS,
  TAVILY_SCORE_THRESHOLD,
} from "../config";
import type { RawSignalInput, TavilyResult } from "../types";

interface TavilySearchResponse {
  results: Array<{
    title: string;
    url: string;
    content: string;
    score: number;
    published_date?: string;
  }>;
}

export async function collectTavilyResults(): Promise<RawSignalInput[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.error("[tavily] TAVILY_API_KEY is not set");
    return [];
  }

  const seenUrls = new Set<string>();
  const signals: RawSignalInput[] = [];

  for (const keyword of TAVILY_KEYWORDS) {
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: keyword,
          search_depth: "advanced",
          topic: "news",
          max_results: TAVILY_MAX_RESULTS,
          include_domains: [...TAVILY_WHITELISTED_DOMAINS],
        }),
      });

      if (!response.ok) {
        console.error(
          `[tavily] Search failed for "${keyword}": ${response.status} ${response.statusText}`
        );
        continue;
      }

      const data: TavilySearchResponse = await response.json();

      for (const result of data.results) {
        if (result.score <= TAVILY_SCORE_THRESHOLD) continue;
        if (seenUrls.has(result.url)) continue;

        seenUrls.add(result.url);

        const tavilyResult: TavilyResult = {
          title: result.title,
          url: result.url,
          content: result.content,
          score: result.score,
          published_date: result.published_date,
          query: keyword,
        };

        signals.push({
          source: "tavily",
          signal_type: "news",
          source_url: result.url,
          raw_data: tavilyResult as unknown as Record<string, unknown>,
        });
      }
    } catch (error) {
      console.error(`[tavily] Error searching for "${keyword}":`, error);
    }
  }

  return signals;
}
