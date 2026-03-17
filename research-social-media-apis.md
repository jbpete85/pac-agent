# Social Media API Research for Building a Social Listening/Monitoring Agent (2026)

---

## 1. BlueSky (AT Protocol)

**Status: Most open platform. Fully free.**

### Official APIs
- **AT Protocol XRPC API** — Full REST API with endpoints for posts, profiles, feeds, social graph, search, moderation
- **Firehose** — Real-time WebSocket stream of all public events (posts, likes, follows, handle changes, repo operations)
  - Connect via `com.atproto.sync.subscribeRepos` on relay `bsky.network`
  - **JetStream** — Simplified JSON firehose alternative (easier to consume than raw CBOR)
- **Labeler APIs** — Build custom moderation/labeling services

### Data Available
- Public posts, replies, quotes, reposts
- Like counts, repost counts
- User profiles, follower/following graphs
- Feed generators (custom algorithmic feeds)
- Full-text search

### Pricing & Rate Limits
- **Completely free** — No paid tiers
- Rate limits exist but are generous (not precisely documented; community reports ~3,000 requests/5 min for authenticated calls)
- Authentication: Bearer token via `com.atproto.server.createSession` (username + app password)

### Free Alternatives
- The entire protocol is open — you can run your own PDS and relay
- RSS feeds available via third-party bridges
- Multiple open-source SDKs: `@atproto/api` (JS/TS), `atproto` (Python), many others

**Verdict: Best platform for social listening. Open firehose, no cost, no approval process.**

---

## 2. X (Twitter)

**Status: Pay-per-usage model as of 2025. No free tier for meaningful access.**

### Current API Tiers (2025-2026)
1. **Pay-per-usage (v2)** — Credit-based billing, no commitments
   - Monthly cap: 2 million post reads
   - Includes search, streaming (filtered), user lookup, trends
   - Credit-based deduction per request; deduplication within 24 hours
2. **Enterprise** — Custom pricing, contact sales
   - Complete firehose access
   - Historical data backfill
   - Custom rate limits
   - Dedicated support

### Key Rate Limits (v2 pay-per-usage)
| Endpoint | App limit | User limit |
|----------|-----------|------------|
| GET /2/tweets | 3,500/15min | 5,000/15min |
| POST /2/tweets | 10,000/24hrs | 100/15min |
| GET /2/tweets/search/recent | 450/15min | 300/15min |
| GET /2/users | 300/15min | 900/15min |

### Data Available
- Posts, users, spaces, DMs, lists, trends, media
- Search (recent and full-archive with Enterprise)
- Filtered streaming
- Conversation threads, edit history
- Engagement metrics (likes, retweets, replies, impressions)

### Authentication
- OAuth 2.0 (user context) or OAuth 2.0 App-Only (Bearer Token)
- Developer account required via developer portal

### Free Alternatives
- **No meaningful free tier** — The old free tier (1,500 tweets/month write) was replaced by pay-per-usage
- Nitter instances (third-party front-end) have been largely shut down
- RSS bridges exist but are unreliable
- Web scraping is explicitly prohibited by ToS and actively blocked

**Verdict: Expensive for monitoring at scale. Enterprise tier required for firehose. Budget accordingly.**

---

## 3. Threads (Meta)

**Status: API available since mid-2024. Free but requires Meta app approval.**

### API Capabilities
- **Publishing**: Single posts, carousel posts, reply management
- **Reading**: Own posts, replies, mentions
- **Insights**: Views, likes, replies, reposts, quotes, shares (per post), follower demographics (account-level)
- **Search**: Keyword search functionality
- **Moderation**: Hide/unhide replies, reply controls (everyone, followers only, mentioned only, etc.), reply approval workflows
- **Webhooks**: Real-time notifications

### Rate Limits
- Not explicitly documented in public docs; follows Meta's standard Graph API patterns
- Likely ~200 calls/hour per user token (consistent with Instagram API)

### Authentication
- OAuth 2.0 with Meta app
- Short-lived tokens (1 hour) exchangeable for long-lived (60 days, refreshable)
- Required permissions: `threads_basic`, `threads_content_publish`, `threads_manage_replies`, `threads_read_replies`, `threads_manage_insights`
- App Review required for production access

### Limitations
- Can only access data from users who have authorized your app
- No public firehose or broad search of all public posts
- Insights data only available from April 2024 onward
- Demographic data requires 100+ followers

### Free Alternatives
- No public RSS feeds
- Web scraping difficult due to Meta's anti-bot measures

**Verdict: Useful for monitoring your own brand's Threads presence. Not suitable for broad social listening across all public posts.**

---

## 4. YouTube (Google)

**Status: Free tier with quota system. Generous for read operations.**

### Data API v3 Capabilities
- Video metadata (title, description, duration, view count, likes, comments count)
- Channel information, banners, sections
- Comment threads and replies
- Playlists and playlist items
- Search across all public YouTube content
- Subscriptions, captions

### Quota System
- **Default: 10,000 units/day** (free)
- Cost per operation:
  - List/read operations: ~1 unit
  - Search requests: ~100 units
  - Write operations (create/update/delete): ~50 units
  - Video uploads: ~1,600 units
- Can request quota increase through Google Cloud Console

### Authentication
- API key (for public data reads)
- OAuth 2.0 (for user-specific data and write operations)
- Google Cloud project required

### Pricing
- **Free** within default quota (10,000 units/day)
- Quota extension requests are free but require justification
- No paid tier per se — it's part of Google Cloud

### Free Alternatives
- YouTube RSS feeds exist: `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`
- `yt-dlp` for metadata extraction (check ToS compliance)
- YouTube's oEmbed endpoint for basic video info

**Verdict: Strong free option for monitoring. 10,000 units/day supports ~100 searches or ~10,000 video metadata reads daily.**

---

## 5. LinkedIn

**Status: Heavily restricted. Requires partnership approval for most useful data.**

### API Access Tiers

**Open Permissions (available to all developers):**
- Sign in with LinkedIn (OpenID Connect) — name, headline, photo, email
- Share on LinkedIn — post, comment, like on behalf of authenticated member

**Marketing API (requires approval as Marketing Partner):**
- Campaign management, reporting, analytics
- Community management: page management, content analysis, follower statistics
- **Brand monitoring**: Organization social action notifications, @mention search
- Lead sync, matched audiences, audience insights, conversions API

**Compliance API (closed):**
- Activity retrieval for compliance monitoring — no longer accepting applications

### Rate Limits
- Vary by endpoint and partner tier
- Typically 100-500 requests/day for basic endpoints
- Marketing API partners get higher limits

### Authentication
- OAuth 2.0 (3-legged member auth or 2-legged application auth)
- Developer Portal application required
- Marketing API requires explicit LinkedIn approval

### Pricing
- **Free** for open permissions
- Marketing API requires partnership (often requires being a LinkedIn Marketing Partner with business relationship)
- No self-serve paid tier

### Free Alternatives
- LinkedIn public profiles have limited scraping (explicitly prohibited by ToS — see hiQ vs. LinkedIn Supreme Court case, though LinkedIn won on remand)
- No RSS feeds
- Company pages have some public data viewable without auth

**Verdict: Very restrictive for social listening. The brand monitoring APIs exist but require Marketing Partner approval. Not practical for independent developers.**

---

## 6. Instagram (Meta)

**Status: Free API for business/creator accounts only. Consumer accounts inaccessible.**

### API Capabilities
- **Two auth flows**: Instagram Login (direct) or Facebook Login (business/creator accounts)
- Media retrieval (photos, videos, stories, reels)
- Business discovery (other business/creator account metadata)
- Comment management and moderation
- Hashtag search and discovery
- @mention tracking
- Content publishing (posts, stories for business accounts)
- Insights/analytics (reach, impressions, engagement)

### Rate Limits
- Follows Meta Graph API limits
- ~200 calls/user/hour (standard)
- Hashtag search: 30 unique hashtags per 7 days per user

### Authentication
- OAuth 2.0 via Meta/Facebook
- Facebook Page connected to Instagram Professional account required for business features
- App Review required

### Pricing
- **Free** — no paid tiers
- Must comply with Meta Platform Terms

### Limitations
- Cannot access consumer (personal) Instagram accounts
- No public firehose
- Ordering results not supported
- Stories data expires after 24 hours

### Free Alternatives
- No RSS feeds
- Web scraping actively blocked by Meta
- Some public profile data visible without auth

**Verdict: Good for monitoring your own brand and discovering hashtagged content. Cannot do broad public listening across all users.**

---

## 7. Snapchat

**Status: Minimal API for social listening. Focused on AR and advertising.**

### Available APIs
- **Snap Kit** — Login, Creative, Bitmoji, Story Kit (sharing to Snapchat)
- **Camera Kit** — AR lens integration for third-party apps
- **Snapchat Marketing API** — Ad management, campaign reporting (open to all developers)
- **Social Plugins** — Embed Lenses, Spotlights, Stories, Profiles on websites

### Data Available for Listening
- **Almost none** — No public API for reading user posts, stories, or engagement
- Marketing API provides ad performance metrics only
- No search, no public content discovery API

### Authentication
- OAuth 2.0 for Snap Kit
- Marketing API has its own auth flow

### Pricing
- APIs are free to use
- Marketing API requires Snapchat Business account

**Verdict: Not viable for social listening. Snapchat is a closed platform with no public content APIs.**

---

## 8. TikTok

**Status: Research API available for academics/researchers. Commercial API exists but restricted.**

### Research API
- **Requires application approval** — limited to academic researchers, nonprofits, some companies
- Query public videos by: region, keywords, hashtags, music IDs, creation dates, video length, usernames
- Returns: video ID, like count, create date, region code, description, music info
- User profile data: display name, bio, avatar, verified status, follower/following/likes/video counts
- SQL-like query operators (EQ, IN, GT, LT, AND/OR/NOT)

### Rate Limits
- 100 videos per response (default 10)
- Cursor-based pagination
- Daily request limits (varies by approval tier)

### Commercial Content API
- Requires TikTok for Business partnership
- Content Discovery, User Info endpoints
- More restrictive access

### Authentication
- Client credentials flow (client key + secret from approved project)

### Pricing
- **Free** for approved researchers
- Commercial API pricing not publicly documented

### Free Alternatives
- TikTok has RSS-like feeds via some third-party tools
- `yt-dlp` supports TikTok metadata (check ToS)
- Web scraping is against ToS

**Verdict: Research API is powerful but requires approval. Not available for general commercial social listening without partnership.**

---

## 9. Reddit

**Status: Free tier still exists but with strict limits after 2023 API pricing changes.**

### Current API Access (Post-2023 Changes)
- **Free tier**: Available for non-commercial, personal use
  - Rate limit: 60 requests/minute (OAuth2 authenticated)
  - Requires OAuth2 for all API access
  - Must use descriptive User-Agent string
- **Paid/Commercial tier**: Required for commercial applications
  - Pricing: ~$0.24 per 1,000 API calls (announced 2023)
  - Higher rate limits available
  - Enterprise agreements for large-scale access

### Data Available
- Subreddit posts, comments, votes
- User profiles and post history
- Search across all subreddits
- Trending/hot/new/top posts
- Comment trees and threading
- Awards, flair, moderation data

### Authentication
- OAuth2 required for all access
- Register app at reddit.com/prefs/apps
- Script, web app, or installed app types

### Free Alternatives
- Reddit RSS feeds: append `.rss` to any subreddit URL (e.g., `reddit.com/r/technology/.rss`)
- Pushshift.io — historical Reddit data archive (access has been restricted since 2023)
- Old Reddit JSON: append `.json` to URLs (may be rate-limited)

**Verdict: RSS feeds make Reddit one of the easier platforms for basic monitoring. Full API access is affordable for moderate use.**

---

## 10. Quora

**Status: No public API. One of the most closed platforms.**

### API Access
- **No official public API** exists as of 2026
- Quora deprecated its API program years ago
- No developer portal, no OAuth, no documentation

### Data Available via API
- None

### Free Alternatives
- Quora has **no RSS feeds**
- Web scraping is technically possible but against ToS
- Some third-party tools (import.io, Octoparse) can scrape Quora but risk account/IP bans
- Quora Spaces RSS feeds may work for specific spaces

**Verdict: Not viable for automated social listening. Manual monitoring only.**

---

## 11. Podcasts

### Podcast Index API
- **Completely free**, community-funded (powered by the Podcasting 2.0 initiative)
- Indexes 4M+ podcasts
- Endpoints: search, trending, recent, by feed URL, by iTunes ID, episodes, categories, stats
- Authentication: API key + secret (free registration)
- Rate limits: Reasonable for moderate use (not precisely documented, community reports ~10 req/sec)
- Data: Podcast metadata, episode lists, feed URLs, categories, language, artwork, value tags

### Apple Podcasts API
- Part of Apple's ecosystem
- **Apple Podcasts Search API** (via iTunes Search API): Free, no auth required
  - Search podcasts, get metadata, artwork, feed URLs
  - Rate limit: ~20 requests/minute
- **Apple Podcasts Connect API**: For podcast owners only (analytics, episode management)
  - Requires Apple Developer account ($99/year)

### Spotify Web API
- Free with Spotify developer account
- **Show endpoints**: Get show metadata, episodes, saved shows
- **Episode endpoints**: Get episode details, saved episodes
- Data: Title, description, publisher, episode count, languages, explicit flag
- Rate limits: ~30 requests/second (not precisely documented)
- Authentication: OAuth 2.0 or Client Credentials
- **Limitation**: Cannot access listen counts or analytics (reserved for Spotify for Podcasters dashboard)

### Free Alternatives
- Nearly all podcasts have **RSS feeds** — this is the native distribution format
- **Listen Notes API**: Freemium (free tier: 300 requests/month)
- **Podchaser API**: Database of podcasts with creator/guest data
- **OPML directories** for bulk podcast discovery

**Verdict: Podcasts are the most accessible medium for monitoring. RSS is the native format. Podcast Index + RSS parsing covers most needs for free.**

---

## Enterprise Social Listening Platforms (with API access)

### Brandwatch (Cision)
- **Coverage**: 100M+ unique sites, 1.7T historical conversations back to 2010
- **Platforms**: Facebook, Instagram, X, LinkedIn, Threads, BlueSky, Reddit, Tumblr, blogs, forums, news, reviews
- **API**: REST API for programmatic access to queries, mentions, analytics
- **Pricing**: Enterprise only, typically $800-3,000+/month
- **Strength**: Historical data depth, AI-powered consumer intelligence

### Sprinklr
- **Coverage**: 30+ digital channels
- **Platforms**: All major social + messaging apps, forums, review sites, news
- **API**: Unified CXM platform with API access
- **Pricing**: Enterprise, typically $299+/user/month (Sprinklr Service) to custom enterprise
- **Strength**: Unified customer experience management

### Meltwater
- **Coverage**: Social media, news, print, broadcast, podcasts
- **Platforms**: All major social + editorial media
- **API**: Data export and integration APIs
- **Pricing**: Enterprise, typically $4,000+/year
- **Strength**: PR and media monitoring, earned media analytics

### Mention
- **Coverage**: Social media, web, forums, blogs, news
- **API**: REST API for alerts, mentions, statistics
- **Pricing**: From $49/month (Solo) to custom enterprise
- **Strength**: Affordable entry point, real-time alerts

### Talkwalker (Hootsuite)
- **Coverage**: 150M+ websites, 30+ social networks
- **API**: Full API access at enterprise tier
- **Pricing**: From $9,600/year
- **Strength**: Visual analytics, image recognition for logo detection

---

## Unified Social Media APIs (Aggregators)

### Data365
- **Platforms**: TikTok, Instagram, Facebook, X/Twitter, Reddit, Threads
- **Capabilities**: User profiles, posts, comments, engagement metrics, real-time monitoring
- **Pricing**: Freemium; paid plans based on volume (contact for pricing)
- **Uptime**: 99.9% SLA
- **Auth**: API key

### Socialinsider
- **Platforms**: TikTok, Instagram, LinkedIn, Facebook, X/Twitter, YouTube
- **Capabilities**: Analytics, benchmarking, competitor analysis, content analysis
- **Pricing**: From ~$124/month; 14-day free trial
- **API**: Available on higher-tier plans

### Phyllo
- **Platforms**: Instagram, YouTube, TikTok, X/Twitter, Twitch, and 50+ platforms
- **Focus**: Creator/influencer data (identity, engagement, income)
- **Pricing**: Freemium with usage-based paid plans
- **Use case**: Influencer marketing, creator economy platforms

### RapidAPI Social Media Collections
- Aggregates dozens of unofficial and semi-official social media APIs
- **Platforms**: All major platforms via third-party providers
- **Pricing**: Varies per API (many have free tiers)
- **Risk**: Unofficial APIs may break without notice

---

## Open Source Social Listening Tools

### Obsei (1.4k GitHub stars)
- **Type**: Low-code AI-powered automation
- **Architecture**: Observer → Analyzer → Informer pipeline
- **Sources**: Twitter, Facebook, Reddit, YouTube, Google Maps, App Store, Play Store, Email, Google News, web crawling
- **Analysis**: Sentiment analysis, classification, NER, PII detection, translation
- **Outputs**: Slack, Zendesk, Jira, Elasticsearch, HTTP, Pandas DataFrames
- **Status**: Alpha, active development
- **Language**: Python

### Huginn (48.9k GitHub stars)
- **Type**: Self-hosted automation agent platform (IFTTT/Zapier alternative)
- **Capabilities**: Website monitoring, Twitter term tracking, RSS consumption, email digests, event spike detection
- **Integrations**: Twitter, Slack, RSS, Twilio, JIRA, FTP
- **Language**: Ruby
- **Deployment**: Docker, Heroku, manual

### SignalSift
- **Type**: Community intelligence tracker
- **Sources**: Reddit, YouTube, Hacker News
- **Output**: Markdown reports for trend analysis
- **Language**: Python

### ChangeDetection.io
- **Type**: Website change monitoring
- **Use for**: Monitoring social media profiles, forum threads, news pages
- **Self-hosted**: Docker deployment

### OpenSearch + Custom Pipelines
- Build your own with RSS ingestion, API polling, and search/analytics via OpenSearch or Elasticsearch

---

## Strategic Recommendations for Building a Social Listening Agent

### Tier 1 — Start Here (Free/Low Cost)
| Platform | Method | Cost |
|----------|--------|------|
| BlueSky | AT Protocol Firehose + API | Free |
| YouTube | Data API v3 | Free (10K units/day) |
| Reddit | RSS feeds + API | Free (60 req/min) |
| Podcasts | Podcast Index + RSS parsing | Free |

### Tier 2 — Moderate Investment
| Platform | Method | Cost |
|----------|--------|------|
| X/Twitter | Pay-per-usage API v2 | ~$100-500/month depending on volume |
| Threads | Meta Graph API | Free (requires app approval) |
| Instagram | Meta Graph API | Free (business accounts only) |

### Tier 3 — Requires Partnerships/Enterprise
| Platform | Method | Cost |
|----------|--------|------|
| LinkedIn | Marketing API Partner | Free but requires partnership approval |
| TikTok | Research API | Free but requires researcher approval |
| Snapchat | N/A | Not viable |
| Quora | N/A | Not viable |

### Architecture Suggestion
1. **Data Collection Layer**: Use Obsei or custom Python agents per platform
2. **Queue/Stream Processing**: Redis Streams or Apache Kafka for event processing
3. **Storage**: PostgreSQL + Elasticsearch for structured + full-text search
4. **Analysis**: LLM-based sentiment/topic analysis (Claude API)
5. **Alerting**: Webhooks, Slack, email digests

### Legal Considerations
- Always use official APIs where available — web scraping violates most platforms' ToS
- GDPR/CCPA compliance required when storing user data
- LinkedIn's hiQ case established some precedent for public data access, but platforms are increasingly winning enforcement
- Reddit's 2023 API changes specifically targeted third-party data harvesting
- Always review each platform's developer terms before building
