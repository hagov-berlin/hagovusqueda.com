import Link from "next/link";
import Container from "../container";
import styles from "./header.module.css";

export default function Header() {
  return (
    <Container dark>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} />
        {/* <Link href="/canales">Canales</Link>
              <Link href="/shows">Shows</Link> */}
        <Link href="/videos">Videos</Link>
      </header>
    </Container>
  );
}
