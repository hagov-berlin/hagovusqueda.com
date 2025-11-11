import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const channels = [
    ["Blender", "blender", "UC6pJGaMdx5Ter_8zYbLoRgA"],
    ["Gelatina", "gelatina", "UCWSfXECGo1qK_H7SXRaUSMg"],
    ["Cenital", "cenital", "UCxHSIJgKZ8xVXwLGaGZEmKg"],
    ["Martin Cirio", "martin-cirio", "UCunKpj3RZOlrp1jpETmScWg"],
    ["El Método Rebord", "el-metodo-rebord", "UCvd-UIc-Rxtubx3uoiYbBGA"],
    ["Caricias Significativas", "caricias-significativas", "UC3fP6tXe2Y789Ubm0VTFnvA"],
    ["M.A.G.A.", "maga", ""],
    ["Paren La Mano", "paren-la-mano", "UCulzKEqyE73gXCUqTimbP4A"],
  ] as const;
  for (const [name, slug, youtubeId] of channels) {
    const payload = { name, slug, youtubeId };
    console.log(`Upserting channel ${name}`);
    console.dir(payload);
    await prisma.youtubeChannel.upsert({
      where: { slug },
      update: payload,
      create: payload,
    });
  }

  const shows = [
    ["Escucho Ofertas", "escucho-ofertas", "blender"],
    ["Desayuno Intermitente", "desayuno-intermitente", "blender"],
    ["Hay Algo Ahí", "hay-algo-ahi", "blender"],
    ["Horrible Y Fascinante", "horrible-y-fascinante", "blender"],
    ["Esto Es Cine", "esto-es-cine", "blender"],
    ["Especiales Blender", "especiales-blender", "blender"],
    ["Costa Stream", "costa-stream", "blender"],
    ["San Clemente Del Youtube", "san-clemente-del-youtube", "blender"],
    ["Balas Gratis", "balas-gratis", "blender"],
    ["El Triangulo De Hierro", "el-triangulo-de-hierro", "gelatina"],
    ["La Broma Infinita", "la-broma-infinita", "gelatina"],
    ["Bang Bang", "bang-bang", "gelatina"],
    ["Qué Olor", "que-olor", "gelatina"],
    ["Elijo Creer", "elijo-creer", "gelatina"],
    ["Circo Freak", "circo-freak", "gelatina"],
    ["El Fin De La Metáfora", "el-fin-de-la-metafora", "cenital"],
    ["On The Record", "on-the-record", "cenital"],
    ["504º", "540", "cenital"],
    ["Martin Cirio", "martin-cirio", "martin-cirio"],
    ["El Método Rebord", "el-metodo-rebord", "el-metodo-rebord"],
    ["Caricias Significativas", "caricias-significativas", "caricias-significativas"],
    ["M.A.G.A.", "maga", "maga"],
    ["Paren La Mano", "paren-la-mano", "paren-la-mano"],
    ["Industria Nacional", "industria-nacional", "gelatina"],
  ] as const;
  for (const [name, slug, channelSlug] of shows) {
    const channel = await prisma.youtubeChannel.findFirst({ where: { slug: channelSlug } });
    const payload = {
      name,
      slug,
      channelId: channel.id,
    };
    console.log(`Upserting show ${name}`);
    console.dir(payload);
    await prisma.show.upsert({
      where: { slug },
      update: payload,
      create: payload,
    });
  }

  const playlists = [
    ["PL5O_usmcHOceehge4HTMJ8A5YKWMtZA8L", "el-triangulo-de-hierro", "gelatina"],
    ["PL5O_usmcHOceRe8HPI5xlVkkRf6Y6xICi", "la-broma-infinita", "gelatina"],
    ["PL5O_usmcHOcfHhG6J9MmqnKKhUG9-pJQD", "bang-bang", "gelatina"],
    ["PL5O_usmcHOccRqyFBjppiwVwW78akPbWQ", "industria-nacional", "gelatina"],
    ["PL5O_usmcHOcc5tCV0yl6VDIxV3IYIUJWh", "que-olor", "gelatina"],
    ["PL5O_usmcHOccdxVxLCVBxvJ_2rvlxS9ab", "elijo-creer", "gelatina"],
    ["PL5O_usmcHOcc1otVGl4goDbOFuCh-HI3G", "circo-freak", "gelatina"],
    ["PL-I14u1ZEwOTqrD_fDF_CbbBhGA41MjOc", "el-fin-de-la-metafora", "cenital"],
    ["PL-I14u1ZEwOStexpLsel-GEbvGbAhD2mo", "on-the-record", "cenital"],
    ["PL-I14u1ZEwOSLsWXViSB4zxjNyPJaDTxn", "540", "cenital"],
    ["UUunKpj3RZOlrp1jpETmScWg", "martin-cirio", "martin-cirio"],
    ["PLrYeaDpClt33OD3orEdZ2GUBqG03z5a2U", "el-metodo-rebord", "el-metodo-rebord"],
    ["UU3fP6tXe2Y789Ubm0VTFnvA", "caricias-significativas", "caricias-significativas"],
    ["PLSaospqN2Pt95vDDK3S2DflxXbkcC4EcI", "maga", "maga"],
    ["PLZFDO5xhcskcu64RZf8fOX_7lb2fsgDt7", "maga", "maga"],
    ["PLoxR_077g8dKBKwRmmJLI53uo68MkB4WL", "paren-la-mano", "paren-la-mano"],
  ] as const;
  for (const [youtubeId, showSlug, channelSlug] of playlists) {
    const show = await prisma.show.findFirst({ where: { slug: showSlug } });
    const channel = await prisma.youtubeChannel.findFirst({ where: { slug: channelSlug } });
    const payload = {
      youtubeId,
      showId: show.id,
      channelId: channel.id,
    };
    console.log(`Upserting playlist ${youtubeId}`);
    console.dir(payload);
    await prisma.youtubePlaylist.upsert({
      where: { youtubeId },
      update: payload,
      create: payload,
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
