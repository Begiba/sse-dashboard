const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();
const PORT = 4123;
const REDIS_KEY = "sse:history";
const HISTORY_LIMIT = 30;

const redisClient = createClient({
  url: "redis://redis:6379", // must match service name in docker-compose.yml
});

redisClient.on("error", err => console.error("Redis Error:", err));

(async () => {
  await redisClient.connect();

  app.use(cors());

  const clients = [];

  // SSE endpoint
  app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    clients.push(res);

    req.on("close", () => {
      const index = clients.indexOf(res);
      if (index !== -1) clients.splice(index, 1);
    });
  });

  // Historical data endpoint
  // app.get("/history", async (req, res) => {
  //   try {
  //     const history = await redisClient.lRange(REDIS_KEY, 0, -1);
  //     const parsed = history.map(item => JSON.parse(item));
  //     res.json(parsed);
  //   } catch (err) {
  //     console.error("Error fetching history:", err);
  //     res.status(500).json({ error: "Failed to retrieve history" });
  //   }
  // });

  // Simulate system metrics and broadcast
  setInterval(async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      jobs: Math.floor(Math.random() * 10),
    };

    const str = JSON.stringify(payload);

    await redisClient.rPush(REDIS_KEY, str);
    await redisClient.lTrim(REDIS_KEY, -HISTORY_LIMIT, -1);

    clients.forEach(client => client.write(`data: ${str}\n\n`));
  }, 1000);

  app.listen(PORT, () => {
    console.log(`✅ SSE Server listening on http://localhost:${PORT}`);
  });
})();
