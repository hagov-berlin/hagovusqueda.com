import logger from "./logger";

export default async function sleepSeconds(seconds: number) {
  logger.debug(`Sleeping ${seconds} seconds`);
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
}
