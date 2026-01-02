import Link from "next/link";
import styles from "./logo.module.css";

export default function Logo() {
  return <Link href="/" className={styles.logo} />;
}
