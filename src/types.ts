import { z } from "zod";
import { INSIGHT_CATEGORIES, MOMENTUM_VALUES } from "./config";

// Zod schemas for AI agent structured output

export const InsightSchema = z.object({
  headline: z.string().describe("The core news, source, or theme title"),
  tldr: z.string().describe("A single, punchy sentence summarizing the main event"),
  primary_category: z.enum(INSIGHT_CATEGORIES).describe("Most relevant category"),
  longform_summary: z.string().describe("3-5 sentence paragraph expanding on the topic"),
  business_impact_summary: z.string().describe("How this affects the Kingside business model/moat"),
  customer_impact_summary: z.string().describe("How this changes the end-user experience, ROI, workforce, or competitive advantage"),
  signal_score: z.number().int().min(1).max(10).describe("1-3: iterative, 4-7: significant, 8-10: paradigm shift"),
  momentum: z.enum(MOMENTUM_VALUES).describe("Trend phase"),
  metadata_tags: z.array(z.string()).max(5).describe("Up to 5 tags for the topic"),
});

export const InsightsArraySchema = z.object({
  insights: z.array(InsightSchema),
});

export const WeeklyBriefSchema = z.object({
  executive_summary: z.string().describe("3-5 sentences a CEO can read in 30 seconds"),
  top_theme_headlines: z.array(z.string()).describe("3 most significant theme headlines"),
  theme_count: z.number().int().describe("Total count of deduplicated insights"),
  weekly_insights: z.array(
    InsightSchema.extend({
      source_urls: z.array(z.string()).describe("Source URLs for this insight"),
    })
  ),
});

export type Insight = z.infer<typeof InsightSchema>;
export type WeeklyBrief = z.infer<typeof WeeklyBriefSchema>;

// Collector output types

export interface RawSignalInput {
  source: string;
  signal_type: string;
  raw_data: Record<string, unknown>;
  source_url?: string;
}

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
  query: string;
}

export interface YouTubeVideoResult {
  id: string;
  title: string;
  url: string;
  date: string;
  text: string;
  viewCount: number;
  likes: number;
  commentsCount: number;
  channelName: string;
  channelUrl: string;
  searchQuery: string;
}

export interface TranscriptResult {
  transcript: string;
  source: string;
  url: string;
  videoId: string;
}

export interface RssItem {
  title: string;
  content: string;
  url: string;
  date: string;
  source: string;
}
