# PAC Agent Implementation Plan for Kingside Group

## Context

Gary Vaynerchuk's PAC framework (Platform, Algorithm, Culture) from *Day Trading Attention* (May 2024) provides a systematic approach to maximizing organic content reach. Kingside needs a weekly-cadence agent system that monitors 8 focus platforms, tracks what's winning among AI creators/influencers, generates Kingside-voiced content across specific format types, and learns primarily from Kingside's own performance data. This plan turns the theoretical PAC.md document into build specs, presenting two options: free and paid.

**Note on "Veditor"**: Research found no public use of this term by Gary V or VaynerMedia. The PAC framework itself is well-documented, but "Veditor" appears to originate from the PAC.md document, not from Gary V's content.

---

## Focus Platforms (8)

LinkedIn, X, Threads, BlueSky, YouTube (Shorts + Long Form), Facebook, Instagram, TikTok

Secondary monitoring (no content generation): Reddit, Substack, Beehiiv, Podcasts, Quora

---

## Two Options at a Glance

| Dimension | Free/Low-Cost | Paid/Premium |
|-----------|--------------|-------------|
| Monthly cost | **$30-60** | **$375-635** |
| Platform coverage | All 8 focus platforms with own-account data; limited competitor intel | All 8 with deep competitor analytics + cross-platform sentiment |
| Own-account analytics | Connected via native APIs for all 8 platforms | Same, plus enriched with third-party benchmarking |
| Competitor intelligence | Manual + canary accounts | Trigify (LinkedIn) + Data365 (TikTok/IG/Facebook) |
| AI creator tracking | RSS + free API monitoring | Favikon scoring + engagement analytics |
| Content format tracking | Own performance data by format type | Own + competitor format performance |

---

## A. Platform Coverage Strategy

### Own-Account Connections (Both Tiers)

The agent connects to Kingside's own social accounts as the **primary data source**. Your own performance data carries the highest weight in all scoring and strategy decisions.

| Platform | Own-Account API | Data Available | Format Types Tracked |
|----------|----------------|---------------|---------------------|
| **LinkedIn** | LinkedIn Pages API (connected) | Post impressions, clicks, engagement rate, follower demographics, UTM tracking | Text post, carousel (slide count), photo, video, poll, article, newsletter |
| **X** | X API (connected) | Tweet analytics, impressions, engagement, follower growth | Text, image, video, thread (post count), poll |
| **Threads** | Threads API (connected via Meta) | Post insights, reach, engagement | Text, image, carousel, video |
| **BlueSky** | AT Protocol (connected) | Posts, reposts, likes, follows, feed membership | Text, image, video, link card |
| **YouTube** | YouTube Studio API (connected) | Watch time, retention curves, CTR, subscriber conversion, traffic sources | **Short** (<60s) vs. **Long Form** (tracked separately with duration buckets) |
| **Facebook** | Meta Graph API (connected) | Page insights, post reach, engagement, video views | Text, image, video, Reel, link post, live video |
| **Instagram** | Instagram Graph API (connected) | Reach, impressions, saves, shares, profile visits | Reel, carousel, static image, Story |
| **TikTok** | TikTok API (connected) | Video views, likes, shares, comments, profile views | Video (duration buckets: <15s, 15-30s, 30-60s, 60s+), photo carousel |

### External Listening (Free Tier)

| Source | Method | What It Captures | Refresh |
|--------|--------|-----------------|---------|
| **BlueSky** | AT Protocol firehose (free) | AI-related posts, trending topics, competitor content | Real-time |
| **YouTube** | Data API v3 (free, 10K units/day) | Competitor videos, trending AI topics, comment sentiment | Weekly |
| **Reddit** | Free API + RSS | AI/SMB subreddit trends, pain points, competitor mentions | Weekly |
| **Substack/Beehiiv** | RSS feeds | AI newsletter trends, topic tracking | Weekly |
| **Podcasts** | Podcast Index API (free) + RSS | AI business podcast topics, guest trends | Weekly |
| **X** | Free tier (1,500 reads/mo) | Limited competitor monitoring | Weekly |
| **Facebook/Instagram/Threads** | Own-account APIs only | No competitor data beyond public engagement counts | Weekly |
| **TikTok** | Display API (limited) | Own-account only | Weekly |
| **Quora** | Playwright scraping | Trending AI questions for content ideas | Weekly |

### External Listening Upgrades (Paid Tier)

| Platform | Service | Additional Signals | Cost/Month |
|----------|---------|-------------------|------------|
| **X** | X API Pro | Full search, competitor monitoring, sentiment | $100-200 |
| **TikTok/IG/Facebook** | Data365 | Competitor video/post performance, hashtag trends, sound trends | $99 |
| **LinkedIn** | Trigify | Buyer intent signals, competitor engagement spikes | $149 |
| **Cross-platform** | Mention ($49/mo) | Brand mention alerts, sentiment, crisis detection | $49 |
| **Influencer intel** | Favikon (free-$49/mo) | Creator authenticity scores, niche authority | $0-49 |

---

## B. Content Format Intelligence

Every piece of content (own and tracked creators) is tagged with a format type. The PCS Analyzer correlates format with engagement to produce weekly format recommendations.

### Format Taxonomy Per Platform

| Platform | Format Types | Key Metrics Per Format |
|----------|-------------|----------------------|
| **LinkedIn** | Text post, Carousel (+ slide count), Photo, Video, Poll, Article, Newsletter | Dwell time, comment depth, share rate, save rate |
| **X** | Text, Image, Video, Thread (+ post count), Poll | Quote rate, bookmark rate, reply depth |
| **Threads** | Text, Image, Carousel, Video | Reply rate, repost rate, quote rate |
| **BlueSky** | Text, Image, Video, Link card | Repost rate, reply rate, like velocity |
| **YouTube** | **Short** (<60s): hook type, duration, text overlay y/n | Completion rate, subscribe-after-view, share rate |
| | **Long Form**: duration bucket, chapter count, thumbnail style | Watch time %, retention curve shape, comment rate |
| **Facebook** | Text, Image, Video, Reel, Link post, Live | Reach, share rate, comment rate, video completion |
| **Instagram** | Reel (+ duration), Carousel (+ slide count), Static image, Story | Save rate, share rate, reach, completion rate |
| **TikTok** | Video (<15s / 15-30s / 30-60s / 60s+), Photo carousel | Completion rate, share rate, save rate, sound usage |

### YouTube Shorts vs. Long Form (Tracked Separately)

The agent maintains separate PES weights and strategy recommendations for Shorts and Long Form:

**Shorts strategy signals**: Hook effectiveness (3s retention), completion rate, subscribe conversion, sound/trend usage, text overlay patterns

**Long Form strategy signals**: Click-through rate (thumbnail + title), average view duration, retention curve drop-off points, chapter engagement, end-screen conversion

The weekly briefing includes a dedicated YouTube section comparing Shorts vs. Long Form performance and recommending the split for the coming week.

### Format Recommendations in Weekly Briefing

The PCS Analyzer produces format-specific insights like:
- "LinkedIn carousels (6-8 slides) outperformed text posts by 2.4x on saves this month"
- "TikTok videos under 15s are driving 3x more shares than 30-60s"
- "YouTube Shorts with text overlay are completing at 78% vs. 52% without"
- "Instagram static images underperforming. Shift budget to Reels"
- "Facebook Reels outperforming standard video posts by 1.8x on shares"

Content briefs specify format type, not just platform: "LinkedIn carousel, 7 slides, SCORE phase: Study, cohort: C-Suite"

---

## C. AI Creator & Influencer Intelligence Layer

Tracks what's winning among AI content creators, feeding pattern intelligence into the Content Generator.

### What It Tracks

1. **Creator Watchlist** (30-50 AI creators across focus platforms)
   - Content format patterns and which formats each creator is shifting toward
   - Hook structures driving high engagement
   - Topic clusters getting traction
   - Posting cadence and timing
   - Engagement velocity

2. **Trending AI Content Patterns**
   - AI topics spiking across multiple platforms simultaneously
   - Format types outperforming historical averages
   - Audio/sound trends on TikTok and Reels
   - Emerging sub-niches ("AI for dentists," "AI for contractors")

3. **Engagement Pattern Analysis**
   - Hook types driving saves/shares vs. likes
   - Fastest-growing creators and what changed
   - Comment sentiment: genuine discussion vs. vanity engagement

### Creator Watchlist by Platform

| Platform | Creator Types to Track |
|----------|----------------------|
| LinkedIn | AI strategy advisors, fractional CTOs, marketing-meets-AI voices, SMB operators sharing AI wins |
| YouTube | AI tutorial creators, business automation channels, non-technical AI explainers |
| TikTok/Reels | "AI tools you're sleeping on" creators, business productivity influencers |
| X/Threads/BlueSky | AI industry commentators, open-source voices, AI ethics/policy |
| Facebook | AI business groups, SMB community leaders using AI |

### How Creator Intelligence Feeds the System

```
Creator Intelligence + Kingside Own Performance Data
        │
        ▼
Culture Scanner (enriches opportunities with "what's winning" context)
        │
        ▼
PAC Orchestrator (weekly briefing informs content brief priorities + format choices)
        │
        ▼
Content Generator (uses winning patterns as structural inspiration, NOT copying)
        │
        ▼
Brand Memory Filter (ensures Kingside voice, not influencer mimicry)
```

Pattern awareness, not imitation. "LinkedIn carousels with contrarian openers are outperforming standard posts by 3x" becomes a structural insight applied through Kingside's voice.

---

## D. Agent Architecture

### Weekly Cycle (Single Run, Monday)

```
Sunday night:  PCS Analyzer collects past week's engagement data from all 8 connected accounts
               │
Monday 5am:    Platform Listener + Creator Intel + Culture Scanner run (all Haiku)
               Collect external signals, creator content, cultural trends
               │
Monday 6am:    PAC Orchestrator (Sonnet) processes everything
               Produces week's content briefs + "What's Winning" briefing
               Specifies format type per platform for each brief
               │
Monday-Tuesday: Content Generator (Sonnet) produces platform-specific drafts
                Brand Memory Filter (Sonnet, cached prompt) validates each piece
                All drafts enter content_queue
                │
Tuesday:       Jeff reviews in Slack (approve / reject / edit)
               │
Wed-Sun:       Approved content publishes on schedule via n8n
               │
Sunday night:  PCS Analyzer runs again → feeds next Monday's cycle
```

### Multi-Agent System (Orchestrator-Worker)

```
                    ┌─────────────────────┐
                    │   PAC Orchestrator   │
                    │   (Claude Sonnet)    │
                    │   Weekly Monday 6am  │
                    └──────────┬──────────┘
                               │
       ┌───────────┬───────────┼───────────┬───────────┐
       │           │           │           │           │
 ┌─────▼─────┐ ┌──▼──────┐ ┌──▼──────┐ ┌──▼──────┐ ┌──▼──────┐
 │ Platform  │ │ Culture │ │ Content │ │  PCS    │ │ Creator │
 │ Listener  │ │ Scanner │ │Generator│ │Analyzer │ │ Intel   │
 │ (Haiku)   │ │ (Haiku) │ │(Sonnet) │ │(Sonnet) │ │ (Haiku) │
 └─────┬─────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
       │             │          │            │           │
       │             │    ┌─────▼─────┐      │           │
       │             │    │  Brand    │      │           │
       │             │    │  Memory   │      │           │
       │             │    │  Filter   │      │           │
       │             │    │(Sonnet,   │      │           │
       │             │    │ cached)   │      │           │
       │             │    └───────────┘      │           │
       │             │                       │           │
       └─────────────┴───────────────────────┴───────────┘
                               │
                        Supabase (shared state)
```

### Agent Roles

| Agent | Model | Schedule | Purpose |
|-------|-------|----------|---------|
| **PAC Orchestrator** | Sonnet | Weekly Monday 6am | Selects content opportunities, creates briefs with format types, produces weekly strategy |
| **Platform Listener** | Haiku | Weekly Monday 5am | Collects and classifies external platform signals |
| **Culture Scanner** | Haiku | Weekly Monday 5am | Maps signals to content pillars, identifies Cultural Windows |
| **Creator Intel** | Haiku | Weekly Monday 5am | Tracks watchlist creators, detects winning format/topic patterns |
| **Content Generator** | Sonnet | Monday-Tuesday (on-demand) | Produces platform-specific drafts in specified format types |
| **Brand Memory Filter** | Sonnet (cached prompt) | Post-processing on every draft | Two-pass: regex fast-check + editorial voice check |
| **PCS Analyzer** | Sonnet | Weekly Sunday night | Mines engagement from all 8 connected accounts, updates PES weights and format performance |
| **Cohort Mapper** | Haiku | Monthly | Refreshes audience segment profiles and platform affinities |

### Tech Stack

| Component | Technology | Role |
|-----------|-----------|------|
| **Orchestration** | n8n (goodhelpai.app.n8n.cloud) | Workflow scheduling, API connections, agent coordination |
| **LLM** | Claude API (Haiku + Sonnet, no Opus) | All intelligence, classification, generation |
| **Database** | Supabase (PostgreSQL + pgvector) | Signal storage, content queue, analytics, format performance |
| **Content Queue** | Supabase table + Slack notifications | Human-in-the-loop review before publish |
| **Brand Memory** | Cached system prompt from brand JSON files | Voice enforcement |
| **Social Connections** | Native APIs for all 8 platforms | Own-account performance data (primary signal) |

### Data Flow

```
Kingside's 8 Connected Social Accounts (PRIMARY)
        │
        ▼
PCS Analyzer (Sonnet, Sunday night)
  → pulls engagement metrics for all published content from past week
  → calculates PES per piece, correlates with format type
  → updates strategy_weights and format_performance tables
        │
        ▼
External Platforms + Creator Feeds (SECONDARY)
        │
        ▼
n8n Collector Workflows (Monday 5am)
        │
        ▼
Supabase raw_signals
        │
        ▼
Platform Listener + Culture Scanner + Creator Intel (Haiku, Monday 5am)
  → classify signals, map cultural relevance, track creator patterns
        │
        ▼
PAC Orchestrator (Sonnet, Monday 6am)
  → reads: own performance data (highest weight) + external signals + creator intel
  → produces: week's content briefs with format types + "What's Winning" briefing
        │
        ▼
Content Generator (Sonnet, Monday-Tuesday)
  → drafts per platform in specified format
        │
        ▼
Brand Memory Filter (Sonnet, cached prompt)
  → pass/fail → content_queue
        │
        ▼
HUMAN REVIEW (Slack: approve / reject / edit)
        │
        ▼
n8n Publishing Workflows → post to 8 platforms on schedule
```

### PES Scoring Logic

Weights stored in Supabase, seeded from industry research, then **adjusted weekly by PCS Analyzer based on Kingside's own engagement data** (own data takes priority over industry benchmarks):

**LinkedIn**: Dwell Time 0.30, Meaningful Comment 0.25, Share/Repost 0.20, Save 0.15, Like 0.05, Profile Visit 0.05

**X**: Quote with commentary 0.30, Reply 0.25, Repost 0.20, Bookmark 0.15, Like 0.10

**Threads/BlueSky**: Quote/Repost with commentary 0.30, Reply 0.25, Repost 0.20, Bookmark 0.15, Like 0.10

**YouTube Shorts**: Completion Rate 0.30, Subscribe-after-view 0.25, Share 0.20, Comment 0.15, Like 0.10

**YouTube Long Form**: Watch Time % 0.30, Subscribe-after-view 0.20, Comment 0.20, Share 0.15, Like 0.10, Save-to-playlist 0.05

**Facebook**: Share 0.30, Meaningful Comment 0.25, Save 0.15, Reaction (non-like) 0.15, Like 0.10, Click 0.05

**Instagram**: Save 0.25, Share/Send 0.25, Completion Rate (Reels) 0.20, Comment 0.15, Like 0.10, Profile Visit 0.05

**TikTok**: Save 0.25, Share/Send 0.25, Completion Rate 0.20, Rewatch 0.15, Comment 0.10, Like 0.05

---

## E. Kingside Tuning

### Brand Memory Layer

Assembled at runtime from three source files (cached for 90% token discount):

1. **`claudeadmin/kingside_brand_schema_v4.json`** — Complete brand system: forbidden lexicon, voice dimensions, cadence rules, platform modifiers, SCORE framework, core beliefs
2. **`~/.claude/kingside/brand-system.json`** — Voice archetype, tone calibration examples
3. **`claudeadmin/corebeliefs.md`** — Core beliefs that inform content POV

**Enforcement (two-pass)**:
1. **Fast check** (regex, no LLM cost): 80+ forbidden words, em dashes in body, semicolons, self-answered questions, exclamation count. Instant reject.
2. **Full editorial check** (Sonnet, cached prompt): Tone vs. voice dimensions (casual 20/100, serious 72/100, respectful 85/100), cadence, 8th-grade reading level, conviction, Kingside-specific POV.

### Content Pillar Mapping (Updated for 8 Focus Platforms)

| Content Pillar | Primary Platforms | Format Preference |  Target Cohort |
|----------------|------------------|-------------------|----------------|
| AI Implementation Across Operations | LinkedIn, YouTube (Long Form) | Carousel, long-form video, article | C-Suite, Ops Managers |
| Technical Empathy for SMB Owners | LinkedIn, Instagram, Threads, Facebook | Reel, carousel, relatable text post | General SMB Owners |
| AI ROI Demonstrations | LinkedIn, YouTube (both), Facebook | Carousel, Short, video case study | C-Suite, Decision Makers |
| Barbell Strategy (Digital + Analog) | Instagram, TikTok, YouTube Shorts | Reel, Short, photo carousel | Ops Managers, SMB Owners |
| SCORE Framework Education | LinkedIn, YouTube Long Form, Facebook | Carousel, long-form video, article | All cohorts |
| Anti-Snake-Oil / Truth-Telling | X, Threads, BlueSky | Text post, thread, hot take | IT Teams, SMB Owners |

### SCORE Phase Content Themes

- **Study**: "Follow the Money/Time/Pain" stories, AI readiness assessments, discovery question frameworks
- **Configure**: WAT taxonomy explainers, build-vs-buy decisions, solution architecture walkthroughs
- **Orchestrate**: Implementation case studies, "week 2 wins," integration tutorials
- **Rally**: Adoption stories, training methodology, "the phase most AI firms skip"
- **Elevate**: ROI measurement, month-over-month improvements, "AI gets better with attention"

Orchestrator ensures balanced SCORE phase coverage across any 30-day window.

### Reverse Pyramid Repurposing (Updated)

```
                    ┌───────────────────┐
                    │     PILLAR        │
                    │  Blog, keynote,   │
                    │  or YT Long Form  │
                    └────────┬──────────┘
                             │
          ┌──────────┬───────┼───────┬──────────┐
          │          │       │       │          │
    ┌─────▼────┐ ┌───▼───┐ ┌▼─────┐ ┌▼────────┐ ┌▼────────┐
    │ LinkedIn │ │  YT   │ │ Face-│ │ X       │ │ Insta   │
    │ Carousel │ │ Short │ │ book │ │ Thread  │ │ Reel    │
    │ (5-8 pg) │ │(30-60s│ │ Post │ │(3-5 tw) │ │(15-30s) │
    └─────┬────┘ └───┬───┘ └┬─────┘ └┬────────┘ └┬────────┘
          │          │      │        │           │
    ┌─────▼────┐ ┌───▼───┐ ┌▼─────┐ ┌▼────────┐ ┌▼────────┐
    │ Threads  │ │TikTok │ │ FB   │ │BlueSky  │ │ IG      │
    │ hot take │ │ Clip  │ │ Reel │ │ post    │ │ Story   │
    │          │ │(<15s) │ │      │ │         │ │         │
    └──────────┘ └───────┘ └──────┘ └─────────┘ └─────────┘
```

### Cohort Targeting (Updated)

| Cohort | Where They Are | Format Preference | Pain Points |
|--------|---------------|-------------------|-------------|
| C-Suite / Decision Makers | LinkedIn, YouTube Long Form, Facebook | Carousel, long-form video, case study | ROI clarity, competitive pressure, falling behind |
| Marketing / Ops Managers | LinkedIn, Instagram, Threads, Facebook | Reel, carousel, how-to thread | Tool overload, proving value, adoption resistance |
| Engineering / IT Teams | YouTube, BlueSky, X | Long-form video, text post, thread | Integration complexity, security, maintenance |
| General SMB Owners | Instagram, TikTok, Facebook, Threads | Reel, Short, relatable story | Fear of AI, budget, "where do I start" |

---

## F. Deployment Strategy

### Weekly Cron Architecture

All agents run on a weekly cycle via n8n Schedule Triggers:

| When | What Runs |
|------|-----------|
| **Sunday 9pm** | PCS Analyzer: pull engagement data from all 8 connected accounts, calculate PES, update weights and format performance |
| **Monday 5am** | Platform Listener + Culture Scanner + Creator Intel: collect external signals, classify, map opportunities |
| **Monday 6am** | PAC Orchestrator: process all inputs, produce content briefs + "What's Winning" briefing |
| **Monday 7am-Tuesday** | Content Generator + Brand Memory Filter: produce and validate drafts for all platforms |
| **Tuesday** | Slack notification to Jeff with full content queue for review |
| **Wed-Sun** | Approved content publishes on optimized schedule per platform |
| **Monthly (1st Sunday)** | Cohort Mapper: refresh audience segment profiles |

### Phased Rollout (30/60/90 Days)

**Phase 1: Connect + Collect (Days 1-30)**

| Week | Deliverables |
|------|-------------|
| 1-2 | Supabase schema (12 core tables including `format_performance` and `own_account_metrics`). Seed `brand_rules` from brand JSON. Connect all 8 platform APIs for own-account data. Build n8n collectors for BlueSky firehose, YouTube Data API, Reddit RSS. |
| 3-4 | Build Platform Listener + Culture Scanner (Haiku). Seed Creator Watchlist (30-50 AI creators). Deploy Creator Intel agent. Build PCS Analyzer to pull own-account metrics. Begin accumulating baseline performance data across all 8 platforms. |

**Phase 2: Generate + Review (Days 31-60)**

| Week | Deliverables |
|------|-------------|
| 5-6 | Deploy PAC Orchestrator (Sonnet, weekly). Build Content Generator with format-type awareness + Brand Memory Filter (cached prompt). Implement Reverse Pyramid workflow. Build content approval queue (Supabase + Slack). |
| 7-8 | Close the PES feedback loop. Connect publishing workflows for LinkedIn, BlueSky, X, YouTube. First agent-generated content goes live (human-approved). |

**Phase 3: Optimize + Expand (Days 61-90)**

| Week | Deliverables |
|------|-------------|
| 9-10 | Connect publishing to remaining platforms (Threads, Facebook, Instagram, TikTok). Deploy Cohort Mapper. Tune PES weights from 30+ days of own performance data. Weekly intelligence briefing fully automated. |
| 11-12 | A/B format testing (e.g., carousel vs. video on same topic). Calibrate Brand Memory Filter from Jeff's edit patterns. YouTube Shorts vs. Long Form optimization based on real data. If paid tier: integrate Trigify, Data365, Mention. |

### Human-in-the-Loop Checkpoints

1. **Content Approval Gate**: Every generated piece enters `content_queue` as `pending_review`. Nothing publishes without approval. Slack preview + one-click approve/reject.
2. **Weekly Briefing Review**: Monday briefing from Orchestrator. Jeff can override platform priorities, format emphasis, or cohort targeting.
3. **Brand Drift Alert**: If Brand Memory Filter rejects >30% of content in a single batch, Slack alert fires.
4. **Monthly PES Audit**: Jeff reviews PES weight and format performance changes before they take effect.

### Monthly Cost Estimates (Post-Build, Weekly Cadence)

| Line Item | Free Option | Paid Option |
|-----------|------------|-------------|
| Claude API — Haiku (Listener, Scanner, Creator Intel, Cohort) | ~$2-5 | ~$2-5 |
| Claude API — Sonnet (Orchestrator, Generator, Filter, PCS) | ~$25-50 | ~$40-75 |
| Claude API — prompt caching discount | -40% on Filter | -40% on Filter |
| Claude API — Batch API discount (50% off) | applied to all weekly batch | applied to all weekly batch |
| n8n cloud (existing instance) | $0 | $0-50 |
| Supabase | $0 (free tier) | $25 |
| X API Pro | $0 | $100-200 |
| Data365 (TikTok/IG/Facebook) | $0 | $99 |
| Trigify (LinkedIn intelligence) | $0 | $149 |
| Mention (sentiment/alerts) | $0 | $49 |
| Favikon (influencer intel) | $0 | $0-49 |
| **Monthly Total** | **$30-60** | **$375-635** |

---

## G. Measurement & Optimization

### KPIs by PAC Pillar

**Platform**: Organic reach per platform per week, follower growth rate, content velocity (published vs. planned), format distribution (% carousel vs. video vs. text)

**Algorithm**: PES accuracy (predicted vs. actual), high-value engagement rate (saves + shares + meaningful comments / total), completion rate by format type, YouTube Shorts vs. Long Form comparative performance

**Culture**: Cultural Window hit rate (participated within 7 days of identified moment), topic freshness, sentiment alignment

**Creator Intelligence**: Pattern detection rate (insights per week), pattern-to-content conversion rate, watchlist format trend accuracy

**Business**: Website traffic from organic social (UTM-tracked), lead generation, content-to-pipeline attribution, cost per published piece

### Learning Loops

**Weekly** (primary cycle): PCS Analyzer updates PES weights and format performance rankings from own-account data. Pattern Synthesizer produces "What's Winning" briefing. Content pillar performance ranking updated. YouTube Shorts vs. Long Form split recommendation.

**Monthly**: Brand Memory Filter calibration from Jeff's edit patterns. Platform priority rebalancing. Cohort Mapper refresh. Format effectiveness deep analysis.

**Quarterly**: Content format mix optimization. Cohort evolution assessment. Creator Watchlist refresh (add rising voices, remove stale). Full PES weight audit.

### Own-Account Performance as Primary Signal

The system weights data sources in this priority order:

1. **Kingside's own published content performance** (highest weight — what works for us)
2. **Creator Watchlist patterns** (what's working for similar voices in our space)
3. **External platform signals** (what's trending broadly)
4. **Industry benchmarks** (lowest weight — used only as baseline until own data accumulates)

After 90 days, the agent should have enough own-account data that industry benchmarks become irrelevant. The PES weights become fully calibrated to Kingside's specific audience and voice.

---

## H. Supabase Schema (Core Tables)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `raw_signals` | Unprocessed external platform data | id, platform, signal_type, raw_data (jsonb), captured_at |
| `processed_signals` | Classified external signals | id, raw_signal_id, classification, urgency_score, content_pillars (text[]), created_at |
| `own_account_metrics` | **Kingside's own performance data** | id, platform, post_id, format_type, metric_type, value, captured_at |
| `format_performance` | **Format effectiveness per platform** | id, platform, format_type, avg_pes, sample_size, trend_direction, updated_at |
| `content_opportunities` | Cultural relevance mapped signals | id, signal_ids (uuid[]), cultural_window, relevance_score, expiry_at |
| `creator_intelligence` | AI creator/influencer tracking | id, creator_handle, platform, content_format, hook_type, topic, engagement_tier, captured_at |
| `weekly_briefing` | Pattern Synthesizer + format recs | id, week_start, top_patterns (jsonb), format_trends (jsonb), yt_shorts_vs_long (jsonb), anti_patterns (jsonb) |
| `content_briefs` | Orchestrator-approved plans | id, opportunity_id, score_phase, format_type, cohort_targets (text[]), platforms (text[]), status |
| `content_queue` | Generated content awaiting review | id, brief_id, platform, format_type, content_body, brand_check_passed, human_status, published_at |
| `published_content` | Live content | id, queue_id, platform, format_type, platform_post_id, published_at |
| `engagement_metrics` | Post-publish performance | id, published_id, metric_type, value, captured_at |
| `strategy_weights` | PES weights per platform per signal | id, platform, signal_type, weight, updated_at |
| `pcs_insights` | Learnings from analysis | id, insight_type, format_related (bool), description, evidence (jsonb), created_at |
| `brand_rules` | Queryable brand constraints | id, rule_type, rule_content, source_file, active |

---

## I. Critical Files

| File | Role in PAC Agent |
|------|-------------------|
| `claudeadmin/PAC.md` | Theoretical blueprint: PES formula, platform weights, Reverse Pyramid |
| `claudeadmin/kingside_brand_schema_v4.json` | Primary brand source: forbidden lexicon, voice dimensions, content type modifiers, SCORE framework |
| `~/.claude/kingside/brand-system.json` | Voice archetype, tone examples |
| `claudeadmin/corebeliefs.md` | Core beliefs for content POV enforcement |
| `kng_n8n/CLAUDE.md` | n8n instance config and MCP tools |

---

## J. Verification Plan

1. **Phase 1 check (Day 30)**: Own-account metrics flowing from all 8 platforms. `own_account_metrics` table has 4+ weeks of data. Creator Watchlist tracking 30+ creators. Baseline PES weights established from own data.
2. **Phase 2 check (Day 60)**: First 10+ pieces of agent-generated content published (human-approved). PES scores calculated for each with format-type correlation. Brand Memory Filter rejection rate tracked. Content briefs include specific format types.
3. **Phase 3 check (Day 90)**: Weekly briefing running with format recommendations and YouTube Shorts vs. Long Form analysis. PES weights adjusted 4+ times from own data. A/B format test results available. Cost per published piece calculated.
4. **Ongoing**: Monthly organic reach comparison (before vs. after PAC Agent). Lead attribution from organic social. Format performance trends over time.
