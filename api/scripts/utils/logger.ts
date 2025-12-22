class Logger {
  shouldLog(messageLevel: string) {
    const targetLevel = process.env.LOG_LEVEL || "info";
    if (messageLevel === "debug") {
      return targetLevel === "debug";
    }
    if (messageLevel === "info") {
      return targetLevel === "debug" || targetLevel === "info";
    }
    if (messageLevel === "warn") {
      return targetLevel === "debug" || targetLevel === "info" || targetLevel === "warn";
    }
    if (messageLevel === "error") {
      return (
        targetLevel === "debug" ||
        targetLevel === "info" ||
        targetLevel === "warn" ||
        targetLevel === "error"
      );
    }
  }

  printMsg(level: string, ...args: unknown[]) {
    console.log(new Date().toISOString(), `[${level.toUpperCase()}]`, ...args);
  }

  debug(...args: unknown[]) {
    if (this.shouldLog("debug")) this.printMsg("debug", ...args);
  }

  info(...args: unknown[]) {
    if (this.shouldLog("info")) this.printMsg("info", ...args);
  }

  warn(...args: unknown[]) {
    if (this.shouldLog("warn")) this.printMsg("warn", ...args);
  }

  error(...args: unknown[]) {
    if (this.shouldLog("error")) this.printMsg("error", ...args);
  }
}

export default new Logger();
