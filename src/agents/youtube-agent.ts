import { generateObject } from "ai";
import { getModel } from "../lib/ai.js";
import { InsightsArraySchema, type Insight } from "../types.js";
import { YOUTUBE_SYSTEM_PROMPT } from "../prompts/youtube-system.js";

interface YouTubeVideoInput {
  title: string;
  url: string;
  viewCount: number;
  likes: number;
  commentsCount: number;
  channelName: string;
  searchQuery: string;
}

export async function runYouTubeAgent(
  videos: YouTubeVideoInput[]
): Promise<Insight[]> {
  try {
    const formatted = videos
      .map(
        (v, i) =>
          `--- VIDEO ${i + 1} ---
Title: ${v.title}
Channel: ${v.channelName}
URL: ${v.url}
Views: ${v.viewCount.toLocaleString()}
Likes: ${v.likes.toLocaleString()}
Comments: ${v.commentsCount.toLocaleString()}
Search Query: ${v.searchQuery}`
      )
      .join("\n\n");

    const { object } = await generateObject({
      model: getModel(),
      schema: InsightsArraySchema,
      system: YOUTUBE_SYSTEM_PROMPT,
      prompt: formatted,
    });

    return object.insights;
  } catch (error) {
    console.error("[youtube-agent] Failed to generate insights:", error);
    return [];
  }
}
