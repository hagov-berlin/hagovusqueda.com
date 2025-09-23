import { getShows } from "@/data/api-client";
import Button from "../common/button";
import FormElement from "./form-element";
import { FormInput } from "./form-input";
import styles from "./index.module.css";
import FormSelect from "./form-select";
import Container from "../container";

export default async function FormFontainer() {
  const shows = await getShows();

  return (
    <Container dark className={styles.formContainer}>
      <FormElement>
        <h2 className={styles.subtitle}>Buscador de dialogos en el historial de streams</h2>
        <div>
          <div className={styles.mainForm}>
            <FormInput />
            <Button searchButton>BUSCAR</Button>
          </div>
        </div>
        <FormSelect shows={shows} />
      </FormElement>
    </Container>
  );
}
