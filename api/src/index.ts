import "newrelic";
import Fastify from "fastify";
import fs from "fs";
import path from "path";
import cors from "@fastify/cors";

import prisma from "./db";
import { channels, channel } from "./channel";
import { shows, show } from "./show";
import { videos, video } from "./video";
import search from "./search";
import stats from "./stats";

const fastify = Fastify({ logger: true, routerOptions: { ignoreTrailingSlash: true } });

fastify.get("/", () => ({ msg: "api.hagovusqueda.com", link: "https://hagovusqueda.com" }));

fastify.get("/health", () => ({ ok: true }));

fastify.get("/db-check", async () => {
  const result = await prisma.$queryRaw`SELECT 1 as alive`;
  return result;
});

const ico = fs.readFileSync(path.join(__dirname, "../favicon.ico"));
fastify.get("/favicon.ico", (req, res) => {
  res.header("Content-Type", "image/x-icon");
  res.send(ico);
});

fastify.get("/channels", channels);
fastify.get("/channels/:slug", channel);

fastify.get("/shows", shows);
fastify.get("/shows/:slug", show);

fastify.get("/videos", videos);
fastify.get("/videos/:id", video);

fastify.get("/search", search);

fastify.get("/stats", stats);

const start = async () => {
  const port = 3001;
  try {
    await fastify.register(cors, {
      origin: "*",
    });
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
