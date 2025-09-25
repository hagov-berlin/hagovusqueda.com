"use client";
import styles from "./form-select.module.css";
import { useSearchContext } from "@/data/context";

export default function FormSelect() {
  const { searchOptions, searchResults, availableShows } = useSearchContext();

  const sortedShows = availableShows.sort((showA, showB) => showA.name.localeCompare(showB.name));

  return (
    <div className={`${styles.advancedOptions}  ${styles.showSelect}`}>
      <label>Buscar en</label>
      <select
        disabled={searchResults.loading}
        defaultValue={searchOptions.showSlug}
        id="hagovusqueda-search-select"
      >
        <option value="todo">Todo</option>
        {sortedShows.map((show) => {
          return (
            <option key={show.slug} value={show.slug}>
              {show.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
