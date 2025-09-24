"use client";

import { FormEvent, ReactNode, useRef } from "react";
import styles from "./form-element.module.css";
import { useSearchContext } from "@/data/context";

export default function FormElement(props: { children: ReactNode }) {
  const { doSearch } = useSearchContext();

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputElement = form.querySelector<HTMLInputElement>("#hagovusqueda-search-input");
    const selectElement = form.querySelector<HTMLSelectElement>("#hagovusqueda-search-select");
    if (!inputElement || !selectElement) {
      return;
    }
    const q = inputElement.value;
    const showSlug = selectElement.value;
    doSearch(q, showSlug);
  };
  return (
    <form className={styles.form} onSubmit={onSubmit} ref={formRef}>
      {props.children}
    </form>
  );
}
