import Container from "../container";

export default function FAQs() {
  return (
    <Container>
      <ul>
        <li>
          <h3>¿Cómo funciona la búsqueda?</h3>
          <p>
            La búsqueda se realiza contra los subtítulos autogenerados de Youtube de todas las
            transmisiones hasta la fecha.
          </p>
        </li>
        <li>
          <h3>¿Por qué mi búsqueda no tiene resultados?</h3>
          <p>
            Los subtítulos autogenerados de Youtube están lejos de ser perfectos. Por ejemplo,
            muchas veces no puede identificar nombres propios y tiene problemas para identificar
            palabras cuando más de una persona habla a la vez.
          </p>
        </li>
        <li>
          <h3>¿A quién le reclamo?</h3>
          <p>
            Este buscador fue hecho con 💜 por{" "}
            <a href="https://x.com/hagov_berlin" target="_blank">
              @hagov_berlin
            </a>
            . Enviar DM para sugerencias o pedidos.
          </p>
        </li>
      </ul>
    </Container>
  );
}
