import { Metadata } from "next";
import Container from "@/components/container";
import { getStats } from "@/data/api-client";

export default async function Estadisticas() {
  const stats = await getStats();

  return (
    <Container>
      <h1>Estadisticas</h1>
      <div>
        <p>Cantidad de streams: {stats.showCount.toLocaleString()}</p>
        <p>Cantidad de videos: {stats.videoCount.toLocaleString()}</p>
      </div>
    </Container>
  );
}

export const metadata: Metadata = {
  title: "HAGOVusqueda - Estadisticas",
};
