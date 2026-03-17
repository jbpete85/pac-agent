import "dotenv/config";
import { createServer } from "node:http";
import { runInsightsPipeline } from "./pipeline.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

function getOrgId(): string {
  const orgId = process.env.DEFAULT_ORG_ID;
  if (!orgId) {
    throw new Error("DEFAULT_ORG_ID environment variable is required");
  }
  return orgId;
}

// Track running pipeline to prevent concurrent runs
let pipelineRunning = false;

async function triggerPipeline(): Promise<string> {
  if (pipelineRunning) {
    return "Pipeline already running — skipping";
  }

  pipelineRunning = true;
  try {
    const orgId = getOrgId();
    console.log(`[${new Date().toISOString()}] Pipeline triggered for org: ${orgId}`);
    const runId = await runInsightsPipeline(orgId);
    console.log(`[${new Date().toISOString()}] Pipeline completed: ${runId}`);
    return `Pipeline completed: ${runId}`;
  } finally {
    pipelineRunning = false;
  }
}

// CLI mode: run once and exit
const isCliMode = process.argv.includes("--once");

if (isCliMode) {
  triggerPipeline()
    .then((result) => {
      console.log(result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Pipeline failed:", error);
      process.exit(1);
    });
} else {
  // Server mode: Railway deployment with health check + trigger endpoint
  const server = createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", pipelineRunning }));
      return;
    }

    if (req.method === "POST" && req.url === "/run") {
      // Verify cron secret if configured
      const cronSecret = process.env.CRON_SECRET;
      if (cronSecret) {
        const auth = req.headers.authorization;
        if (auth !== `Bearer ${cronSecret}`) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Unauthorized" }));
          return;
        }
      }

      res.writeHead(202, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "triggered" }));

      // Run pipeline in background (don't block response)
      triggerPipeline().catch((error) => {
        console.error("Pipeline failed:", error);
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  server.listen(PORT, () => {
    console.log(`PAC Agent server listening on port ${PORT}`);
    console.log(`  GET  /health — health check`);
    console.log(`  POST /run    — trigger pipeline`);
  });
}
