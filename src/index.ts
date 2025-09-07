import Fastify from "fastify";
import prisma from "./db";

const fastify = Fastify({ logger: true });

// Health check
fastify.get("/health", async () => {
  return { ok: true };
});

// Example DB check
fastify.get("/db-check", async () => {
  const result = await prisma.$queryRaw`SELECT 1 as alive`;
  return result;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
