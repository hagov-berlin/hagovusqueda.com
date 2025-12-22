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
    ["Nico Guthmann", "nico-guthmann", "UCpvYnSZNyBxF2MSWvju06jg"],
    ["Vorterix", "vorterix", "UCvCTWHCbBC0b9UIeLeNs8ug"],
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
    ["La Venganza Será Terrible", "la-venganza-sera-terrible", "blender"],
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
    ["TUGO", "tugo", "nico-guthmann"],
    ["Desde el Respeto", "desde-el-respeto", "vorterix"],
  ] as const;
  for (const [name, slug, channelSlug] of shows) {
    const channel = await prisma.youtubeChannel.findFirst({ where: { slug: channelSlug } });
    if (!channel) throw new Error(`Channel not found: ${channelSlug}`);
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
    ["PLLC_s8HBnRWOBAMqYhE47Tax3XxmGFuZV", "escucho-ofertas"],
    ["PLLC_s8HBnRWOU-c1zN87IbJQnzAegfyew", "desayuno-intermitente"],
    ["PLLC_s8HBnRWPshIL4NPIPRHnFd4T0hMmv", "hay-algo-ahi"],
    ["PLLC_s8HBnRWNlrFN3raYpVLFOp7mC6h-v", "horrible-y-fascinante"],
    ["PLLC_s8HBnRWNyxIuOS6bAHM0WzwSCZwwM", "esto-es-cine"],
    ["PLLC_s8HBnRWMS642ws6_yypumvey-kJGZ", "la-venganza-sera-terrible"],
    // ["", "especiales-blender"],
    ["PLLC_s8HBnRWPsXL3oZ7k4-kIFUQeOo7T3", "costa-stream"],
    ["PLLC_s8HBnRWOOMVYDgQtilkCW2Y-4Duw2", "san-clemente-del-youtube"],
    ["PLLC_s8HBnRWMpr5HPchdk3O7dwkZBUviz", "balas-gratis"],
    ["PL5O_usmcHOceehge4HTMJ8A5YKWMtZA8L", "el-triangulo-de-hierro"],
    ["PL5O_usmcHOceRe8HPI5xlVkkRf6Y6xICi", "la-broma-infinita"],
    ["PL5O_usmcHOcfHhG6J9MmqnKKhUG9-pJQD", "bang-bang"],
    ["PL5O_usmcHOccRqyFBjppiwVwW78akPbWQ", "industria-nacional"],
    ["PL5O_usmcHOcc5tCV0yl6VDIxV3IYIUJWh", "que-olor"],
    ["PL5O_usmcHOccdxVxLCVBxvJ_2rvlxS9ab", "elijo-creer"],
    ["PL5O_usmcHOcc1otVGl4goDbOFuCh-HI3G", "circo-freak"],
    ["PL-I14u1ZEwOTqrD_fDF_CbbBhGA41MjOc", "el-fin-de-la-metafora"],
    ["PL-I14u1ZEwOStexpLsel-GEbvGbAhD2mo", "on-the-record"],
    ["PL-I14u1ZEwOSLsWXViSB4zxjNyPJaDTxn", "540"],
    ["UUunKpj3RZOlrp1jpETmScWg", "martin-cirio"],
    ["PLrYeaDpClt33OD3orEdZ2GUBqG03z5a2U", "el-metodo-rebord"],
    ["UU3fP6tXe2Y789Ubm0VTFnvA", "caricias-significativas"],
    ["PLSaospqN2Pt95vDDK3S2DflxXbkcC4EcI", "maga"],
    ["PLZFDO5xhcskcu64RZf8fOX_7lb2fsgDt7", "maga"],
    ["PLoxR_077g8dKBKwRmmJLI53uo68MkB4WL", "paren-la-mano"],
    ["PL_0h1CfACxbUYq-VBx4-hLdd3MaJFclGt", "tugo"],
    ["PLHZOhV2rP0rkfCYg81UotG0J2-aD5x0M8", "desde-el-respeto"],
  ] as const;
  for (const [youtubeId, showSlug] of playlists) {
    const show = await prisma.show.findFirst({ where: { slug: showSlug } });
    if (!show) throw new Error(`Show not found: ${showSlug}`);
    const payload = {
      youtubeId,
      showId: show.id,
      channelId: show.channelId,
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
