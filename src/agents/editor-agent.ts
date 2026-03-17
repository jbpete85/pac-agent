import { generateObject } from "ai";
import { getModel } from "../lib/ai.js";
import { WeeklyBriefSchema, type Insight, type WeeklyBrief } from "../types.js";
import { EDITOR_SYSTEM_PROMPT } from "../prompts/editor-system.js";

type InsightWithSources = Insight & { source_urls?: string[] };

export async function runEditorAgent(
  insights: InsightWithSources[]
): Promise<WeeklyBrief> {
  const formatted = JSON.stringify(insights, null, 2);

  const { object } = await generateObject({
    model: getModel(),
    schema: WeeklyBriefSchema,
    system: EDITOR_SYSTEM_PROMPT,
    prompt: formatted,
  });

  return object;
}
