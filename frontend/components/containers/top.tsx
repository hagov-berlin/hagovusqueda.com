import { ReactNode } from "react";
import styles from "./top.module.css";

export default function Top(props: { children: ReactNode }) {
  return <div className={styles.top}>{props.children}</div>;
}
