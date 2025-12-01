function normalizeText(text: string, ignoreAccents: boolean) {
  text = text.replace(/[,\.¿\?¡!\-]/g, "");
  if (ignoreAccents) {
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return text.replace(/\s+/g, " ");
}

export default function buildTextRegex(
  q: string,
  ignoreAccents: boolean = true,
  matchWholeWords: boolean = false
) {
  const normalizedSearchTerm = normalizeText(q, ignoreAccents);
  const regexString = matchWholeWords ? `\\b${normalizedSearchTerm}\\b` : normalizedSearchTerm;
  const searchRegex = new RegExp(regexString, "i");
  return function testRegex(textToTest: string) {
    const normalizedTextToTest = normalizeText(textToTest, ignoreAccents);
    return searchRegex.test(normalizedTextToTest);
  };
}
