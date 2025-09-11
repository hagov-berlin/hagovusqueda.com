import "newrelic";
import Fastify from "fastify";
import prisma from "./db";
import cors from "@fastify/cors";
import { videos, video } from "./video";
import search from "./search";

const fastify = Fastify({ logger: true });

fastify.get("/", () => ({ msg: "api.hagovusqueda.com", link: "https://hagovusqueda.com" }));

fastify.get("/health", () => ({ ok: true }));

fastify.get("/db-check", async () => {
  const result = await prisma.$queryRaw`SELECT 1 as alive`;
  return result;
});

fastify.get("/favicon.ico", (req, res) => res.status(204)); // TODO

fastify.get("/videos", videos);

fastify.get("/videos/:id", video);

fastify.get("/search", search);

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: "*",
    });
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
