import { generateObject } from "ai";
import { getModel } from "../lib/ai.js";
import { InsightsArraySchema, type Insight } from "../types.js";
import { NEWS_SYSTEM_PROMPT } from "../prompts/news-system.js";

interface NewsArticleInput {
  title: string;
  url: string;
  content: string;
  source: string;
  date: string;
}

export async function runNewsAgent(
  articles: NewsArticleInput[]
): Promise<Insight[]> {
  try {
    const formatted = articles
      .map(
        (a, i) =>
          `--- ARTICLE ${i + 1} ---
Title: ${a.title}
Source: ${a.source}
Date: ${a.date}
URL: ${a.url}
Content:
${a.content}`
      )
      .join("\n\n");

    const { object } = await generateObject({
      model: getModel(),
      schema: InsightsArraySchema,
      system: NEWS_SYSTEM_PROMPT,
      prompt: formatted,
    });

    return object.insights;
  } catch (error) {
    console.error("[news-agent] Failed to generate insights:", error);
    return [];
  }
}
