import { YOUTUBE_CHANNEL_ID, YOUTUBE_CHANNEL_LIMIT } from "../config";
import type { RawSignalInput } from "../types";

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    channelTitle: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}

interface TranscriptResponse {
  transcript: string;
}

export async function collectYouTubeTranscripts(): Promise<RawSignalInput[]> {
  const youtubeKey = process.env.YOUTUBE_API_KEY;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (!youtubeKey) {
    console.error("[youtube-channel] YOUTUBE_API_KEY is not set");
    return [];
  }
  if (!rapidApiKey) {
    console.error("[youtube-channel] RAPIDAPI_KEY is not set");
    return [];
  }

  const signals: RawSignalInput[] = [];

  try {
    // Step 1: Fetch recent videos from the channel
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const publishedAfter = sevenDaysAgo.toISOString();

    const searchUrl = new URL(
      "https://www.googleapis.com/youtube/v3/search"
    );
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("channelId", YOUTUBE_CHANNEL_ID);
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("order", "relevance");
    searchUrl.searchParams.set("maxResults", String(YOUTUBE_CHANNEL_LIMIT));
    searchUrl.searchParams.set("publishedAfter", publishedAfter);
    searchUrl.searchParams.set("key", youtubeKey);

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      console.error(
        `[youtube-channel] Search API failed: ${searchResponse.status} ${searchResponse.statusText}`
      );
      return [];
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json();
    if (!searchData.items || searchData.items.length === 0) {
      console.error("[youtube-channel] No videos found in the last 7 days");
      return [];
    }

    // Step 2: Fetch transcript for each video sequentially
    for (const item of searchData.items) {
      const videoId = item.id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      try {
        const transcriptUrl = new URL(
          "https://youtube-transcript3.p.rapidapi.com/api/transcript"
        );
        transcriptUrl.searchParams.set("videoId", videoId);
        transcriptUrl.searchParams.set("flat_text", "true");

        const transcriptResponse = await fetch(transcriptUrl.toString(), {
          headers: {
            "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com",
            "x-rapidapi-key": rapidApiKey,
          },
        });

        if (!transcriptResponse.ok) {
          console.error(
            `[youtube-channel] Transcript fetch failed for ${videoId}: ${transcriptResponse.status}`
          );
          continue;
        }

        const transcriptData: TranscriptResponse =
          await transcriptResponse.json();

        signals.push({
          source: "youtube_transcript",
          signal_type: "transcript",
          source_url: videoUrl,
          raw_data: {
            transcript: transcriptData.transcript,
            videoId,
            url: videoUrl,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            channelName: item.snippet.channelTitle,
          },
        });
      } catch (error) {
        console.error(
          `[youtube-channel] Error fetching transcript for ${videoId}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("[youtube-channel] Error collecting transcripts:", error);
    return [];
  }

  return signals;
}
