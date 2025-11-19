import { PrismaClient } from "@prisma/client";
import { importYoutubePlaylist } from "./import-youtube-playlist";
import { importYoutubeSubtitles } from "./import-youtube-subtitles";

const prisma = new PrismaClient();

class PlaylistSyncJob {
  async start() {
    console.log("Starting playlist job");
    const playlists = await prisma.youtubePlaylist.findMany();
    console.log(`Found ${playlists.length} playlists`);
    for (const playlist of playlists) {
      const show = await prisma.show.findFirst({ where: { id: playlist.showId } });
      console.log(`Updating from playlist ${show.name} ${playlist.id}`);
      // await importYoutubePlaylist(prisma, playlist, 50);
    }
  }
}

class SubtitlesSyncJob {
  async start() {
    console.log("Starting subtitles job");
    // await importYoutubeSubtitles(prisma);
  }
}

async function main() {
  const playlistJob = new PlaylistSyncJob();
  playlistJob.start();

  const subtitlesJob = new SubtitlesSyncJob();
  subtitlesJob.start();
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
