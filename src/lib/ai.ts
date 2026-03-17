import { createOpenRouter } from "@openrouter/ai-sdk-provider";

function getOpenRouter() {
  return createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
}

export function getModel(model?: string) {
  const openrouter = getOpenRouter();
  return openrouter(
    model ??
      process.env.OPENROUTER_DEFAULT_MODEL ??
      "anthropic/claude-sonnet-4"
  );
}
