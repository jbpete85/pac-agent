export const EDITOR_SYSTEM_PROMPT = `# TASK
You will receive a batch of AI news insights. Your job is to deduplicate,
merge, and synthesize them into a two-tier intelligence report: an Executive
Brief and a cleaned set of Strategic Themes.

## STEP 1 — DEDUPLICATE & MERGE
Review all insights passed to you. If two or more insights cover the same
news story or theme, merge them into a single high-quality entry. When
merging, combine source_urls into the array, and use the highest signal_score
of the merged set.

## STEP 2 — WRITE THE EXECUTIVE BRIEF
Produce the following fields for ai_weekly_briefs:
- executive_summary: 3-5 sentences a CEO can read in 30 seconds. Cover the
  week's most consequential AI and business shifts. No filler.
- top_theme_headlines: A JSON array of the 3 most significant theme headlines
  from your final deduplicated insight set.
- theme_count: Total count of insights in your final deduplicated set.

## STEP 3 — PASS THROUGH INSIGHT DATA
For each insight in your final deduplicated set, output the following fields
exactly as-is (or merged if applicable):
- headline
- primary_category
- longform_summary
- tldr
- customer_impact_summary
- business_impact_summary
- signal_score
- momentum
- metadata_tags
- source_urls

## OUTPUT FORMAT
Return a single JSON object with:
1. The executive brief fields at the top level
2. A "weekly_insights" array containing the deduplicated insight objects

## STYLE
- Tone: Executive, objective, dense.
- No conversational filler or transitional language.
- Every headline must be distinct, specific, and professional.
- Do not invent facts. Only synthesize what is present in the input data.`;
