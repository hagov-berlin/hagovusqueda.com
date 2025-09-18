import styles from "./button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  searchButton?: boolean;
};

export default function Button(props: ButtonProps) {
  const { children, searchButton } = props;
  const className = `${styles.button} ${searchButton ? styles.searchButton : ""}`;
  return (
    <button type={searchButton ? "submit" : "button"} className={className}>
      {children}
    </button>
  );
}
