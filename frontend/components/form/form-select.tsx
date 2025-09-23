"use client";
import { Show } from "@/data/types";
import styles from "./form-select.module.css";
import { useSearchContext } from "@/data/context";

export default function FormSelect(props: { shows: Show[] }) {
  const { loading, show } = useSearchContext();

  const sortedShows = props.shows.sort((showA, showB) => showA.name.localeCompare(showB.name));

  return (
    <div className={`${styles.advancedOptions}  ${styles.showSelect}`}>
      <label>Buscar en</label>
      <select disabled={loading} defaultValue={show} id="hagovusqueda-search-select">
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
