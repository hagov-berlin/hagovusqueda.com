import { ReactNode } from "react";
import styles from "./index.module.css";

type ContainerProps = {
  children: ReactNode;
  dark?: boolean;
  className?: string;
};

export default function Container(props: ContainerProps) {
  const className = `${styles.container} ${props.className || ""}`;
  const wrappedContent = <div className={className}>{props.children}</div>;
  if (props.dark) {
    return <div className={styles.darkBackground}>{wrappedContent}</div>;
  }
  return wrappedContent;
}
