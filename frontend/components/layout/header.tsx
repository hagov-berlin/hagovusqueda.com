import Link from "next/link";
import Container from "../container";
import styles from "./header.module.css";
import Logo from "../common/logo";

export default function Header() {
  return (
    <Container dark>
      <header className={styles.header}>
        <Logo />
        {/* <Link href="/canales">Canales</Link>
              <Link href="/shows">Shows</Link> */}
        <Link href="/videos">Videos</Link>
      </header>
    </Container>
  );
}
