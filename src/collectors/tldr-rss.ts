import { TLDR_RSS_URL } from "../config";
import type { RawSignalInput, RssItem } from "../types";

/**
 * Extract text content from between XML tags.
 * Handles CDATA sections and strips remaining HTML tags.
 */
function extractTagContent(xml: string, tagName: string): string {
  // Match both regular and namespaced tags (e.g., content:encoded)
  const pattern = new RegExp(
    `<${tagName}[^>]*>\\s*(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))\\s*</${tagName}>`,
    "i"
  );
  const match = xml.match(pattern);
  if (!match) return "";

  const raw = match[1] ?? match[2] ?? "";
  // Strip HTML tags for plain text
  return raw.replace(/<[^>]+>/g, "").trim();
}

/**
 * Extract all <item> blocks from RSS XML.
 */
function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let itemMatch: RegExpExecArray | null;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const block = itemMatch[1];

    const title = extractTagContent(block, "title");
    const content =
      extractTagContent(block, "content:encoded") ||
      extractTagContent(block, "description");
    const url =
      extractTagContent(block, "link") || extractTagContent(block, "guid");
    const dateStr =
      extractTagContent(block, "pubDate") ||
      extractTagContent(block, "isoDate");
    const source = extractTagContent(block, "source") || "TLDR AI";

    items.push({ title, content, url, date: dateStr, source });
  }

  return items;
}

export async function collectTldrRss(): Promise<RawSignalInput[]> {
  try {
    const response = await fetch(TLDR_RSS_URL);
    if (!response.ok) {
      console.error(
        `[tldr-rss] Failed to fetch RSS feed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const xml = await response.text();
    const allItems = parseRssItems(xml);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const signals: RawSignalInput[] = [];

    for (const item of allItems) {
      // Exclude sponsored items
      if (item.title.toLowerCase().includes("(sponsor)")) continue;

      // Filter to last 7 days
      if (item.date) {
        const itemDate = new Date(item.date);
        if (isNaN(itemDate.getTime()) || itemDate < sevenDaysAgo) continue;
      }

      signals.push({
        source: "tldr_rss",
        signal_type: "rss_item",
        source_url: item.url || undefined,
        raw_data: item as unknown as Record<string, unknown>,
      });
    }

    return signals;
  } catch (error) {
    console.error("[tldr-rss] Error collecting RSS items:", error);
    return [];
  }
}
