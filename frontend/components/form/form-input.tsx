"use client";
/* eslint-disable @next/next/no-img-element */
import { useSearchContext } from "@/data/context";
import styles from "./form-input.module.css";

export function FormInput() {
  const { searchResults, searchOptions } = useSearchContext();
  return (
    <div className={styles.inputContainer}>
      <img className={styles.searchIcon} src="/search.png" alt="Buscar" />
      <input
        id="hagovusqueda-search-input"
        type="text"
        className={styles.input}
        disabled={!!searchOptions.q && !searchResults}
        defaultValue={searchOptions.q}
        autoFocus={!searchOptions.q}
        placeholder='Por ej: "Morfleps"'
      />
    </div>
  );
}
