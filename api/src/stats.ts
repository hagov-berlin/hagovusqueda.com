import prisma from "./db";

export default async function stats() {
  return {
    videoCount: await prisma.youtubeVideo.count({ where: { ignored: false } }),
    showCount: await prisma.show.count(),
  };
}
