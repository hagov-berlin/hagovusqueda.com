import Container from "@/components/container";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <Container className={styles.notFoundContainer}>
      <h2>¿Nada por acá?</h2>
      <div className={styles.iframeContainer}>
        <iframe className={styles.hagovYDragones} src="https://hagovydragones.com" />
      </div>
    </Container>
  );
}
