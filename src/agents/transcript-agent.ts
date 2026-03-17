import { generateObject } from "ai";
import { getModel } from "../lib/ai.js";
import { InsightsArraySchema, type Insight } from "../types.js";
import { TRANSCRIPT_SYSTEM_PROMPT } from "../prompts/transcript-system.js";

export async function runTranscriptAgent(
  transcripts: string[]
): Promise<Insight[]> {
  try {
    const combined = transcripts.join("\n\n---NEXT TRANSCRIPT---\n\n");

    const { object } = await generateObject({
      model: getModel(),
      schema: InsightsArraySchema,
      system: TRANSCRIPT_SYSTEM_PROMPT,
      prompt: combined,
    });

    return object.insights;
  } catch (error) {
    console.error("[transcript-agent] Failed to generate insights:", error);
    return [];
  }
}
