const durationRegex = /PT((\d+)H)?((\d+)M)?((\d+)S)?/;

export function isValidDuration(str: string) {
  return durationRegex.test(str) && str.length > 2;
}

export function getDurationInSeconds(durationString: string) {
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  const match = durationString.match(durationRegex);
  if (match) {
    if (match[6]) {
      seconds = parseInt(match[6]);
    }
    if (match[4]) {
      minutes = parseInt(match[4]);
    }
    if (match[2]) {
      hours = parseInt(match[2]);
    }
  }
  return seconds + minutes * 60 + hours * 60 * 60;
}
