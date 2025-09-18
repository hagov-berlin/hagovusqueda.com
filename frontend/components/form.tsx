import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";
import styles from "./form.module.css";
import { defaultParams, urlWithQueryParams } from "./utils";
import Button from "./button";
import { useHagovSearchParams } from "./hooks";
import { Show } from "@/data/types";
import { AVAILABLE_SHOWS } from "@/data/shows";

type FormProps = {
  loading: boolean;
};

export default function Form(props: FormProps) {
  const { searchTerm, show } = useHagovSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const showSelectRef = useRef<HTMLSelectElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputRef.current || !showSelectRef.current || props.loading) return;
    const searchTerm = inputRef.current.value;
    const show = showSelectRef.current.value as Show;
    const newUrl = urlWithQueryParams({
      ...defaultParams,
      searchTerm,
      show,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.subtitle}>Buscador de dialogos en el historial de streams</h2>
      <div>
        <div className={styles.mainForm}>
          <div className={styles.inputContainer}>
            <img className={styles.searchIcon} src="/search.png" />
            <input
              type="text"
              ref={inputRef}
              className={styles.input}
              disabled={props.loading}
              defaultValue={searchTerm}
              autoFocus={!searchTerm}
              placeholder='Por ej: "Morfleps"'
            />
          </div>
          <Button searchButton>BUSCAR</Button>
        </div>
      </div>
      <div className={`${styles.advancedOptions}  ${styles.showSelect}`}>
        <label>Buscar en</label>
        <select ref={showSelectRef} disabled={props.loading} defaultValue={show}>
          {Object.entries(AVAILABLE_SHOWS)
            .sort()
            .map(([showKey, showName]) => {
              return (
                <option key={showKey} value={showKey}>
                  {showName}
                </option>
              );
            })}
        </select>
      </div>
    </form>
  );
}
