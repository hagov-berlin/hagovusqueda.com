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

fastify.get("/videos", async () => {
  return await prisma.youtubeVideo.findMany();
});

fastify.post("/videos", async (req: any) => {
  const { id, title, show, duration, date } = req.body;
  return await prisma.youtubeVideo.create({
    data: { id, title, show, duration, date: new Date(date) },
  });
});

// Get a video with subtitles
fastify.get("/videos/:id", async (req: any) => {
  const { id } = req.params;
  return await prisma.youtubeVideo.findUnique({
    where: { id },
    include: { subtitles: true },
  });
});

// Add a subtitle to a video
fastify.post("/videos/:id/subtitles", async (req: any) => {
  const { id } = req.params;
  const { startTime, endTime, text } = req.body;
  return await prisma.subtitle.create({
    data: {
      startTime,
      endTime,
      text,
      videoId: id,
    },
  });
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
