import Link from "next/link";
import styles from "./button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  searchButton?: boolean;
  href?: string;
};

export default function Button(props: ButtonProps) {
  const { children, searchButton, href } = props;
  const className = `${styles.button} ${searchButton ? styles.searchButton : ""}`;
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={searchButton ? "submit" : "button"} className={className}>
      {children}
    </button>
  );
}
