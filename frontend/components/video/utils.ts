export function parseDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-AR");
}

export function secondsToTime(milisecondsNumber: number) {
  const cleanedSeconds = Math.max(0, milisecondsNumber / 1000);
  const hoursString = Math.floor(cleanedSeconds / 60 / 60)
    .toString()
    .padStart(2, "0");
  const minutesString = Math.floor((cleanedSeconds % (60 * 60)) / 60)
    .toString()
    .padStart(2, "0");
  const secondsString = Math.floor(cleanedSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hoursString}:${minutesString}:${secondsString}`;
}
