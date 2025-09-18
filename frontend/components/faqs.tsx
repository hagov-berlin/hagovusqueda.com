import styles from "./faqs.module.css";

export default function FAQs() {
  return (
    <ul className={styles.faqs}>
      <li>
        <h3>¿Cómo funciona la búsqueda?</h3>
        <p>
          La búsqueda se realiza contra los subtitulos autogenerados de Youtube de todas las
          transmiciones hasta la fecha.
        </p>
      </li>
      <li>
        <h3>¿Por qué mi busqueda no tiene resultados?</h3>
        <p>
          Los subtitulos autogenerados de Youtube están lejos de ser perfectos. Por ej, muchas veces
          no puede identificar nombres propios y tiene problemas para identificar palabras cuando
          mas de una persona habla a la vez.
        </p>
      </li>
      <li>
        <h3>¿A quien le reclamo?</h3>
        <p>
          Este buscador fue hecho con 💜 por{" "}
          <a href="https://x.com/hagov_berlin" target="_blank">
            @hagov_berlin
          </a>
          . Enviar DM para sugerencias o pedidos.
        </p>
      </li>
    </ul>
  );
}
