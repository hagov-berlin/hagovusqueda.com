"use client";
import { useSearchContext } from "@/data/context";
import styles from "./form-input.module.css";

export function FormInput() {
  const { loading, q } = useSearchContext();
  return (
    <div className={styles.inputContainer}>
      <img className={styles.searchIcon} src="/search.png" />
      <input
        id="hagovusqueda-search-input"
        type="text"
        className={styles.input}
        disabled={loading}
        defaultValue={q}
        autoFocus={!q}
        placeholder='Por ej: "Morfleps"'
      />
    </div>
  );
}
