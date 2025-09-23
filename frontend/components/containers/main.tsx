import { ReactNode } from "react";
import styles from "./main.module.css";

export default function Main(props: { children: ReactNode }) {
  return <main className={styles.main}>{props.children}</main>;
}
